import { normaliseContent, type SiteContent } from "@/data/contentModel";
import { isVideoFile } from "@/lib/media";

export type LoginResult = { ok: true } | { ok: false; error: string };

export type MediaKind = "image" | "video";

export type CloudinaryMedia = {
  publicId: string;
  url: string;
  width: number;
  height: number;
  kind: MediaKind;
};

/** A single batch is small enough for a phone to finish in one go. */
export const MAX_UPLOAD_BATCH = 15;

const UPLOAD_CONCURRENCY = 3;

export type UploadBatchResult = {
  media: CloudinaryMedia[];
  errors: string[];
};

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === "string" && body.error) return body.error;
  } catch {
    /* ignore */
  }
  return fallback;
}

export async function getSession(): Promise<boolean> {
  try {
    const response = await fetch("/api/session", {
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) return false;
    const body = (await response.json()) as { authenticated?: unknown };
    return body.authenticated === true;
  } catch {
    return false;
  }
}

export async function login(password: string): Promise<LoginResult> {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) return { ok: true };
    return { ok: false, error: await readError(response, "Could not sign in.") };
  } catch {
    return { ok: false, error: "Network error. Check your connection." };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    /* ignore */
  }
}

export async function fetchContent(): Promise<SiteContent | null> {
  try {
    const response = await fetch("/api/content", { cache: "no-store" });
    if (!response.ok) return null;
    const body = (await response.json()) as { content?: unknown };
    return normaliseContent(body.content);
  } catch {
    return null;
  }
}

export async function saveContent(
  content: SiteContent,
): Promise<{ version: number; updatedAt: string }> {
  const response = await fetch("/api/content", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error(await readError(response, `Save failed (${response.status}).`));
  }
  return (await response.json()) as { version: number; updatedAt: string };
}

function withTransformations(url: string, kind: MediaKind): string {
  if (kind === "video") {
    /* Keep the original video codec; only ask Cloudinary for a sensible
       quality/bitrate. The browser streams the file instead of downloading it. */
    return url.replace("/upload/", "/upload/q_auto/");
  }

  /* f_auto/q_auto lets Cloudinary serve WebP/AVIF at a sensible quality; the
     width cap keeps a phone from downloading a 4000px original. */
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_1600,c_limit/");
}

async function getUploadSignature(): Promise<{
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}> {
  const signatureResponse = await fetch("/api/cloudinary-sign", {
    credentials: "include",
    cache: "no-store",
  });
  if (!signatureResponse.ok) {
    throw new Error(
      await readError(signatureResponse, "Could not prepare the upload."),
    );
  }
  return (await signatureResponse.json()) as {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    folder: string;
    signature: string;
  };
}

export async function uploadMediaFile(file: File): Promise<CloudinaryMedia> {
  const signature = await getUploadSignature();
  const kind: MediaKind = isVideoFile(file) ? "video" : "image";

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.apiKey);
  form.append("timestamp", String(signature.timestamp));
  form.append("folder", signature.folder);
  form.append("signature", signature.signature);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/${kind}/upload`,
    { method: "POST", body: form },
  );

  if (!uploadResponse.ok) {
    let message = "Upload failed.";
    try {
      const body = (await uploadResponse.json()) as {
        error?: { message?: string };
      };
      if (body.error?.message) message = body.error.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const data = (await uploadResponse.json()) as {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
  };

  return {
    publicId: data.public_id,
    url: withTransformations(data.secure_url, kind),
    width: data.width,
    height: data.height,
    kind,
  };
}

export async function uploadImage(file: File): Promise<CloudinaryMedia> {
  return uploadMediaFile(file);
}

/**
 * Uploads several photos/videos with a small amount of concurrency and reports
 * how many have finished. A failed file does not stop the rest of the batch.
 */
export async function uploadMedia(
  files: readonly File[],
  onProgress?: (completed: number, total: number) => void,
): Promise<UploadBatchResult> {
  const results: Array<CloudinaryMedia | null> = new Array(files.length).fill(
    null,
  );
  const errors: string[] = [];
  let next = 0;
  let completed = 0;

  const worker = async () => {
    for (;;) {
      const index = next;
      next += 1;
      if (index >= files.length) return;

      try {
        results[index] = await uploadMediaFile(files[index]);
      } catch (cause) {
        errors.push(
          cause instanceof Error ? cause.message : "Upload failed.",
        );
      } finally {
        completed += 1;
        onProgress?.(completed, files.length);
      }
    }
  };

  await Promise.all(
    Array.from(
      { length: Math.min(UPLOAD_CONCURRENCY, files.length) },
      () => worker(),
    ),
  );

  return {
    media: results.filter(
      (media): media is CloudinaryMedia => media !== null,
    ),
    errors,
  };
}
