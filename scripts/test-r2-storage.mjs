import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.R2_BUCKET_NAME;
const key = `test/r2-connection-test-${crypto.randomUUID()}.txt`;
const content = "ShutterChance R2 storage test";

try {
  // 1. アップロード
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: content,
    ContentType: "text/plain",
  }));
  console.log("1. アップロード成功");

  // 2. 存在確認
  const head = await client.send(new HeadObjectCommand({
    Bucket: bucket,
    Key: key,
  }));
  console.log("2. 存在確認成功:", head.ContentLength, "bytes");

  // 3. 署名付きURL発行
  const url = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    { expiresIn: 3600 }
  );
  console.log("3. 署名付きURL発行成功");

  // 4. URLから取得
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`GET failed: ${response.status}`);
  }

  const downloaded = await response.text();

  if (downloaded !== content) {
    throw new Error("取得した内容が一致しません");
  }
  console.log("4. 署名付きURLからの取得成功");

} finally {
  // 5. テストファイル削除
  try {
    await client.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }));
    console.log("5. テストファイル削除成功");
  } finally {
    client.destroy();
  }
}