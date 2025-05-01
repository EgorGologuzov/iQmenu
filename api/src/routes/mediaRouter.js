import Router from 'express'
import { useSingleImageUpload } from '../middlewares/useImageUpload.js';
import { UploadedFile } from '../models/mediaModel.js';
import { ok } from '../utils/responses.js';
import { useAuth } from '../middlewares/useAuth.js';


const r = new Router();

// Загрузка файла

r.post("/image", useAuth(), useSingleImageUpload("image", true), (req, res) => {
  return ok(res, UploadedFile.build(req.file.url).model);
})


export const mediaRouter = r;