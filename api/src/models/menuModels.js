import mongoose from "mongoose";
import { mapSchema } from "../utils/schema.js";

// Модель базы данных

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, required: true },
  categories: { type: [String] },
  weight: { type: Number },
  description: { type: String },
  composition: { type: String },
  image: { type: String }
}, {
  _id: false
});

const menuSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  owner: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  qr: { type: String, required: true },
  products: { type: [productSchema], required: true },
  companyName: { type: String },
  menuName: { type: String },
  categories: { type: [String] },
  image: { type: String }
}, {
  _id: false
});

export const Menu = mongoose.model("Menu", menuSchema);

// Модели для API

export const Product = Object.freeze({

  schema: {
    name: { type: "string", required: true, minLength: 1, maxLength: 50, trim: true, sentenseCase: true },
    price: { type: "number", required: true, min: 0, max: 1_000_000, round: true },
    isActive: { type: "boolean", required: true },
    categories: {
      type: "list",
      item: { type: "string", maxLength: 15, trim: true, notnull: true, sentenseCase: true },
      maxLength: 30,
      uniqueItems: true
    },
    weight: { type: "number", min: 0, max: 1_000_000, round: true },
    description: { type: "string", maxLength: 1000, trim: true },
    composition: { type: "string", maxLength: 1000, trim: true },
    image: { type: "string", maxLength: 255 }
  },

  build: source => mapSchema(source, Product.schema),
})

export const MenuReturn = Object.freeze({

  schema: {
    id: { type: "number", valid: true },
    owner: { type: "string", valid: true },
    isActive: { type: "boolean", valid: true },
    qr: { type: "string", valid: true },
    products: {
      type: "list",
      valid: true,
      item: { type: Product }
    },
    companyName: { type: "string", valid: true },
    menuName: { type: "string", valid: true },
    categories: {
      type: "list",
      valid: true,
      item: { type: "string" }
    },
    image: { type: "string", valid: true }
  },

  build: source => mapSchema(source, MenuReturn.schema),
})

export const MenuCreate = Object.freeze({

  schema: {
    isActive: { type: "boolean", required: true },
    products: {
      type: "list",
      required: true,
      minLength: 1,
      maxLength: 100,
      item: { type: Product, notnull: true },
      uniqueItems: true,
      itemsComparator: (p1, p2) => p1.name == p2.name,
    },
    companyName: { type: "string", required: true, trim: true, minLength: 1, maxLength: 100 },
    menuName: { type: "string", required: true, trim: true, minLength: 1, maxLength: 100 },
    categories: {
      type: "list",
      item: { type: "string", maxLength: 30, trim: true, notnull: true, sentenseCase: true },
      maxLength: 30,
      uniqueItems: true
    },
    image: { type: "string", maxLength: 255 }
  },

  setDefaults(menu) {
    // невозможно из-за await
    // menu.id = await Menu.findOne({ id: 1 }).sort("-LAST_MOD").exec();
  },

  build: source => mapSchema(source, MenuCreate.schema),
})

export const MenuUpdate = Object.freeze({

  schema: {
    isActive: { type: "boolean", notnull: true },
    products: {
      type: "list",
      notnull: true,
      minLength: 1,
      maxLength: 100,
      item: { type: Product, notnull: true },
      uniqueItems: true,
      itemsComparator: (p1, p2) => p1.name == p2.name,
    },
    companyName: { type: "string", notnull: true, trim: true, minLength: 1, maxLength: 100 },
    menuName: { type: "string", notnull: true, trim: true, minLength: 1, maxLength: 100 },
    categories: {
      type: "list",
      item: { type: "string", maxLength: 30, trim: true, notnull: true, sentenseCase: true },
      maxLength: 30,
      uniqueItems: true
    },
    image: { type: "string", maxLength: 255 }
  },

  build: source => mapSchema(source, MenuCreate.schema),
})
