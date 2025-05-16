
import QrCode from 'qrcode';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const qrCodesDir = () => path.join(path.resolve(), process.env.QRS_DIR)

export async function generateQrCode(menuId) {

  const filename = generateFileName(menuId);
  const filePath = path.join(qrCodesDir(), filename);
  const url = new URL(`/${menuId}`, process.env.BASE_URL).href;

  await QrCode.toFile(filePath, url, {
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    width: 512,
    margin: 10
  });

  return path.join(process.env.QRS_DIR, filename);
}

export async function tryDeleteQrImage(menuId) {

  const filename = generateFileName(menuId);
  const filePath = path.join(qrCodesDir(), filename);

  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error(err);
  }
}

function generateFileName(menuId) {
  return `${menuId}.png`;
}
