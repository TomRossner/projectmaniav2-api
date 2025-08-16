import {S3Client} from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

export const S3 = new S3Client({
   region: process.env.AWS_REGION as string,
   credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
   }
});