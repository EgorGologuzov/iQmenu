import { badRequest } from "../utils/responses.js";

export function useIntegerParam(name) {
  return function (req, res, next) {
    const value = Number(req.params[name]);
    if (value === NaN || value !== Math.round(value)) {
      return badRequest(res, `Значение параметра '${name}' должно быть целым числом`);
    }
    req[name] = value;
    next();
  }
}

export function useOidParam(name) {
  const pattern = /^[0-9a-fA-F]{24}$/;
  return function (req, res, next) {
    const value = req.params[name];
    if (!pattern.test(value)) {
      return badRequest(res, `Значение параметра '${name}' должно быть валидным OID`)
    }
    req[name] = value;
    next();
  }
}

export function useUuidParam(name) {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  return function (req, res, next) {
    const value = req.params[name];
    if (!pattern.test(value)) {
      return badRequest(res, `Значение параметра '${name}' должно быть валидным UUID`)
    }
    req[name] = value;
    next();
  }
}