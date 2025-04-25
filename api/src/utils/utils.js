
export function check(isValid, errorMessage) {
  return isValid ? undefined : errorMessage;
}

export function hasErrors(e) {
  return !!Object.keys(e).find(key => !!e[key])
}

export function schemaMap(source, schema) {
  if (!source || !schema) return {}
  const target = {};
  Object.keys(schema).forEach(key => { target[key] = source[key] });
  return target;
}

export function processPhone(phone) {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^\d+]/g, '');
}

export function validatePhone(phone) {
  if (typeof phone !== 'string') return false;
  const internationalRegex = /^\+\d{10,15}$/;
  return internationalRegex.test(phone);
  // Российский формат: 11 цифр, начинается с 7 или 8
  // const russianRegex = /^[78]\d{10}$/;
  // return internationalRegex.test(cleaned) || russianRegex.test(cleaned);
}

export function processEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

export function validateEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}
