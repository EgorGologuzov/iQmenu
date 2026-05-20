import mongoose from "mongoose";
import { makeModel, mapSchema } from "../utils/schema.js";

export const EventType = Object.freeze({
  VIEW_MENU: "view-menu",
	VIEW_PRODUCT: "view-product",
	LIKE_PRODUCT: "like-product",
})

const EVENT_TYPE_VARIANTS = ["view-menu", "view-product", "like-product"]

// Модель базы данных

const eventSchema = mongoose.Schema({

  event: { type: String, required: true },
  menuId: { type: Number, required: true },
	productName: { type: String, required: false },
	sendTime: { type: Date, required: true, index: true },
	userAgent: { type: String, required: false },

})

export const Event = mongoose.model("Event", eventSchema);

// Модели для API

export const EventReturn = makeModel({

	schema: {
		event: { type: "string", valid: true },
		productName: { type: "string", valid: true },
		sendTime: { type: "datetime", valid: true },
		userAgent: { type: "string", valid: true },
	},

	build: source => mapSchema(source, EventReturn.schema),
})

export const EventListReturn = makeModel({

	schema: {
		events: { 
			type: "list", 
			item: { type: EventReturn },
		},
	},

	build: source => mapSchema(source, EventListReturn.schema),
})

export const EventCreate = makeModel({

	schema: {
		event: { type: "string", required: true, variants: EVENT_TYPE_VARIANTS },
		menuId: { type: "number", required: true },
		productName: { type: "string", required: false, minLength: 1, maxLength: 50, trim: true, sentenseCase: true },
	},

	setDefaults(event) {
		event.sendTime = new Date();
	},

	build: source => mapSchema(source, EventCreate.schema, EventCreate.setDefaults),
})
