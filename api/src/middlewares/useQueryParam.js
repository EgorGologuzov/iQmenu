import { badRequest } from "../utils/responses.js";

export function useIntegerQueryParam({ name, required = false, min = undefined, max = undefined }) {
  return function (req, res, next) {
    let value = req.query[name];

    if (required && !value) {
      return badRequest(res, `Параметр '${name}' обязателен`);
    }

    if (value) {
      value = Number(value);
      if (value === NaN || value !== Math.round(value)) {
        return badRequest(res, `Значение параметра '${name}' должно быть целым числом`);
      }
      if ((min || min === 0) && value < min) {
        return badRequest(res, `Значение параметра '${name}' меньше минимального`);
      }
      if ((max || max === 0) && value > max) {
        return badRequest(res, `Значение параметра '${name}' больше максимального`);
      }
    }

    req[name] = value;
    next();
  }
}

export function useStringQueryParam({ name, required = false, minLength = undefined, maxLength = undefined }) {
  return function (req, res, next) {
    let value = req.query[name];

    if (required && !value) {
      return badRequest(res, `Параметр '${name}' обязателен`);
    }

    if (value) {
      if (minLength && value.length < minLength) {
        return badRequest(res, `Значение параметра '${name}' слишком короткое`);
      }
      if (maxLength && value.length > maxLength) {
        return badRequest(res, `Значение параметра '${name}' слишком длинное`);
      }
    }

    req[name] = value;
    next();
  }
}

export function useDatetimeQueryParam({ name, required = false }) {
  return function (req, res, next) {
    let value = req.query[name];

    if (required && !value) {
      return badRequest(res, `Параметр '${name}' обязателен`);
    }

    if (value) {
      value = new Date(value);
      if (isNaN(value.getTime())) {
        return badRequest(res, `Параметр '${name}' имеет неверный формат`);
      }
    }

    req[name] = value;
    next();
  }
}