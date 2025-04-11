
// const validationResultTemplate = {
//   isValid: false,
//   errors: {
//     name: "Length must be from 2 to 100 symbols",
//     price: "Must be more then 0",
//   }
// }

export function validateProduct(p) {
  if (!p) return;

  const errors = {};

  if (!p.name || p.name.legth < 2 || p.name.length > 100) {
    errors.name = "Обязательное поле, длина от 2 до 100 символов";
  }

  if (!p.price || p.price < 0) {
    errors.price = "Обязательное поле, больше 0";
  }

  if (p.weight && p.weight < 0) {
    errors.weight = "Должно быть больше 0";
  }

  if (p.description && p.description.length > 1000) {
    errors.description = "Максмальная длина 1000";
  }

  if (p.composition && p.composition.length > 1000) {
    errors.composition = "Максмальная длина 1000";
  }

  return { isValid: !Object.keys(errors).length, errors: errors };
}
