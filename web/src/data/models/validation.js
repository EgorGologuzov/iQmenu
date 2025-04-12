
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

export function validateMenu(m) {
  if (!m) return;

  const errors = {};

  if (!m.menuName || m.menuName.length < 2 || m.menuName.length > 100) {
    errors.menuName = "Обязательное поле, длина от 2 до 100 символов";
  }

  if (!m.companyName || m.companyName.length < 2 || m.companyName.length > 100) {
    errors.companyName = "Обязательное поле, длина от 2 до 100 символов";
  }

  if (m.categories && m.categories.length > 30) {
    errors.categories = "Максимальное кол-во категорий 30";
  }

  if (!m.products || !m.products.length) {
    errors.products = "Добавьте минимум 1 продукт";
  }

  if (m.products && m.products.length > 100) {
    errors.products = "Максимальное кол-во продуктов 100";
  }

  return { isValid: !Object.keys(errors).length, errors: errors };
}
