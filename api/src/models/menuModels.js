import mongoose from "mongoose";
import { makeModel, mapSchema } from "../utils/schema.js";

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
  code: { type: Number, required: true, unique: true },
  ownerId: { type: String, required: true, index: true },
  isActive: { type: Boolean, required: true },
  createAt: { type: Date, required: true },
  qr: { type: String, required: true },
  products: { type: [productSchema], required: true },
  companyName: { type: String },
  menuName: { type: String },
  categories: { type: [String] },
  image: { type: String }
});

export const Menu = mongoose.model("Menu", menuSchema);

// Модели для API

export const ProductReturn = makeModel({

  schema: {
    name: { type: "string", valid: true },
    price: { type: "number", valid: true },
    isActive: { type: "boolean", valid: true },
    categories: {
      type: "list",
      item: { type: "string", valid: true },
    },
    weight: { type: "number", valid: true },
    description: { type: "string", valid: true },
    composition: { type: "string", valid: true },
    image: { type: "string", valid: true }
  },

  build: source => mapSchema(source, ProductEdit.schema),
})

export const ProductEdit = makeModel({

  schema: {
    name: { type: "string", required: true, minLength: 1, maxLength: 50, trim: true, sentenseCase: true },
    price: { type: "number", required: true, min: 0, max: 1_000_000, round: true },
    isActive: { type: "boolean", required: true },
    categories: {
      type: "list",
      item: { type: "string", minLength: 1, maxLength: 15, trim: true, notnull: true, sentenseCase: true },
      maxLength: 30,
      uniqueItems: true
    },
    weight: { type: "number", min: 0, max: 1_000_000, round: true },
    description: { type: "string", maxLength: 1000, trim: true },
    composition: { type: "string", maxLength: 1000, trim: true },
    image: { type: "string", maxLength: 255 }
  },

  build: source => mapSchema(source, ProductEdit.schema),
})

export const MenuReturn = makeModel({

  schema: {
    id: { type: "number", valid: true, sourceName: "code" },
    ownerId: { type: "string", valid: true },
    isActive: { type: "boolean", valid: true },
    createAt: { type: "datetime", valid: true },
    qr: { type: "string", valid: true },
    products: {
      type: "list",
      item: { type: ProductReturn },
    },
    companyName: { type: "string", valid: true },
    menuName: { type: "string", valid: true },
    categories: {
      type: "list",
      item: { type: "string" },
    },
    image: { type: "string", valid: true }
  },

  build: source => mapSchema(source, MenuReturn.schema),
})

export const MinimizedMenuReturn = makeModel({

  schema: {
    id: { type: "number", valid: true, sourceName: "code" },
    ownerId: { type: "string", valid: true },
    isActive: { type: "boolean", valid: true },
    createAt: { type: "datetime", valid: true },
    qr: { type: "string", valid: true },
    companyName: { type: "string", valid: true },
    menuName: { type: "string", valid: true },
    image: { type: "string", valid: true }
  },

  build: source => mapSchema(source, MinimizedMenuReturn.schema),
})

export const MenuListReturn = makeModel({

  schema: {
    menus: {
      type: "list",
      item: { type: MinimizedMenuReturn },
    }
  },

  build: source => mapSchema(source, MenuListReturn.schema),
})

export const MenuCreate = makeModel({

  schema: {
    isActive: { type: "boolean", required: true },
    products: {
      type: "list",
      required: true,
      minLength: 1,
      maxLength: 100,
      item: { type: ProductEdit, notnull: true },
      uniqueItems: true,
      itemsComparator: (p1, p2) => p1.name == p2.name,
    },
    companyName: { type: "string", required: true, trim: true, minLength: 1, maxLength: 100 },
    menuName: { type: "string", required: true, trim: true, minLength: 1, maxLength: 100 },
    categories: {
      type: "list",
      item: { type: "string", minLength: 1, maxLength: 30, trim: true, notnull: true, sentenseCase: true },
      maxLength: 30,
      uniqueItems: true
    },
    image: { type: "string", maxLength: 255 }
  },

  setDefaults(menu) {
    menu.createAt = new Date();
  },

  build: source => mapSchema(source, MenuCreate.schema, MenuCreate.setDefaults),
})

export const MenuUpdate = makeModel({

  schema: {
    isActive: { type: "boolean", notnull: true },
    products: {
      type: "list",
      notnull: true,
      minLength: 1,
      maxLength: 100,
      item: { type: ProductEdit, notnull: true },
      uniqueItems: true,
      itemsComparator: (p1, p2) => p1.name == p2.name,
    },
    companyName: { type: "string", notnull: true, trim: true, minLength: 1, maxLength: 100 },
    menuName: { type: "string", notnull: true, trim: true, minLength: 1, maxLength: 100 },
    categories: {
      type: "list",
      item: { type: "string", minLength: 1, maxLength: 30, trim: true, notnull: true, sentenseCase: true },
      maxLength: 30,
      uniqueItems: true
    },
    image: { type: "string", maxLength: 255 }
  },

  build: source => mapSchema(source, MenuUpdate.schema),
})

// Полезные функции

// Генерация кода (id)

let maxMenuCode;
let findMaxQuery;

async function findMaxCode() {
  const queryResult = await Menu.aggregate([{ $group: { _id: null, maxCode: { $max: "$code" } } }]).exec();
  const maxCode = queryResult?.length ? queryResult[0].maxCode : 0;
  maxMenuCode = maxCode;
}

export async function nextMenuCode() {

  if (maxMenuCode !== undefined) {
    return ++maxMenuCode;
  }

  if (!findMaxQuery) {
    findMaxQuery = findMaxCode();
  }

  await findMaxQuery;
  return await nextMenuCode();
}

// Извелечение всех путей к изображениям

export function extractImagesFromMenuModel(menuModel) {
  if (!menuModel) {
    return;
  }

  const images = [];

  if (menuModel.image) {
    images.push(menuModel.image);
  }

  if (menuModel.products) {
    menuModel.products.forEach(product => {
      if (product.image) {
        images.push(product.image);
      }
    })
  }

  return images;
}
