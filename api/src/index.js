import express from 'express'
import { userRouter } from './routes/userRouter.js';
import { menuRouter } from './routes/menuRouter.js';
import { mediaRouter } from './routes/mediaRouter.js';

const APP_RUN_PORT = 4200;

const app = express();

const main = async () => {
  app.use(express.json());

  app.use("/api/user", userRouter);
  app.use("/api/menu", menuRouter);
  app.use("/api/media", mediaRouter);

  app.all('/*notfound', (req, res) => {
    res
      .status(404)
      .json({ message: "Такого эндпоинта нет..." })
  })

  app.listen(APP_RUN_PORT, () => {
    console.log(`Server is running on http://localhost:${APP_RUN_PORT}`)
  })
}

main();
