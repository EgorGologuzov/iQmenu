import { verifyToken } from '../utils/jwt.js'
import { forbidden, unauthorized } from '../utils/responses.js';

export function useAuth() {
  return function (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return unauthorized(res, "Не авторизован: добавьте заголовок Authorization: Bearer <token>");
    }
  
    const decoded = verifyToken(token);
    if (!decoded) {
      return forbidden(res, "Токен не прошел верификацию: возможно истек его срок действия или он добавлен в черный список");
    }
  
    req.user = decoded;
    next();
  }
}
