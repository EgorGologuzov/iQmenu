import mongoose from "mongoose";
import { mapSchema } from "../utils/schema.js";
import { hashPassword } from "../utils/cryptography.js";

// Модель базы данных

const userSchema = mongoose.Schema({

  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  createAt: { type: Date, required: true },
  apiAccessToken: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String },

})

export const User = mongoose.model("User", userSchema);

// Модели для API

export const Auth = Object.freeze({

  schema: {
    phone: { type: "string", required: true, clear: /[^\d+]/g, regExp: /^\+\d{10,15}$/ },
    password: { type: "string", required: true, minLength: 8, maxLength: 100 },
  },

  build: source => mapSchema(source, Auth.schema),
})

export const UserTokenData = Object.freeze({

  schema: {
    userId: { type: "string", required: true },
  },

  build: source => ({ model: { userId: source.id } })
})

export const UserReturn = Object.freeze({

  schema: {
    id: { type: "string", valid: true },
    phone: { type: "string", valid: true },
    email: { type: "string", valid: true },
    name: { type: "string", valid: true },
    isActive: { type: "boolean", valid: true },
    createAt: { type: "datetime", valid: true },
    apiAccessToken: { type: "string", valid: true },
    role: { type: "string", valid: true },
    avatar: { type: "string", valid: true },
  },

  build: source => mapSchema(source, UserReturn.schema),
})

export const UserCreate = Object.freeze({

  schema: {
    phone: { type: "string", required: true, clear: /[^\d+]/g, regExp: /^\+\d{10,15}$/ },
    email: { type: "string", required: true, trim: true, regExp: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ },
    name: { type: "string", required: true, trim: true, minLength: 2, maxLength: 50 },
    avatar: { type: "string", required: false, maxLength: 255 },
    password: { type: "string", required: true, minLength: 8, maxLength: 100 },
  },

  setDefaults: (user) => {
    user.passwordHash = hashPassword(user.password);
    user.isActive = true;
    user.createAt = new Date();
    user.apiAccessToken = "not-set";
    user.role = "owner";
  },

  build: source => mapSchema(source, UserCreate.schema, UserCreate.setDefaults),
})

export const UserUpdate = Object.freeze({

  schema: {
    phone: { type: "string", notnull: true, clear: /[^\d+]/g, regExp: /^\+\d{10,15}$/ },
    email: { type: "string", notnull: true, trim: true, regExp: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ },
    name: { type: "string", notnull: true, trim: true, minLength: 2, maxLength: 50 },
    avatar: { type: "string", maxLength: 255 },
    password: { type: "string", notnull: true, minLength: 8, maxLength: 100 },
  },

  setDefaults: (user) => {
    if (user.password) {
      user.passwordHash = hashPassword(user.password);
    }
  },

  build: source => mapSchema(source, UserUpdate.schema, UserUpdate.setDefaults),
})
