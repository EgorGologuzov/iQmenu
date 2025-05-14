import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import { userRouter } from './routes/userRouter.js'
import { menuRouter } from './routes/menuRouter.js'
import { mediaRouter } from './routes/mediaRouter.js'
import mongoose from 'mongoose'
import { badRequest, internalServerError, notFound } from './utils/responses.js'

dotenv.config();

const app = express();

const main = async () => {

  app.use(express.json());

  if (process.env.MODE == "dev") {
    app.use(cors());
  }

  app.use('/public', express.static('public'));

  app.use("/api/user", userRouter);
  app.use("/api/menu", menuRouter);
  app.use("/api/media", mediaRouter);

  app.all('/*notfound', (req, res) => notFound(res, "Такого эндпоинта нет..."));

  app.use((err, req, res, next) => {

    if (err.type === 'entity.parse.failed') {
      return badRequest(res, "Ошибка парсинга JSON из тела запроса, проверьте корректность синтаксиса JSON");
    }

    console.error(err);
    return internalServerError(res);
  })

  app.listen(process.env.APP_RUN_PORT, () => console.log(`Server is running on http://localhost:${process.env.APP_RUN_PORT}`));

}

main()
  .then(async () => {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
    console.log("Successfully connected to MongoDB!");
  })
  .catch(async e => {
    console.error(e);
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB!");
    process.exit(1);
  })
