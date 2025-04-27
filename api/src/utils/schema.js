
function error(given, error) {
  return { given, error };
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
    const vType = typeof v;

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

    if (p.type && vType !== p.type) {

      const startedV = v;

      if (vType === "string") {
        if (p.type === "number") {
          const number = Number(v);
          v = number !== NaN ? number : v;
        }
        if (p.type === "boolean") {
          const lowerV = v.toLowerCase();
          v = lowerV === "true" ? true : lowerV === "false" ? false : v;
        }
      }

      if (v === startedV) {
        e[key] = error(v, "Неверный тип данных");
        return;
      }
    }

    // process

    let processed = v;

    // string: trim, lowerCase, upperCase, sentenseCase, clear
    if (vType === "string") {
      if (p.trim) {
        processed = processed.trim();
      }
      if (p.lowerCase) {
        processed = processed.toLowerCase();
      }
      if (p.upperCase) {
        processed = processed.toUpperCase();
      }
      if (p.sentenseCase) {
        processed = processed.charAt(0).toUpperCase() + processed.slice(1);
      }
      if (p.clear) {
        processed = processed.replace(p.clear, "");
      }
    }

    // number: round
    if (vType === "number") {
      if (p.round) {
        processed = Math.round(v);
      }
    }

    v = processed;

    // validation

    // string: minLength, maxLength, regExp
    if (vType === "string") {
      if (p.minLength && v.length < p.minLength) {
        e[key] = error(v, "Длина строки меньше минимальной");
        return;
      }
      if (p.maxLength && v.length > p.maxLength) {
        e[key] = error(v, "Длина строки больше максимальной");
        return;
      }
      if (p.regExp && !p.regExp.test(v)) {
        e[key] = error(v, "Неверный формат строки");
        return;
      }
    }

    // number: min, max
    if (vType === "number") {
      if (p.min && v < p.min) {
        e[key] = error(v, "Значение меньше минимума");
        return;
      }
      if (p.max && v > p.max) {
        e[key] = error(v, "Значение больше максимума");
        return;
      }
    }

    model[key] = v;
  });

  const isValid = !Object.keys(e).find(key => !!e[key]);

  if (isValid && typeof setDefaults === "function") {
    setDefaults(model);
  }

  return { model, errors: e, isValid };
}
