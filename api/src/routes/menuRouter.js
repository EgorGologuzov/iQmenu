import Router from 'express'


const r = new Router();

// get by id

r.get("/:menuId", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})

// create

r.post("/", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})

// update

r.put("/:menuId", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})

// delete

r.delete("/:menuId", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})

// get all owner`s menus

r.get("/list/:userId", (req, res) => {
  res.status(500).json({ message: "Эндпоинт не реализован" })
})


export const menuRouter = r;