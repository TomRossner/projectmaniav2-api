import sharp from "sharp";

type PNG = "png";
type JPEG = "jpeg";

type Format = PNG | JPEG;

const isJPEG = (imgData: string): imgData is JPEG => {
    return imgData.includes('data:image/jpeg');
}

const isPNG = (imgData: string): imgData is PNG => {
    return imgData.includes('data:image/png');
}

async function compressTo(format: Format, imgData: Buffer): Promise<Buffer> {
    return await sharp(imgData)
                            .toFormat(format)
                            .resize({width: 150})
                            .png({quality: 100})
                            .toBuffer();
}

// Process PNG/JPEG images
async function processImg(imgDataURL: string): Promise<string> {
    if (imgDataURL) {

        const imgData = imgDataURL.split(';base64,')[1];
        const bufferedImgData = Buffer.from(imgData, 'base64');

        if (isJPEG(imgDataURL)) {
            const compressed = await compressTo("jpeg", bufferedImgData);

            return `data:image/jpeg;base64,${compressed.toString('base64')}`;
        }

        if (isPNG(imgDataURL)) {
            const compressed = await compressTo("png", bufferedImgData);

            return `data:image/png;base64,${compressed.toString('base64')}`;
        }

        throw new Error('Invalid image format');

    } else throw new Error('Image data URL not provided');
}

export {
    processImg
}