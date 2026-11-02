import { normaliseContent, type SiteContent } from "@/data/contentModel";

export type LoginResult = { ok: true } | { ok: false; error: string };

export type CloudinaryImage = {
  publicId: string;
  url: string;
  width: number;
  height: number;
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

function withTransformations(url: string): string {
  /* f_auto/q_auto lets Cloudinary serve WebP/AVIF at a sensible quality; the
     width cap keeps a phone from downloading a 4000px original. */
  return url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_1600,c_limit/",
  );
}

export async function uploadImage(file: File): Promise<CloudinaryImage> {
  const signatureResponse = await fetch("/api/cloudinary-sign", {
    credentials: "include",
    cache: "no-store",
  });
  if (!signatureResponse.ok) {
    throw new Error(
      await readError(signatureResponse, "Could not prepare the upload."),
    );
  }

  const signature = (await signatureResponse.json()) as {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    folder: string;
    signature: string;
  };

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.apiKey);
  form.append("timestamp", String(signature.timestamp));
  form.append("folder", signature.folder);
  form.append("signature", signature.signature);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
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
    url: withTransformations(data.secure_url),
    width: data.width,
    height: data.height,
  };
}
