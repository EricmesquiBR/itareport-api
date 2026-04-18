import sharp from "sharp";

export interface ProcessedImage {
  original: Buffer;
  thumbnail: Buffer;
}

export async function processImage(input: Buffer): Promise<ProcessedImage> {
  const [original, thumbnail] = await Promise.all([
    sharp(input)
      .resize(4096, 4096, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer(),
    sharp(input)
      .resize(320, 320, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer(),
  ]);
  return { original, thumbnail };
}
