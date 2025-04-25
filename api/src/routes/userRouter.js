import Router from 'express'
import { User, UserCreate, UserReturn } from '../models/user.js'


const r = new Router();


r.post("/auth", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


r.post("/reg", async (req, res) => {

  const createData = UserCreate.map(req.body);
  const { user, errors, isValid } = UserCreate.pva(createData);

  if (!isValid) {
    return res
      .status(422)
      .json(errors)
  }

  const existingUser = await User.findOne({ phone: user.phone }).exec();

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Пользователь с таким номером телефона уже существует" })
  }

  const newUser = await User.create(user);

  return res
    .status(200)
    .json(UserReturn.map(newUser))
})


r.put("/update", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


export const userRouter = r;