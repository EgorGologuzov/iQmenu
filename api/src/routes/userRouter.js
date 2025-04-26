import Router from 'express'
import { Auth, User, UserCreate, UserReturn, UserTokenData, UserUpdate } from '../models/userModels.js'
import { badRequest, ok, unauthorized } from '../utils/responses.js';
import { hashPassword } from '../models/modelUtils.js';
import { generateToken } from '../utils/jwt.js';
import { useAuth } from '../middlewares/useAuth.js';
import { useModel } from '../middlewares/useModel.js';


const r = new Router();


r.post("/auth", useModel(Auth), async (req, res) => {
  
  const { phone, password } = req.model;

  const existingUser = await User.findOne({ phone: phone }).exec();
  if (!existingUser || hashPassword(password) != existingUser.passwordHash) {
    return unauthorized(res, "Неверный номер телефона или пароль");
  }

  const result = UserReturn.build(existingUser).model;

  return ok(res, result);

})


r.post("/reg", useModel(UserCreate), async (req, res) => {

  const createModel = req.model;

  const existingUser = await User.findOne({ phone: createModel.phone }).exec();
  if (existingUser) {
    return badRequest(res, "Пользователь с таким номером телефона уже существует");
  }

  let newUser = await User.create(createModel);
  const userTokenData = UserTokenData.build(newUser).model;
  const token = generateToken(userTokenData);
  await User.updateOne({ _id: newUser._id }, { $set: { apiAccessToken: token } }).exec();
  newUser = await User.findById(newUser._id).exec();

  const result = UserReturn.build(newUser).model;

  return ok(res, result);

})


r.put("/update", useAuth, useModel(UserUpdate), async (req, res) => {
  
  const { userId } = req.user;
  const updateModel = req.model;

  const existingUser = await User.findOne({ phone: updateModel.phone }).exec();
  if (existingUser && existingUser._id != userId) {
    return badRequest(res, "Пользователь с таким номером телефона уже существует");
  }

  await User.findById(userId).updateOne({ $set: updateModel }).exec();
  const updatedUser = await User.findById(userId).exec();

  const result = UserReturn.build(updatedUser).model;

  return ok(res, result);

})


export const userRouter = r;