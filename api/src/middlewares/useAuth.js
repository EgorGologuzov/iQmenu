import { verifyToken } from '../utils/jwt.js'
import { forbidden, unauthorized } from '../utils/responses.js';

export function useAuth(options = { required: true }) {
  return function (req, res, next) {

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      if (options.required) {
        return unauthorized(res, "Не авторизован: добавьте заголовок Authorization: Bearer <token>");
      }
      return next();
    }
  
    const decoded = verifyToken(token);
    if (!decoded) {
      if (options.required) {
        return forbidden(res, "Токен не прошел верификацию: возможно истек его срок действия или он добавлен в черный список");
      }
      return next();
    }
  
    req.user = decoded;
    return next();
  }
}
