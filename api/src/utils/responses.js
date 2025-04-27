import { ErrorReturn, ErrorsReturn } from "../models/errorModels.js"

export function ok(res, content) {
  res
    .status(200)
    .json(content)
}

export function badRequest(res, message = 'Ошибка в запросе') {
  res
    .status(400)
    .json(ErrorReturn.build(message).model)
}

export function unprocessableEntity(res, errors) {
  res
    .status(422)
    .json(ErrorsReturn.build(errors).model)
}

export function notFound(res, message = 'Сущность не найдена') {
  res
    .status(404)
    .json(ErrorReturn.build(message).model)
}

export function unauthorized(res, message = 'Не авторизован') {
  res
    .status(401)
    .json(ErrorReturn.build(message).model)
}

export function forbidden(res, message = 'Отказано в доступе') {
  res
    .status(403)
    .json(ErrorReturn.build(message).model)
}
