import { processCategory, processMenu, processProduct, processUser } from "./processing";

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
  p = processProduct(p);

  if (!p.name || p.name.length < 2 || p.name.length > 100) {
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

  if (p.image instanceof File && p.image.size > process.env.REACT_APP_MAX_IMAGE_SIZE) {
    errors.image = "Файл слишком большой";
  }

  return { isValid: !Object.keys(errors).length, errors: errors };
}

export function validateMenu(m) {
  if (!m) return;

  const errors = {};
  m = processMenu(m);

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

  if (m.image instanceof File && m.image.size > process.env.REACT_APP_MAX_IMAGE_SIZE) {
    errors.image = "Файл слишком большой";
  }

  return { isValid: !Object.keys(errors).length, errors: errors };
}

export function validateCategory(c) {
  if (!c) return;

  const errors = {};
  c = processCategory(c);

  if (c.length > 30 || c.length == 0) {
    errors.category = "Длина должна быть от 1 до 30 символов";
  }

  return { isValid: !Object.keys(errors).length, errors: errors };
}

export function validateUserUpdate(u) {
  if (!u) return;

  const errors = {};
  u = processUser(u);

  if (!u.phone || !/^\+\d{11,15}$/.test(u.phone)) {
    errors.phone = "Обязательное поле в формате +7 (000) 000-00-00";
  }

  if (!u.email || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(u.email)) {
    errors.email = "Обязательное поле в формате Email";
  }

  if (!u.name || u.name.length < 2 || u.name.length > 50) {
    errors.name = "Обязательное поле, длина от 2 до 50 символов";
  }

  if (u.avatar instanceof File && u.avatar.size > process.env.REACT_APP_MAX_IMAGE_SIZE) {
    errors.avatar = "Файл слишком большой";
  }

  if (u.password && (u.password.length < 8 || u.password.length > 100)) {
    errors.password = "Длина пароля от 8 до 100 символов";
  }

  if (u.password !== u.passwordRepeat) {
    errors.passwordRepeat = "Пароли не совпадают";
  }

  return { isValid: !Object.keys(errors).length, errors: errors };
}
