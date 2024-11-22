import AWS from "aws-sdk";

export async function UploadToS3(file: File) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_WS_SECRET_ACCESS_KEY,
    });
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      },
      region: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_REGION,
    });
    const fileKey = `uploads/${Date.now().toString()}${file.name.replace(
      " ",
      "-"
    )}`;
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: file,
    };

    const upload = s3.putObject(params).promise();
    await upload.then(() => {
      console.log(`Successfully uploaded to s3 ${fileKey}`);
    });

    return Promise.resolve({
      fileKey,
      fileName: file.name,
    });
  } catch (error) {
    console.error(`File upload error ${error}`);
  }
}

export function getS3Url(fileKey: string) {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_REGION}.amazonaws.com/${fileKey}`;
  return url;
}
