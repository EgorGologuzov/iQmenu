import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { hashPassword } from '../src/utils/cryptography.js';
import { User, UserTokenData } from '../src/models/userModels.js';
import { generateToken } from '../src/utils/jwt.js';
import { Menu } from '../src/models/menuModels.js';
import { generateQrCode } from '../src/utils/qr.js';

dotenv.config();

const users = [
  {
    phone: "+70000000000",
    email: "example@example.com",
    name: "Иван Иванович",
    passwordHash: hashPassword("12345678"),
    isActive: true,
    createAt: new Date(),
    apiAccessToken: "not-set",
    role: "owner",
    avatar: "/api/public/images/3935f51c-4852-488c-8d0d-509602b7a22b.jpg",
  },
  {
    phone: "+70000000001",
    email: "example@example.com",
    name: "Егор Рустамович",
    passwordHash: hashPassword("12345678"),
    isActive: true,
    createAt: new Date(),
    apiAccessToken: "not-set",
    role: "owner",
    avatar: "/api/public/images/2009257e-be9b-405e-abfe-40a6e38f1a59.jpg",
  },
  {
    phone: "+70000000002",
    email: "example@example.com",
    name: "Артем Алексеевич",
    passwordHash: hashPassword("12345678"),
    isActive: true,
    createAt: new Date(),
    apiAccessToken: "not-set",
    role: "owner",
    avatar: "/api/public/images/39606893-bf68-4423-a975-d5a0b735362c.jpg",
  },
]

const products = [
  {
    "name": "Цезарь с курицей",
    "price": 420,
    "isActive": false,
    "categories": ["Основные"],
    "weight": 280,
    "description": "Классический салат с листьями айсберга, куриной грудкой и соусом Цезарь",
    "composition": "Курица, айсберг, помидоры черри, пармезан, сухарики",
    "image": "https://menunedeli.ru/wp-content/uploads/2022/07/41322293-5B97-451F-886E-2522AB91F67B-886x700.jpeg"
  },
  {
    "name": "Тирамису",
    "price": 350,
    "isActive": true,
    "categories": ["Десерты"],
    "weight": 150,
    "description": "Итальянский десерт с маскарпоне и кофейной пропиткой",
    "image": "https://19tortov.ru/upload/resize_cache/iblock/39f/500_500_1/20192643.jpg"
  },
  {
    "name": "Латте",
    "price": 220,
    "isActive": true,
    "categories": ["Напитки"],
    "weight": 250,
    "image": "https://coffee61.ru/wa-data/public/photos/68/03/368/368.970.jpg"
  },
  {
    "name": "Брускетта с томатами",
    "price": 180,
    "isActive": true,
    "categories": ["Закуски"],
    "description": "Хрустящий тост с помидорами и базиликом",
    "image": "https://eda.ru/images/RecipePhoto/390x390/brusketta-s-pomidorami-i-mocarelloj_41582_photo_33956.jpg"
  },
  {
    "name": "Стейк Рибай",
    "price": 890,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 300,
    "composition": "Говядина, соль, перец",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_TYkd9mIf4PYkGVy45ElwUEtuvvYYPZe-hg&s"
  },
  {
    "name": "Картофель фри",
    "price": 150,
    "isActive": false,
    "categories": ["Гарниры"],
    "description": "Хрустящий картофель с солью",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESjIDOn4TZW75bmLjyCvT_D9dPZ37ZB7V1w&s"
  },
  {
    "name": "Крем-суп из грибов",
    "price": 240,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 200,
    "image": "https://eda.ru/images/RecipePhoto/390x390/krem-sup-iz-shampinonov-s-timyanom-i-soevym-sousom_125761_photo_149129.jpg"
  },
  {
    "name": "Мохито",
    "price": 320,
    "isActive": true,
    "categories": ["Напитки", "Алкоголь"],
    "composition": "Ром, лайм, мята, содовая",
    "image": "https://ist.say7.info/img0007/11/711_01303xh_3913_1024.jpg"
  },
  {
    "name": "Чизкейк Нью-Йорк",
    "price": 380,
    "isActive": true,
    "categories": ["Десерты"],
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8Xi9QxCSIz-2kCv59Hd1NbBVSP0NhEvDnmQ&s"
  },
  {
    "name": "Салат Греческий",
    "price": 290,
    "isActive": true,
    "categories": ["Основные"],
    "composition": "Помидоры, огурцы, оливки, фета, оливковое масло",
    "image": "https://art-lunch.ru/content/uploads/2018/07/Greek_salad_01.jpg"
  },
  {
    "name": "Пицца Маргарита",
    "price": 450,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 400,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZBz8TcV074DnRF_I2oNUdjxiHVxEfGoHVng&s"
  },
  {
    "name": "Вино красное сухое",
    "price": 520,
    "isActive": true,
    "categories": ["Алкоголь"],
    "description": "Испанское вино, 2019 год",
    "image": "https://rsovin.ru/wp-content/uploads/2022/07/9f624cdd-aeb5-11e9-bde2-ac1f6bb2b39c_7a168021-b5e5-11ed-85d3-ac1f6bb2b39c.png"
  },
  {
    "name": "Гуакамоле",
    "price": 210,
    "isActive": true,
    "categories": ["Закуски"],
    "composition": "Авокадо, лайм, кинза, чили",
    "image": "https://receptoriy.ru/upload/Guacamole.jpg"
  },
  {
    "name": "Шоколадный фондан",
    "price": 310,
    "isActive": false,
    "categories": ["Десерты"],
    "description": "Тёплый шоколадный кекс с жидкой сердцевиной",
    "image": "https://eda.ru/images/RecipePhoto/390x390/shokoladnij-fondan_49755_photo_53437.jpg"
  },
  {
    "name": "Эспрессо",
    "price": 150,
    "isActive": true,
    "categories": ["Напитки"],
    "image": "https://e1.edimdoma.ru/data/ingredients/0000/2850/2850-ed4_wide.jpg?1515762750"
  },
]

const menus = [
  {
    "code": 1,
    "isActive": true,
    "createAt": new Date(),
    "products": products,
    "companyName": "Кафе «Уют»",
    "menuName": "Основное меню",
    "categories": ["Основные", "Десерты", "Напитки", "Закуски", "Гарниры", "Алкоголь"],
    "image": "https://previews.123rf.com/images/vectorchef/vectorchef1507/vectorchef150709093/42871957-menu-icon.jpg"
  },
  {
    "code": 2,
    "isActive": true,
    "createAt": new Date(),
    "products": products.filter((_, index) => index % 2 == 0),
    "companyName": "Кафе Егора",
    "menuName": "Основное меню",
    "categories": ["Основные", "Десерты", "Напитки", "Закуски", "Гарниры", "Алкоголь"],
    "image": "https://previews.123rf.com/images/vectorchef/vectorchef1507/vectorchef150709093/42871957-menu-icon.jpg"
  },
  {
    "code": 3,
    "isActive": false,
    "createAt": new Date(),
    "products": products.filter((_, index) => index % 2 != 0),
    "companyName": "Кафе Егора",
    "menuName": "Новогоднее меню",
    "categories": ["Основные", "Десерты", "Напитки", "Закуски", "Гарниры", "Алкоголь"]
  },
]

async function seed() {

  await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
  console.log("Successfully connected to MongoDB!");

  // users

  await User.deleteMany({}).exec();
  const createdUsers = await User.create(users);

  await Promise.all(createdUsers.map(async (user) => {
    const userTokenData = UserTokenData.build(user).model;
    user.apiAccessToken = generateToken(userTokenData);
    await user.save();
  }))

  // menus

  await Menu.deleteMany({}).exec();

  menus[0].ownerId = createdUsers[2]._id;
  menus[0].qr = await generateQrCode(1);

  menus[1].ownerId = createdUsers[1]._id;
  menus[1].qr = await generateQrCode(2);
  
  menus[2].ownerId = createdUsers[1]._id;
  menus[2].qr = await generateQrCode(3);

  await Menu.create(menus);
}

seed()
  .then(() => {
    console.log("Data successfully added to the database!");
  })
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await mongoose.connection?.close();
    console.log("Disconnect from MongoDB!");
    process.exit(0);
  })
