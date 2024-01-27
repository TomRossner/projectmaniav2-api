var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sharp from "sharp";
// Compresses PNG/JPEG images
function compress(imgDataURL) {
    return __awaiter(this, void 0, void 0, function* () {
        // Handle PNG compression
        if (imgDataURL.includes('data:image/png')) {
            const imgData = imgDataURL.split(';base64,')[1];
            const bufferedImgData = Buffer.from(imgData, 'base64');
            const compressedPNG = yield sharp(bufferedImgData)
                .toFormat('png')
                .resize({ width: 150 })
                .png({ quality: 100 })
                .toBuffer();
            const compressedPNG_DataURL = `data:image/png;base64,${compressedPNG.toString('base64')}`;
            return compressedPNG_DataURL;
            // Handle JPEG compression
        }
        else if (imgDataURL.includes('data:image/jpeg')) {
            const imgData = imgDataURL.split(';base64,')[1];
            const bufferedImgData = Buffer.from(imgData, 'base64');
            const compressedJPEG = yield sharp(bufferedImgData)
                .toFormat('jpeg')
                .resize({ width: 150 })
                .jpeg({ quality: 100 })
                .toBuffer();
            const compressedJPEG_DataURL = `data:image/jpeg;base64,${compressedJPEG.toString('base64')}`;
            return compressedJPEG_DataURL;
            // Throw error if the image is not of type JPEG or PNG
        }
        else
            throw new Error("Could not compress image");
    });
}
export { compress };
