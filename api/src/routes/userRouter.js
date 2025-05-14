import Router from 'express'
import { Auth, extractImagesFromUserModel, User, UserCreate, UserReturn, UserTokenData, UserUpdate } from '../models/userModels.js'
import { badRequest, forbidden, notFound, ok, unauthorized } from '../utils/responses.js';
import { generateToken } from '../utils/jwt.js';
import { useAuth } from '../middlewares/useAuth.js';
import { useModel } from '../middlewares/useModel.js';
import { hashPassword } from '../utils/cryptography.js';
import { tryDeleteUnusedImages } from '../utils/images.js';


const r = new Router();

// auth

r.post("/auth", useModel(Auth), async (req, res) => {

  const { phone, password } = req.model;

  const foundUser = await User.findOne({ phone: phone }).exec();

  if (!foundUser || hashPassword(password) != foundUser.passwordHash) {
    return unauthorized(res, "Неверный номер телефона или пароль");
  }

  if (!foundUser.isActive) {
    return forbidden(res, "Аккаунт неактивен. Обратитесь к администратору, чтобы выяснить причину.")
  }

  const result = UserReturn.build(foundUser).model;

  return ok(res, result);

})

// reg

r.post("/reg", useModel(UserCreate), async (req, res) => {

  const createModel = req.model;

  const foundUser = await User.findOne({ phone: createModel.phone }).exec();

  if (foundUser) {
    return badRequest(res, "Пользователь с таким номером телефона уже существует");
  }

  let newUser = await User.create(createModel);

  const userTokenData = UserTokenData.build(newUser).model;
  newUser.apiAccessToken = generateToken(userTokenData);
  await newUser.save();

  const result = UserReturn.build(newUser).model;

  return ok(res, result);

})

// update

r.put("/update", useAuth(), useModel(UserUpdate), async (req, res) => {

  const { userId } = req.user;
  const updateModel = req.model;

  const found = await User.find({ $or: [{ _id: userId }, { phone: updateModel.phone }] });
  const foundById = found.find(user => user._id == userId);
  const foundByPhone = found.find(user => user.phone == updateModel.phone);

  if (!foundById) {
    return notFound(res, "Пользователь с таким id не найден. Проверьте актуальность токена.");
  }

  if (foundByPhone && foundByPhone._id != foundById._id) {
    return badRequest(res, "Пользователь с таким номером телефона уже существует");
  }

  const oldImages = extractImagesFromUserModel(foundById);
  const newImages = extractImagesFromUserModel(updateModel);
  await tryDeleteUnusedImages(oldImages, newImages);

  Object.assign(foundById, updateModel);
  await foundById.save();

  const result = UserReturn.build(foundById).model;

  return ok(res, result);

})

// me

r.get("/me", useAuth(), async (req, res) => {

  const { userId } = req.user;

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    return notFound(res, "Пользователь с таким id не найден. Токен не актуален.");
  }

  const result = UserReturn.build(foundUser).model;

  return ok(res, result);

})


export const userRouter = r;