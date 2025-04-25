import mongoose from "mongoose";
import { check, hasErrors, processEmail, processPhone, schemaMap, validateEmail, validatePhone } from "../utils/utils.js";

// Модель базы данных

const userSchema = mongoose.Schema({

  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  createAt: { type: Date, required: true },
  avatar: { type: String },

})

export const User = mongoose.model("User", userSchema);

// Методы обработки и валидации

const UserMethods = Object.freeze({

  validate: {
    phone: u => check(validatePhone(u.phone), "not null & str & format '+70000000000'"),
    email: u => check(validateEmail(u.email), "not null & str & format 'example@example.ru'"),
    name: u => check(u.name && u.name.length >= 2 && u.name.length <= 50, "not null & str & >=2 & <=50"),
    avatar: u => check(!u.avatar || u.avatar.length <= 255, "null | str & <= 255"),
    password: u => check(u.password && u.password.length >= 8 && u.password.length <= 100, "not null & str & >=8 & <=100"),
  },

  process(user) {
    const u = { ...user };
    u.phone = u.phone ? processPhone(u.phone) : undefined;
    u.email = u.email ? processEmail(u.email) : undefined;
    u.name = u.name ? u.name.trim() : u.name;
    u.isActive = !!u.isActive;
    u.avatar = u.avatar ?? undefined;
    return u;
  },
  
  autoset(user) {
    user.passwordHash = user.password;
    user.isActive = true;
    user.createAt = new Date();
  },
  
  validateCreate(user) {
    const [u, e] = [user, {}];
    e.phone = UserMethods.validate.phone(u);
    e.email = UserMethods.validate.email(u);
    e.name = UserMethods.validate.name(u);
    e.avatar = UserMethods.validate.avatar(u);
    e.password = UserMethods.validate.password(u);
    return [e, !hasErrors(e)];
  },

  validateUpdate(user) {
    const [u, e] = [user, {}];
    e.phone = UserMethods.validate.phone(u);
    e.email = UserMethods.validate.email(u);
    e.name = UserMethods.validate.name(u);
    e.avatar = UserMethods.validate.avatar(u);
    return [e, !hasErrors(e)];
  },

})

// Модели для API

export const UserReturn = Object.freeze({

  schema: {
    id: String,
    phone: String,
    email: String,
    name: String,
    isActive: Boolean,
    createAt: Date,
    avatar: String,
  },

  map(source) { return schemaMap(source, UserReturn.schema) },
})

export const UserCreate = Object.freeze({

  schema: {
    phone: String,
    email: String,
    name: String,
    avatar: String,
    password: String,
  },

  map(source) { return schemaMap(source, UserCreate.schema) },
  process: UserMethods.process,
  validate: UserMethods.validateCreate,
  autoset: UserMethods.autoset,

  pva(user) {
    const data = UserCreate.process(user);
    const [errors, isValid] = UserCreate.validate(data);
    UserCreate.autoset(data);
    return { user: data, errors, isValid }
  }
})

export const UserUpdate = Object.freeze({

  schema: {
    phone: String,
    email: String,
    name: String,
    avatar: String,
  },

  map(source) { return schemaMap(source, UserUpdate.schema) },
  process: UserMethods.process,
  validate: UserMethods.validateUpdate,
})
