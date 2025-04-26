import mongoose from "mongoose";
import { check, isValid, processEmail, processPhone, validateEmail, validatePhone, buildModel, ifType, hashPassword, isType } from "./modelUtils.js";

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

// Методы обработки и валидации

const UserMethods = Object.freeze({

  process: {
    phone: u => ifType(u.phone, String, processPhone),
    email: u => ifType(u.email, String, processEmail),
    name: u => ifType(u.name, String, v => v.trim()),
    avatar: u => ifType(u.avatar, String, v => v),
    password: u => ifType(u.password, String, v => v),
  },

  validate: {
    phone: u => check(validatePhone(u.phone), "not null & str & format '+70000000000'"),
    email: u => check(validateEmail(u.email), "not null & str & format 'example@example.ru'"),
    name: u => check(u.name && u.name.length >= 2 && u.name.length <= 50, "not null & str & >=2 & <=50"),
    avatar: u => check(!u.avatar || u.avatar.length <= 255, "null | str & <= 255"),
    password: u => check(u.password && u.password.length >= 8 && u.password.length <= 100, "not null & str & >=8 & <=100"),
    passwordOptional: u => check(!u.password || isType(u.password, String) && u.password.length >= 8 && u.password.length <= 100, "null || str & >=8 & <=100"),
  },

  processCreate(user) {
    const u = { ...user };
    u.phone = UserMethods.process.phone(u);
    u.email = UserMethods.process.email(u);
    u.name = UserMethods.process.name(u);
    u.avatar = UserMethods.process.avatar(u);
    u.password = UserMethods.process.password(u);
    return u;
  },

  processUpdate(user) {
    const u = { ...user };
    u.phone = UserMethods.process.phone(u);
    u.email = UserMethods.process.email(u);
    u.name = UserMethods.process.name(u);
    u.avatar = UserMethods.process.avatar(u);
    return u;
  },

  processAuth(auth) {
    const a = { ...auth };
    a.phone = UserMethods.process.phone(a);
    a.password = UserMethods.process.password(a);
    return a;
  },
  
  validateCreate(user) {
    const [u, e] = [user, {}];
    e.phone = UserMethods.validate.phone(u);
    e.email = UserMethods.validate.email(u);
    e.name = UserMethods.validate.name(u);
    e.avatar = UserMethods.validate.avatar(u);
    e.password = UserMethods.validate.password(u);
    return [e, isValid(e)];
  },

  validateUpdate(user) {
    const [u, e] = [user, {}];
    e.phone = UserMethods.validate.phone(u);
    e.email = UserMethods.validate.email(u);
    e.name = UserMethods.validate.name(u);
    e.avatar = UserMethods.validate.avatar(u);
    e.password = UserMethods.validate.passwordOptional(u);
    return [e, isValid(e)];
  },

  validateAuth(auth) {
    const [a, e] = [auth, {}];
    e.phone = UserMethods.validate.phone(a);
    e.password = UserMethods.validate.password(a);
    return [e, isValid(e)];
  },

  autosetCreate(user) {
    user.passwordHash = hashPassword(user.password);
    user.isActive = true;
    user.createAt = new Date();
    user.apiAccessToken = "not set";
    user.role = "owner";
  },

  autosetUpdate(user) {
    if (user.password) {
      user.passwordHash = hashPassword(user.password);
    }
  },

})

// Модели для API

export const Auth = Object.freeze({

  schema: {
    phone: String,
    password: String,
  },

  build: source => buildModel({
    source: source,
    schema: Auth.schema,
    fProcess: UserMethods.processAuth,
    fValidate: UserMethods.validateAuth,
  })
})

export const UserTokenData = Object.freeze({

  schema: {
    userId: String,
  },

  build: source => ({ model: { userId: source.id } })
})

export const UserReturn = Object.freeze({

  schema: {
    id: String,
    phone: String,
    email: String,
    name: String,
    isActive: Boolean,
    createAt: Date,
    apiAccessToken: String,
    role: String,
    avatar: String,
  },

  build: source => buildModel({
    source: source,
    schema: UserReturn.schema,
  })
})

export const UserCreate = Object.freeze({

  schema: {
    phone: String,
    email: String,
    name: String,
    avatar: String,
    password: String,
  },

  build: source => buildModel({
    source: source,
    schema: UserCreate.schema,
    fProcess: UserMethods.processCreate,
    fValidate: UserMethods.validateCreate,
    fAutoset: UserMethods.autosetCreate,
  })
})

export const UserUpdate = Object.freeze({

  schema: {
    phone: String,
    email: String,
    name: String,
    avatar: String,
    password: String,
  },

  build: source => buildModel({
    source: source,
    schema: UserUpdate.schema,
    fProcess: UserMethods.processUpdate,
    fValidate: UserMethods.validateUpdate,
    fAutoset: UserMethods.autosetUpdate,
  })
})
