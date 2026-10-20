// Client-side image compression before upload: phones produce 4000px+ JPEGs
// of several MB; storing them resized saves storage, bandwidth and upload time.

export type CompressedImage = { blob: Blob; width: number; height: number; type: string };

export async function compressImage(
  file: File,
  maxSize = 2400,
  quality = 0.82,
): Promise<CompressedImage> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(
      `${file.name}: this format can't be read by the browser. Use JPG, PNG or WebP.`,
    );
  }

  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

  // Browsers that can't encode WebP silently return PNG; fall back to JPEG then.
  let blob = await encode("image/webp");
  if (!blob || blob.type !== "image/webp") blob = await encode("image/jpeg");
  if (!blob) throw new Error(`${file.name}: compression failed.`);

  return { blob, width, height, type: blob.type };
}
