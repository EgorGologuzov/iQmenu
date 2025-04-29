
import QrCode from 'qrcode';
import path from 'path';

const __dirname = path.resolve();
const qrCodesDir = path.join(__dirname, 'public', 'qrs');

export async function generateQrCode(menuId) {

  const filename = `${menuId}.png`;
  const filePath = path.join(qrCodesDir, filename);
  const url = new URL(`/${menuId}`, process.env.BASE_URL).href;

  await QrCode.toFile(filePath, url, {
      color: {
          dark: '#000000',
          light: '#ffffff',
      },
      width: 512,
      margin: 10
  });
  
  return `/public/qrs/${filename}`;
}
