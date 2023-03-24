import { S3Client } from "@aws-sdk/client-s3";
import { getConfigOption } from "../config";
// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const AWS_ACCESS_KEY_ID = getConfigOption("AWS_ACCESS_KEY_ID");
const AWS_SECRET_ACCESS_KEY = getConfigOption("AWS_SECRET_ACCESS_KEY");
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
export { s3Client };
