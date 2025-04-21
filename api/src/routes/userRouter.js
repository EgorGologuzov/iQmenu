import Router from 'express'


const r = new Router();


r.post("/auth", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


r.post("/reg", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


r.put("/update", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


export const userRouter = r;