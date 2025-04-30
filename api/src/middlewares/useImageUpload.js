import multer from "multer";
import { badRequest, requestEntityTooLarge } from "../utils/responses.js";
import { randomUUID } from 'crypto';
import path from 'path';


const FILE_MAX_SIZE_MEGABYTES = 5;

const __dirname = path.resolve();
const imagesDir = path.join(__dirname, 'public', 'images');


const multerConfig = multer({

  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, imagesDir);
    },
    filename: function (req, file, cb) {
      const uniqueName = randomUUID();
      cb(null, uniqueName + path.extname(file.originalname));
    }
  }),

  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const e = new Error(`Недопустимый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WEBP, SVG)`);
      e.code = 'MIMETYPE_NOT_ALLOWED';
      cb(e, false);
    }
  },

  limits: {
    fileSize: FILE_MAX_SIZE_MEGABYTES * 1024 * 1024
  }
});


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

      req.file.url = `/public/images/${req.file.filename}`;
      return next();
    });
  };
}
