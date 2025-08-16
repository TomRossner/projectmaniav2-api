import { Request, Response } from "express";
import { constructImageUrl, uploadImageToS3 } from "../aws/aws.utils.js";

export const uploadImageHandler = async (req: Request, res: Response) => {
    try {
        const {
            imgUrl,
            fileName,
            contentType
        } = req.body;

        await uploadImageToS3({imgSrc: imgUrl, fileName, contentType});
        
        const imageUrl = constructImageUrl(fileName);

        res.status(200).send(imageUrl);
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
}