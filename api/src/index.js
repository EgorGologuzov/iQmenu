import express from 'express'
import dotenv from 'dotenv'
import { userRouter } from './routes/userRouter.js'
import { menuRouter } from './routes/menuRouter.js'
import { mediaRouter } from './routes/mediaRouter.js'
import mongoose from 'mongoose'

dotenv.config();

const app = express();

const main = async () => {

  app.use(express.json());

  app.use("/api/user", userRouter);
  app.use("/api/menu", menuRouter);
  app.use("/api/media", mediaRouter);
  
  app.all('/*notfound', (req, res) => {
    res.status(404).json({ message: "Такого эндпоинта нет..." })
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
