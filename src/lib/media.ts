const VIDEO_EXTENSION = /\.(mp4|webm|ogv|mov|m4v)(?:[?#]|$)/i;
const IMAGE_EXTENSION = /\.(jpe?g|png|webp|gif|avif|heic|heif)(?:[?#]|$)/i;

export function isVideoUrl(url: string): boolean {
  return /\/video\/upload\//i.test(url) || VIDEO_EXTENSION.test(url);
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/") || VIDEO_EXTENSION.test(file.name);
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || IMAGE_EXTENSION.test(file.name);
}

export function isMediaFile(file: File): boolean {
  return isImageFile(file) || isVideoFile(file);
}
