import multer from "multer";
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';

const FILE_MAX_SIZE_MEGABYTES = 5;

const imagesDir = () => path.join(path.resolve(), process.env.IMAGES_DIR);

export const multerConfig = multer({

  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, imagesDir());
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

/**
 * Удаляет неиспользуемые изображения из папки /public/images
 * @param {string[]} oldImages - Массив старых путей к изображениям
 * @param {string[]} newImages - Массив новых путей к изображениям
 * @returns {Promise<{deleted: string[], skipped: string[]}>} - Результат операции
 */
export async function tryDeleteUnusedImages(oldImages, newImages) {

  const oldFiles = getOnlyImagesFilesNames(oldImages);
  const newFiles = getOnlyImagesFilesNames(newImages);

  const toDelete = oldFiles.filter(file => !newFiles.includes(file));

  await Promise.all(toDelete.map(async file => {

    const filePath = path.join(imagesDir(), file);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(err);
    }
  }));
}

function getOnlyImagesFilesNames(pathsList) {
  return pathsList
    .filter(imagePath => imagePath.replaceAll("\\", "/").startsWith(process.env.IMAGES_DIR))
    .map(imagePath => path.basename(imagePath));
}
