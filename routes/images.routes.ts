import { Router } from "express";
import { uploadImageHandler } from "../controllers/images.controller.js";

const ImagesRouter = Router();

ImagesRouter.post('/', uploadImageHandler);

export default ImagesRouter;