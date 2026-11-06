import { isVideoUrl } from "@/lib/media";

type MediaProps = {
  src: string;
  alt?: string;
  className?: string;
  controls?: boolean;
  muted?: boolean;
  loading?: "eager" | "lazy";
  decoding?: "async" | "auto" | "sync";
  width?: number;
  height?: number;
};

/**
 * Renders a Cloudinary/local image or video from the same URL field. Videos stay
 * muted and loop when used as a tile; controls are enabled for the lightbox and
 * run story, where someone can actually watch them.
 */
export function Media({
  src,
  alt = "",
  className,
  controls = false,
  muted = true,
  loading = "lazy",
  decoding = "async",
  width,
  height,
}: MediaProps) {
  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        aria-label={alt || (controls ? "Video" : undefined)}
        aria-hidden={!controls && !alt ? true : undefined}
        className={className}
        controls={controls}
        muted={muted}
        playsInline
        loop={!controls}
        preload="metadata"
        width={width}
        height={height}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      width={width}
      height={height}
      className={className}
    />
  );
}
