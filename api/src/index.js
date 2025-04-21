import express from 'express'

const APP_RUN_PORT = 4200;

const app = express()

const main = async () => {
  app.use(express.json());

  app.get('/api/hello', (req, res) => {
    res
      .status(200)
      .json({ message: "Hello!" })
  })

  app.all('/*notfound', (req, res) => {
    res
      .status(404)
      .json({ message: "Такого эндпоинта нет..." })
  })

  app.listen(APP_RUN_PORT, () => {
    console.log(`Server is running on http://localhost:${APP_RUN_PORT}`)
  })
}

main()
