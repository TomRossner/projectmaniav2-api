import { v4 as uuid } from "uuid";
import { config } from "dotenv";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { S3 } from "./aws.config.js";

config();

export const getImageContentType = (imgSrc: string): string | undefined => {
    if (imgSrc.startsWith('http')) return undefined;

    if (imgSrc.startsWith('data:image/jpeg;')) {
        return 'image/jpeg';
    }
    
    if (imgSrc.startsWith('data:image/png;')) {
        return 'image/png';
    }

    else return undefined;
}

export const createFileName = (type: 'user' | 'task'): string => {
    return `${type === 'task'
        ? 'task_thumbnail'
        : 'user_profile_picture'
    }__${uuid()}`;
}

export const processImage = async (imgSrc: string, fileNameType: 'user' | 'task'): Promise<string> => {
    try {
        const contentType = getImageContentType(imgSrc);
        const fileName = createFileName(fileNameType);

        console.log("contentType: ", contentType)
        console.log("fileName: ", fileName)

        if (!fileName) {
            throw new Error('Failed uploading image');
        }

        if (!contentType) {
            return imgSrc;
        }

        const imageData = await uploadImageToS3({
            imgSrc,
            contentType,
            fileName
        });

        console.log(imageData)
        const imageUrl = constructImageUrl(fileName);
        return imageUrl;
        // return imageData.Location;
    } catch (error) {
        console.error(error);
        return imgSrc;
    }
}

export type S3ImageParams = {
    imgSrc: string;
    fileName: string;
    contentType: string;
}

export const constructImageUrl = (fileName: string): string => {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

export const uploadImageToS3 = async ({ imgSrc, fileName, contentType }: S3ImageParams) => {
    const base64Data = Buffer.from(imgSrc.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const isDataURL = imgSrc.startsWith('data:image');

    try {
        const uploadParams: PutObjectCommandInput = {
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Key: fileName,
            Body: isDataURL ? base64Data : imgSrc,
            ContentType: contentType,
            ContentEncoding: !isDataURL ? 'base64' : undefined,
            ACL: 'public-read',
        };

        const command = new PutObjectCommand(uploadParams);
        return await S3.send(command);
    } catch (error) {
        console.error(error);
        throw new Error('AWS Error - Failed uploading resource');
    }
};
