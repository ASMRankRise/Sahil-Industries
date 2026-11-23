import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const env = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};
let client: S3Client | undefined;
const getClient = () =>
  (client ||= new S3Client({
    region: "auto",
    endpoint: env("R2_ENDPOINT"),
    credentials: {
      accessKeyId: env("R2_ACCESS_KEY_ID"),
      secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
    },
  }));
const bucket = () => env("R2_BUCKET_NAME");
export const r2Client = {
  upload: (key: string, body: Uint8Array | Buffer, contentType?: string) =>
    getClient().send(
      new PutObjectCommand({
        Bucket: bucket(),
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    ),
  download: (key: string) =>
    getClient().send(new GetObjectCommand({ Bucket: bucket(), Key: key })),
  delete: (key: string) =>
    getClient().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key })),
  list: (prefix?: string) =>
    getClient().send(
      new ListObjectsV2Command({ Bucket: bucket(), Prefix: prefix }),
    ),
  presignedUrl: (key: string, expiresIn = 3600) =>
    getSignedUrl(
      getClient(),
      new GetObjectCommand({ Bucket: bucket(), Key: key }),
      { expiresIn },
    ),
};
