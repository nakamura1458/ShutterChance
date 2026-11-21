import {
  S3Client,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.error("R2環境変数が不足しています。");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

try {
  await client.send(
    new HeadBucketCommand({
      Bucket: bucketName,
    })
  );

  console.log("R2接続成功！");
  console.log(`Bucket: ${bucketName}`);
} catch (error) {
  console.error("R2接続失敗");

  console.error("Error name:", error.name);
  console.error("Error message:", error.message);

  process.exitCode = 1;
} finally {
  client.destroy();
}
