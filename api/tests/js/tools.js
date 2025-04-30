
export function runAll(tests) {

  let counter = 1;

  tests.forEach(test => {

    if (typeof test !== "function") {
      return;
    }

    try {
      test();
      console.log(`\x1b[42m Passed ${counter}: \x1b[0m`, test.name);
    } catch (e) {
      if (!e.isFailedTest) { throw e; }
      console.log(`\x1b[41m Failed ${counter}: \x1b[0m`, test.name, `(${e.message})`);
    }

    counter++;
  })
}

export function throwIf(bool, message) {
  if (bool) {
    const e = new Error(message);
    e.isFailedTest = true;
    throw e;
  }
}

export function test(value) {
  return new Validator(value);
}

class Validator {

  constructor(value) {
    this.value = value;
  };

  isEqual(value) { throwIf(this.value !== value, `Is not equal. Expected '${typeof this.value}' '${this.value}', have '${typeof value}' '${value}'`); return this; }
  isNotEqual(value) { throwIf(this.value === value, `Is equal. Expected not '${typeof this.value}' '${this.value}', but have`); return this; }
  // isDefined(value) { throwIf(this.value === undefined, `Is not defined. Is undefined.`); return this; }
}
