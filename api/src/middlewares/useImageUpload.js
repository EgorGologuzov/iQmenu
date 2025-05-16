import { multerConfig } from "../utils/images.js";
import { badRequest, requestEntityTooLarge } from "../utils/responses.js";
import path from 'path';

export function useSingleImageUpload(fieldName, required = false) {
  const upload = multerConfig.single(fieldName);

  return function (req, res, next) {
    upload(req, res, (err) => {

      if (!err && !req.file) {
        if (required) {
          return badRequest(res, "Файл не передан");
        }
        return next();
      }

      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return requestEntityTooLarge(res, "Размер файла больше максимально допустимого");
        }
        if (err.code === 'MIMETYPE_NOT_ALLOWED') {
          return badRequest(res, "Файл не является изображением");
        }
      }

      req.file.url = path.join(process.env.IMAGES_DIR, req.file.filename);
      return next();
    });
  };
}
