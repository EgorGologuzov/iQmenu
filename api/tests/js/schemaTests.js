import { makeModel, mapSchema } from "../../src/utils/schema.js";
import { test } from "./tools.js";

export const schemaTests = [

  // mapping

  function mapping_correct() {
    const schema = { field: 1 };
    const source = { field: 1, fakeField: 1 };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(model.field).isEqual(1);
    test(model.fakeField).isEqual(undefined);
  },

  function setDefaults_set() {
    const { model, errors, isValid } = mapSchema({}, {}, model => model.field = 1);
    test(model.field).isEqual(1);
  },

  // props test

  function type_error() {
    const schema = { field: { type: "string" } };
    const source = { field: 1 };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field).isNotEqual(undefined);
  },

  function type_convert() {
    const schema = { field: { type: "number" } };
    const source = { field: "123.45" };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(model.field).isEqual(123.45);
    test(model.field).isNotEqual("123.45");
  },

  function required_error() {
    const schema = { field: { required: true }, field2: { required: true } };
    const source = { field: null, field2: undefined };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field).isNotEqual(undefined);
    test(errors.field2).isNotEqual(undefined);
  },

  function minLength_error() {
    const schema = { field: { type: "string", minLength: 2 } };
    const source = { field: "a" };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field).isNotEqual(undefined);
  },

  function maxLength_error() {
    const schema = { field: { type: "string", maxLength: 2 } };
    const source = { field: "abc" };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field).isNotEqual(undefined);
  },

  function trim_convert() {
    const schema = { field: { type: "string", trim: true } };
    const source = { field: "  a " };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(model.field).isEqual("a");
  },

  function sentenseCase_error() {
    const schema = { field: { type: "string", sentenseCase: true } };
    const source = { field: "a" };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(model.field).isEqual("A");
  },

  function min_error() {
    const schema = { field: { type: "number", min: 0 } };
    const source = { field: -1 };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field).isNotEqual(undefined);
  },

  function max_error() {
    const schema = { field: { type: "number", max: 0 } };
    const source = { field: 1 };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field).isNotEqual(undefined);
  },

  function round_convert() {
    const schema = { field: { type: "number", round: true } };
    const source = { field: 0.9 };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(model.field).isEqual(1);
  },

  function notnull_error() {
    const schema = { field: { type: "string", notnull: true } };
    const source = { field: null };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors).isNotEqual(undefined);
  },

  // list tests

  function list_minLength_error() {
    const schema = { field: { type: "list", item: { type: "string" }, minLength: 2 } };
    const source = { field: ["123"] };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field).isNotEqual(undefined);
  },

  function list_maxLength_error() {
    const schema = { field: { type: "list", item: { type: "string" }, maxLength: 2 } };
    const source = { field: ["123", "1", "123"] };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field).isNotEqual(undefined);
  },

  function list_uniqueItems_error() {
    const schema = { field: { type: "list", item: { type: "string" }, uniqueItems: true } };
    const source = { field: ["1", "12", "1"] };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field).isNotEqual(undefined);
  },

  function list_itemsComparator_error() {
    const itemModel = { schema: { name: { type: "string" } } }
    const schema = { field: { type: "list", item: { type: itemModel }, uniqueItems: true, itemsComparator: (i1, i2) => i1.name == i2.name } };
    const source = { field: [{ name: "1" }, { name: "12" }, { name: "1" },] };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field).isNotEqual(undefined);
  },

  function list_emptyString_error() {
    const schema = { field: { type: "list", item: { type: "string", minLength: 1, maxLength: 3 } } };
    const source = { field: ["", " 1 ", " 1234 "] };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field[0]).isNotEqual(undefined);
    test(errors.field[2]).isNotEqual(undefined);
  },

  function listItem_notnull_error() {
    const schema = { field: { type: "list", item: { type: "string", notnull: true } } };
    const source = { field: ["123", null, "123"] };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field[1]).isNotEqual(undefined);
  },

  function listItem_trim_convert() {
    const schema = { field: { type: "list", item: { type: "string", trim: true } } };
    const source = { field: ["  a  ", "  b  "] };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(model.field[0]).isEqual("a");
    test(model.field[1]).isEqual("b");
  },

  function listItem_round_convert() {
    const schema = { field: { type: "list", item: { type: "number", round: true } } };
    const source = { field: [0.1, 0.9] };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(model.field[0]).isEqual(0);
    test(model.field[1]).isEqual(1);
  },

  function listItem_convertedValueRound_convert() {
    const schema = { field: { type: "list", item: { type: "number", round: true } } };
    const source = { field: ["0.1", "0.9"] };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(model.field[0]).isEqual(0);
    test(model.field[1]).isEqual(1);
  },

  function listItem_regExpAndClear_error() {
    const schema = makeModel({ field: { type: "list", item: { type: "string", clear: /[^\d+]/g, regExp: /^\+\d{10,15}$/ } } });
    const source = { field: ["not valid phone", "+ 7 (000) 000-00-00"] };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field[0]).isNotEqual(undefined);
    test(errors.field[1]).isEqual(undefined);
  },

  function listItem_typeModel_handling() {
    const itemModel = { schema: { name: { type: "string", maxLength: 3 } } }
    const schema = { field: { type: "list", item: { type: itemModel } } };
    const source = { field: [{ name: "1" }, { name: "123" }, { name: "12345" },] };
    const { model, errors, isValid } = mapSchema(source, schema);
    test(errors.field[2]).isNotEqual(undefined);
  },
]
