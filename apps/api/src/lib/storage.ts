import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../env.js";

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (!_client) {
    _client = new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION ?? "us-east-1",
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY ?? "",
        secretAccessKey: env.S3_SECRET_KEY ?? "",
      },
      forcePathStyle: true,
    });
  }
  return _client;
}

export async function uploadImage(
  key: string,
  data: Buffer,
  contentType = "image/webp",
): Promise<string> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET ?? "itareport",
      Key: key,
      Body: data,
      ContentType: contentType,
    }),
  );
  return key;
}
