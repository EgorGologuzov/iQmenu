import { unprocessableEntity } from "../utils/responses.js";

export function useModel(Model) {
  return function (req, res, next) {
    const { model, errors, isValid } = Model.build(req.body);

    if (!isValid) {
      return unprocessableEntity(res, errors);
    }
  
    req.model = model;
    next();
  }
}
