import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export async function UploadToS3(file: File) {
  try {
    const s3 = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });

    const filePath = `uploads/${Date.now().toString()}-${file.name.replace(
      " ",
      "-"
    )}`;
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
      Key: filePath,
      Body: file,
      ContentType: "application/pdf",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    //console.log(`Successfully uploaded to S3: ${filePath}`);

    return {
      filePath,
      fileName: file.name,
    };
  } catch (error) {
    console.error(`File upload error ${error}`);
  }
}

export function getS3Url(fileKey: string) {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_REGION}.amazonaws.com/${fileKey}`;
  return url;
}

export async function downloadFileFromS3(fileKey: string) {
  try {
    const s3 = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
      Key: fileKey,
    };

    const command = new GetObjectCommand(params);
    const response: GetObjectCommandOutput = await s3.send(command);

    const tempDir = path.join(process.cwd(), "public", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const date = Date.now();
    const filePath = path.join(tempDir, `pdf-${date}.pdf`);

    const writableStream = fs.createWriteStream(filePath);
    if (response.Body) {
      if (isReadableStream(response.Body)) {
        response.Body.pipe(writableStream);
      } else {
        const nodeReadable = Readable.from(response.Body as any);
        nodeReadable.pipe(writableStream);
      }
    } else {
      throw new Error("No body in S3 response.");
    }

    await new Promise((resolve, reject) => {
      writableStream.on("finish", resolve);
      writableStream.on("error", reject);
    });

    return filePath;
  } catch (error) {
    console.error(`Downloading from s3 error ${error}`);
    return null;
  }
}

export async function deleteFileFromS3(filePath: string) {
  try {
    const s3 = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
      Key: filePath,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    return { message: "File deleted successfully" };
  } catch (error) {
    console.error(`Deleting from s3 error ${error}`);
    return null;
  }
}

function isReadableStream(stream: unknown): stream is Readable {
  return (
    stream !== null &&
    typeof stream === "object" &&
    typeof (stream as Readable).pipe === "function"
  );
}
