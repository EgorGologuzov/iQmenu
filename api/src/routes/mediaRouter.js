import Router from 'express'


const r = new Router();


r.post("/image", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


export const mediaRouter = r;