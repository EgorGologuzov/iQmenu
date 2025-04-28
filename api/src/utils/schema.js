
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

function castList(v, p) {
  const e = {};
  const itemType = typeof p.item.type;

  if (itemType === "object") {
    v = v.map((item, index) => {
      if (p.item.notnull && item === null) {
        e[index] = error(item, "null не может быть элементом этого списка");
        return null;
      }
      const { model, errors, isValid } = mapSchema(item, p.item.type.schema, p.item.type.setDefaults);
      if (!isValid) {
        e[index] = errors;
      }
      return model;
    })
  }

  if (itemType !== "object") {
    v = v.map((item, index) => {
      if (p.item.notnull && item === null) {
        e[index] = error(item, "null не может быть элементом этого списка");
        return null;
      }
      item = processValue(item, p.item, typeof item);
      const err = validateValue(item, p.item, typeof item);
      if (err) {
        e[index] = err;
      }
      return item;
    })
  }

  return [v, Object.keys(e).length ? e : undefined];
}

function tryCastType(v, p, vType) {

  // cast string: number, boolean
  if (vType === "string") {
    if (p.type === "number") {
      const number = Number(v);
      v = number !== NaN ? number : v;
      return [v, p.type];
    }
    if (p.type === "boolean") {
      const lowerV = v.toLowerCase();
      v = lowerV === "true" ? true : lowerV === "false" ? false : v;
      return [v, p.type];
    }
  }

  // cast object to special types
  if (vType === "object") {
    if (p.type === "list" && v instanceof Array) {
      let e;
      [v, e] = castList(v, p);
      return [v, p.type, e];
    }
  }

  return [v, typeof v];
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

export function mapSchema(source, schema, setDefaults = model => undefined) {

  if (!schema) {
    return {};
  }

  if (!source) {
    source = {};
  }

  const model = {};
  const e = {};

  Object.keys(schema).forEach(key => {
    let v = source[key];
    const p = schema[key];

    // если valid добавлем поле без проверок

    if (p.valid) {
      model[key] = v;
      return;
    }

    // проверяем required, notnull

    if (p.required && (v === undefined || v === null)) {
      e[key] = error(v, "Это поле обязательно");
      return;
    }

    if (p.notnull && v === null) {
      e[key] = error(v, "null недопустимо для этого поля");
      return;
    }

    // обрабатываем допустимые null и undefined

    if (v === null) {
      model[key] = undefined;
      return;
    }

    if (v === undefined) {
      return;
    }

    // проверяем тип данных, пытаемся скастить

    let vType = typeof v;

    if (p.type && vType !== p.type) {

      const startedV = v;
      let err;

      [v, vType, err] = tryCastType(v, p, vType);

      if (startedV === v) {
        e[key] = error(v, "Неверный тип данных");
        model[key] = v;
        return;
      }

      if (err) {
        e[key] = err;
        model[key] = v;
        return;
      }
    }

    v = processValue(v, p, vType);

    const err = validateValue(v, p, vType);
    if (err) {
      e[key] = err;
      model[key] = v;
      return;
    }

    model[key] = v;

  });

  const isValid = !Object.keys(e).find(key => !!e[key]);

  if (isValid && typeof setDefaults === "function") {
    setDefaults(model);
  }

  return { model, errors: e, isValid };
}
