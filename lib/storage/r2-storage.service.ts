import "server-only";

import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  getR2BucketName,
  getR2Client,
} from "@/lib/storage/r2";

// ========================================
// 型定義
// ========================================

type UploadObjectParams = {
  key: string;
  body: PutObjectCommandInput["Body"];
  contentType: string;
};

type SignedUploadUrlParams = {
  key: string;
  contentType: string;
  expiresIn?: number;
};

type SignedDownloadUrlParams = {
  key: string;
  expiresIn?: number;
};

// ========================================
// R2へ直接アップロード
// サーバー側からのアップロード用
// ========================================

export async function uploadObject({
  key,
  body,
  contentType,
}: UploadObjectParams) {
  const client = getR2Client();
  const bucket = getR2BucketName();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

// ========================================
// 署名付きアップロードURL発行
// ブラウザからのアップロード用
// ========================================

export async function getSignedUploadUrl({
  key,
  contentType,
  expiresIn = 300,
}: SignedUploadUrlParams) {
  const client = getR2Client();
  const bucket = getR2BucketName();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(client, command, {
    expiresIn,
  });
}

// ========================================
// 署名付きダウンロードURL発行
// ========================================

export async function getSignedDownloadUrl({
  key,
  expiresIn = 3600,
}: SignedDownloadUrlParams) {
  const client = getR2Client();
  const bucket = getR2BucketName();

  // GET用の署名付きURLを発行
  const { GetObjectCommand } = await import(
    "@aws-sdk/client-s3"
  );

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(client, command, {
    expiresIn,
  });
}

// ========================================
// R2オブジェクト削除
// ========================================

export async function deleteObject(key: string) {
  const client = getR2Client();
  const bucket = getR2BucketName();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

// ========================================
// R2オブジェクト存在確認・メタデータ取得
// ========================================

export async function headObject(key: string) {
  const client = getR2Client();
  const bucket = getR2BucketName();

  try {
    const result = await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    return {
      exists: true,
      contentLength: result.ContentLength ?? 0,
      contentType: result.ContentType ?? null,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      ["NotFound", "NoSuchKey"].includes(error.name)
    ) {
      return null;
    }

    throw error;
  }
}
