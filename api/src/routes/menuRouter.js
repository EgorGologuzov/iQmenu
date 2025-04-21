import Router from 'express'


const r = new Router();


r.get("/:menuId", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


r.post("/", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


r.put("/:menuId", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


r.delete("/:menuId", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


r.get("/list/:userId", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


export const menuRouter = r;