import mongoose from "mongoose";
import { makeModel, mapSchema } from "../utils/schema.js";
import { randomUUID } from "crypto";

// Структуры

export const OrderStatus = Object.freeze({
	NEW: "new",
	CANCELED: "canceled",
	BANNED: "banned",
	EXECUTED: "executed",
	EXECUTING: "executing",
})

// Модель базы данных

const productInCartSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  amount: { type: String, required: true },
}, {
  _id: false
});

const orderSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  accessKey: { type: String, required: true, index: true },
  menuId: { type: Number, required: true, index: true },
  tableNum: { type: String, required: true },
  sendTime: { type: Date, required: true },
  products: { type: [productInCartSchema], required: true },
  status: { type: String, required: true },
  prevId: { type: Number, required: false },
  prevCount: { type: Number, required: false },
});

export const Order = mongoose.model("Order", orderSchema);

// Модели для API

export const ProdcutInCartReturn = makeModel({

  schema: {
    productId: { type: "number", valid: true },
    amount: { type: "number", valid: true },
  },

  build: source => mapSchema(source, ProdcutInCartReturn.schema),
})

export const ProductInCartEdit = makeModel({

  schema: {
    productId: { type: "number", required: true, min: 0, max: 100_000, round: true },
    amount: { type: "number", required: true, min: 0, max: 9_999, round: true },
  },

  build: source => mapSchema(source, ProductInCartEdit.schema),
})

export const OrderReturn = makeModel({

	schema: {
		id: { type: "number", valid: true, sourceName: "code" },
		accessKey: { type: "string", valid: true },
		menuId: { type: "number", valid: true },
		tableNum: { type: "string", valid: true },
		sendTime: { type: "datetime", valid: true },
		products: {
			type: "list",
			item: { type: ProductInCartEdit },
		},
		status: { type: "string", valid: true },
		prevId: { type: "number", valid: true },
		prevCount: { type: "number", valid: true },
	},

	build: source => mapSchema(source, OrderReturn.schema),
})

export const OrderEditClient = makeModel({

	schema: {
		menuId: { type: "number", required: true, minValue: 0 },
		tableNum: { type: "string", required: true, minLength: 1, maxLength: 15 },
		products: {
			type: "list",
			item: { type: ProductInCartEdit },
			required: true,
			minLength: 1,
      maxLength: 100,
			uniqueItems: true,
      itemsComparator: (p1, p2) => p1.productId == p2.productId,
		},
		prevAccessKey: { type: "string", required: false, regExp: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/ },
	},

	setDefaults(order) {
		order.accessKey = randomUUID();
		order.sendTime = new Date();
		order.status = OrderStatus.NEW;
	},

	build: source => mapSchema(source, OrderEditClient.schema, OrderEditClient.setDefaults),
})

// Полезные функции

// Генерация кода (id)

const MongoModel = Order;
let maxCodeGlobal;
let findMaxQuery;

async function findMaxCode() {
	const queryResult = await MongoModel.aggregate([{ $group: { _id: null, maxCode: { $max: "$code" } } }]).exec();
	const maxCode = queryResult?.length ? queryResult[0].maxCode : 0;
	maxCodeGlobal = maxCode;
}

export async function nextCodeGlobal() {

	if (maxCodeGlobal !== undefined) {
		return ++maxCodeGlobal;
	}

	if (!findMaxQuery) {
		findMaxQuery = findMaxCode();
	}

	await findMaxQuery;
	return await nextCodeGlobal();
}