
function isNumber(v) {
  return typeof v === "number";
}

function error(given, error) {
  return { given, error }
}

function hasDuplicates(array, comparator) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (comparator(array[i], array[j])) {
        return true;
      }
    }
  }
  return false;
}

function mapList(v, p) {
  const errors = {};
  const itemType = typeof p.item.type;

  if (itemType === "object") {
    v = v.map((item, index) => {
      if (item === null) {
        if (p.item.notnull) {
          errors[index] = error(item, "null - недопустимый элемент списка");
        }
        return item;
      }
      const { model, errors, isValid } = mapSchema(item, p.item.type.schema, p.item.type.setDefaults);
      if (!isValid) {
        errors[index] = errors;
      }
      return model;
    })
  }

  if (itemType === "string") {
    v = v.map((item, index) => {
      if (item === null) {
        if (p.item.notnull) {
          errors[index] = error(item, "null - недопустимый элемент списка");
        }
        return item;
      }
      let e;
      [item, e] = mapValue(item, p.item);
      if (e) {
        errors[index] = e;
      }
      return item;
    })
  }

  return [v, Object.keys(errors).length ? errors : undefined];
}

function tryCast(v, p) {
  const vType = typeof v;

  // cast object => list
  if (vType === "object") {
    if (p.type === "list" && v instanceof Array) {
      let e;
      [v, e] = mapList(v, p);
      return [v, p.type, e];
    }
  }

  // cast string => number | boolean
  if (vType === "string") {
    if (p.type === "number") {
      const number = Number(v);
      v = number !== NaN ? number : v;
      return [v, p.type, undefined];
    }
    if (p.type === "boolean") {
      const lowerV = v.toLowerCase();
      v = lowerV === "true" ? true : lowerV === "false" ? false : v;
      return [v, p.type, undefined];
    }
  }

  return [v, undefined, error("Неверный тип данных")];
}

function processValue(v, p, vType) {

  // string: trim, lowerCase, upperCase, sentenseCase, clear
  if (vType === "string") {
    if (p.trim) {
      v = v.trim();
    }
    if (p.lowerCase) {
      v = v.toLowerCase();
    }
    if (p.upperCase) {
      v = v.toUpperCase();
    }
    if (p.sentenseCase) {
      v = v.charAt(0).toUpperCase() + v.slice(1);
    }
    if (p.clear) {
      v = v.replace(p.clear, "");
    }
  }

  // number: round
  if (vType === "number") {
    if (p.round) {
      v = Math.round(v);
    }
  }

  return v;
}

function validateValue(v, p, vType) {

  // string: minLength, maxLength, regExp
  if (vType === "string") {
    if (isNumber(p.minLength) && v.length < p.minLength) {
      return error(v, "Длина строки меньше минимальной");
    }
    if (isNumber(p.maxLength) && v.length > p.maxLength) {
      return error(v, "Длина строки больше максимальной");
    }
    if (p.regExp && !p.regExp.test(v)) {
      return error(v, "Неверный формат строки");
    }
  }

  // number: min, max
  if (vType === "number") {
    if (isNumber(p.min) && v < p.min) {
      return error(v, "Значение меньше минимума");
    }
    if (isNumber(p.max) && v > p.max) {
      return error(v, "Значение больше максимума");
    }
  }

  // list: minLength, maxLength, uniqueItems, item, itemsComparator
  if (vType === "list") {
    if (isNumber(p.minLength) && v.length < p.minLength) {
      return error(undefined, "Длина списка меньше минимальной");
    }
    if (isNumber(p.maxLength) && v.length > p.maxLength) {
      return error(undefined, "Длина списка больше максимальной");
    }
    if (p.uniqueItems && hasDuplicates(v, typeof p.itemsComparator == "function" ? p.itemsComparator : ((i1, i2) => i1 == i2))) {
      return error(undefined, "Список содержит не уникальные значения");
    }
  }
}

function mapValue(v, p) {

  // если valid добавлем поле без проверок
  if (p.valid) {
    return [v, undefined];
  }

  // проверяем required, notnull
  if (p.required && (v === undefined || v === null)) {
    return [v, error(v, "Это поле обязательно")];
  }
  if (p.notnull && v === null) {
    return [v, error(v, "null - недопустимое значение")];
  }

  // обрабатываем допустимые null и undefined
  if (v === null || v === undefined) {
    return [undefined, undefined];
  }

  let vType = typeof v;

  if (p.type && vType !== p.type) {
    let e;
    [v, vType, e] = tryCast(v, p);
    if (e) {
      return [v, e];
    }
  }

  // process and validate value
  v = processValue(v, p, vType);
  const e = validateValue(v, p, vType);

  return [v, e];
}

export function mapSchema(source, schema, setDefaults = model => undefined) {

  if (!schema) {
    return {};
  }

  if (!source) {
    source = {};
  }

  const model = {};
  const errors = {};

  Object.keys(schema).forEach(key => {
    const [v, e] = mapValue(source[key], schema[key]);
    model[key] = v;
    if (e) {
      errors[key] = e;
    }
  });

  const isValid = !Object.keys(errors).find(key => !!errors[key]);

  if (isValid && typeof setDefaults === "function") {
    setDefaults(model);
  }

  return { model, errors, isValid };
}
