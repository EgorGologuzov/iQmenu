import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from '../src/utils/cryptography.js';
import { User, UserTokenData } from '../src/models/userModels.js';
import { generateToken } from '../src/utils/jwt.js';
import { Menu } from '../src/models/menuModels.js';
import { generateQrCode } from '../src/utils/qr.js';
import { Order, OrderStatus } from '../src/models/orderModels.js';
import { randomUUID } from 'crypto';
import { Event } from '../src/models/statisticModels.js';

dotenv.config();

const __dirname = path.resolve();

// Пути к папкам
const imagesDir = path.join(__dirname, '/public/images');
const qrsDir = path.join(__dirname, '/public/qrs');
const seedImagesDir = path.join(__dirname, '/scripts/seed-images');

const USERS_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36",
]

const USERS = [
  {
    _id: "6a1ebe7e83f4d5903d16963e",
    phone: "+70000000000",
    email: "example@example.com",
    name: "Иван Иванович",
    passwordHash: hashPassword("12345678"),
    isActive: true,
    role: "owner",
  },
  {
    _id: "6a1ebe7e83f4d5903d16963f",
    phone: "+70000000001",
    email: "example@example.com",
    name: "Егор Рустамович",
    passwordHash: hashPassword("12345678"),
    isActive: true,
    role: "owner",
  },
]

const PRODUCTS = [
  {
    "id": 1,
    "name": "Цезарь с курицей",
    "price": 420,
    "isActive": false,
    "categories": [],
    "weight": 280,
    "description": "Классический салат с листьями айсберга, куриной грудкой и соусом Цезарь",
    "composition": "Курица, айсберг, помидоры черри, пармезан, сухарики",
  },
  {
    "id": 2,
    "name": "Тирамису",
    "price": 350,
    "isActive": true,
    "categories": ["Десерты"],
    "weight": 150,
    "description": "Итальянский десерт с маскарпоне и кофейной пропиткой",
  },
  {
    "id": 3,
    "name": "Латте",
    "price": 220,
    "isActive": true,
    "categories": ["Напитки"],
    "weight": 250,
  },
  {
    "id": 4,
    "name": "Брускетта с томатами",
    "price": 180,
    "isActive": true,
    "categories": ["Закуски"],
    "description": "Хрустящий тост с помидорами и базиликом",
  },
  {
    "id": 5,
    "name": "Стейк Рибай",
    "price": 890,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 300,
    "composition": "Говядина, соль, перец",
  },
  {
    "id": 6,
    "name": "Картофель фри",
    "price": 150,
    "isActive": false,
    "categories": ["Гарниры"],
    "description": "Хрустящий картофель с солью",
  },
  {
    "id": 7,
    "name": "Крем-суп из грибов",
    "price": 240,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 200,
  },
  {
    "id": 8,
    "name": "Мохито",
    "price": 320,
    "isActive": true,
    "categories": ["Напитки", "Алкоголь"],
    "composition": "Ром, лайм, мята, содовая",
  },
  {
    "id": 9,
    "name": "Чизкейк Нью-Йорк",
    "price": 380,
    "isActive": true,
    "categories": ["Десерты"],
  },
  {
    "id": 10,
    "name": "Салат Греческий",
    "price": 290,
    "isActive": true,
    "categories": ["Основные"],
    "composition": "Помидоры, огурцы, оливки, фета, оливковое масло",
  },
  {
    "id": 11,
    "name": "Пицца Маргарита",
    "price": 450,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 400,
  },
  {
    "id": 12,
    "name": "Вино красное сухое",
    "price": 520,
    "isActive": true,
    "categories": ["Алкоголь"],
    "description": "Испанское вино, 2019 год",
  },
  {
    "id": 13,
    "name": "Гуакамоле",
    "price": 210,
    "isActive": true,
    "categories": ["Закуски"],
    "composition": "Авокадо, лайм, кинза, чили",
  },
  {
    "id": 14,
    "name": "Шоколадный фондан",
    "price": 310,
    "isActive": false,
    "categories": ["Десерты"],
    "description": "Тёплый шоколадный кекс с жидкой сердцевиной",
  },
  {
    "id": 15,
    "name": "Эспрессо",
    "price": 150,
    "isActive": true,
    "categories": ["Напитки"],
  },
  {
    "id": 16,
    "name": "Паста Карбонара",
    "price": 490,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 320,
    "description": "Спагетти с беконом в сливочно-яичном соусе",
    "composition": "Спагетти, бекон, пармезан, яйцо, сливки",
  },
  {
    "id": 17,
    "name": "Суп Том Ям",
    "price": 390,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 350,
    "description": "Острый тайский суп с креветками на кокосовом молоке",
    "composition": "Креветки, грибы, томат, лемонграсс, кокосовое молоко",
  },
  {
    "id": 18,
    "name": "Морс клюквенный",
    "price": 190,
    "isActive": true,
    "categories": ["Напитки"],
    "weight": 300,
    "description": "Освежающий напиток из клюквы",
  },
  {
    "id": 19,
    "name": "Спринг-роллы",
    "price": 260,
    "isActive": true,
    "categories": ["Закуски"],
    "weight": 180,
    "description": "Рисовые роллы с овощами и соусом чили",
    "composition": "Рисовая бумага, морковь, огурец, перец, кунжут, соус чили",
  },
  {
    "id": 20,
    "name": "Рататуй",
    "price": 370,
    "isActive": false,
    "categories": ["Основные"],
    "weight": 250,
    "description": "Запечённые овощи с травами Прованса",
    "composition": "Кабачок, баклажан, томат, болгарский перец, прованские травы",
  },
  {
    "id": 21,
    "name": "Бургер с говядиной",
    "price": 550,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 350,
    "description": "Сочная котлета из мраморной говядины с овощами и соусом BBQ",
    "composition": "Булочка, говяжья котлета, салат, томат, огурец, сыр чеддер, соус BBQ",
  },
  {
    "id": 22,
    "name": "Лосось на гриле",
    "price": 890,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 250,
    "description": "Филе лосося с лимоном и зеленью",
    "composition": "Лосось, лимон, розмарин, оливковое масло",
  },
  {
    "id": 23,
    "name": "Оливье с курицей",
    "price": 310,
    "isActive": true,
    "categories": ["Салаты"],
    "weight": 250,
    "description": "Классический салат с куриной грудкой и домашним майонезом",
    "composition": "Курица, картофель, морковь, яйцо, огурец, горошек, майонез",
  },
  {
    "id": 24,
    "name": "Чай с облепихой",
    "price": 210,
    "isActive": true,
    "categories": ["Напитки"],
    "weight": 300,
    "description": "Согревающий чай с облепихой и имбирем",
    "composition": "Чай чёрный, облепиха, имбирь, мёд",
  },
  {
    "id": 25,
    "name": "Начос с сыром",
    "price": 280,
    "isActive": true,
    "categories": ["Закуски"],
    "weight": 200,
    "description": "Кукурузные чипсы с расплавленным сырным соусом",
    "composition": "Чипсы начос, сыр чеддер, халапеньо, зелень",
  },
  {
    "id": 26,
    "name": "Борщ с пампушками",
    "price": 340,
    "isActive": true,
    "categories": ["Супы"],
    "weight": 350,
    "description": "Классический красный борщ со сметаной и чесночными пампушками",
    "composition": "Свекла, капуста, картофель, морковь, лук, говядина, сметана, пампушки",
  },
  {
    "id": 27,
    "name": "Куриные крылышки BBQ",
    "price": 360,
    "isActive": true,
    "categories": ["Закуски"],
    "weight": 280,
    "description": "Запечённые крылышки в пряном соусе",
    "composition": "Куриные крылья, соус BBQ, паприка, чеснок",
  },
  {
    "id": 28,
    "name": "Панна котта",
    "price": 330,
    "isActive": true,
    "categories": ["Десерты"],
    "weight": 130,
    "description": "Нежный сливочный десерт с ягодным соусом",
    "composition": "Сливки, сахар, ваниль, желатин, ягодный соус",
  },
  {
    "id": 29,
    "name": "Лимонад Манго-маракуйя",
    "price": 290,
    "isActive": true,
    "categories": ["Напитки"],
    "weight": 350,
    "description": "Освежающий лимонад с экзотическими фруктами",
    "composition": "Манго, маракуйя, лайм, мята, газированная вода",
  },
  {
    "id": 30,
    "name": "Рис с овощами",
    "price": 250,
    "isActive": true,
    "categories": ["Гарниры"],
    "weight": 200,
    "description": "Пропаренный рис с цуккини, кукурузой и горошком",
    "composition": "Рис, цуккини, кукуруза, горошек, морковь",
  },
  {
    "id": 31,
    "name": "Сырники со сметаной",
    "price": 320,
    "isActive": false,
    "categories": ["Десерты"],
    "weight": 210,
    "description": "Классические сырники из творога с домашней сметаной",
    "composition": "Творог, яйцо, мука, сахар, сметана",
  },
  {
    "id": 32,
    "name": "Глинтвейн",
    "price": 380,
    "isActive": true,
    "categories": ["Напитки", "Алкоголь"],
    "weight": 250,
    "description": "Горячий напиток с красным вином и специями",
    "composition": "Красное вино, апельсин, корица, гвоздика, имбирь, мёд",
  },
  {
    "id": 33,
    "name": "Цезарь с креветками",
    "price": 520,
    "isActive": true,
    "categories": ["Салаты"],
    "weight": 270,
    "description": "Салат с тигровыми креветками и соусом Цезарь",
    "composition": "Креветки, айсберг, помидоры черри, пармезан, сухарики",
  },
  {
    "id": 34,
    "name": "Гречка по-купечески",
    "price": 290,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 280,
    "description": "Гречневая каша с грибами, луком и мясом",
    "composition": "Гречка, курица, шампиньоны, лук, морковь",
  },
  {
    "id": 35,
    "name": "Милкшейк клубничный",
    "price": 270,
    "isActive": true,
    "categories": ["Напитки"],
    "weight": 350,
    "description": "Густой молочный коктейль со свежей клубникой",
    "composition": "Мороженое, молоко, клубника, взбитые сливки",
  }
]

const MENUS = [
  {
    "id": 1,
    "isActive": true,
    "products": PRODUCTS,
    "companyName": "Кафе «Уют»",
    "menuName": "Основное меню",
    "categories": ["Основные", "Десерты", "Напитки", "Закуски", "Гарниры", "Алкоголь"],
    "image": "/api/public/images/menu_icon.jpg"
  },
  {
    "id": 2,
    "isActive": true,
    "products": PRODUCTS.filter((_, index) => index % 2 == 0),
    "companyName": "Кафе «Уют»",
    "menuName": "Летнее меню",
    "categories": ["Основные", "Десерты", "Напитки", "Закуски", "Гарниры", "Алкоголь"],
    "image": "/api/public/images/menu_icon.jpg"
  },
  {
    "id": 3,
    "isActive": false,
    "products": PRODUCTS.filter((_, index) => index % 2 != 0),
    "companyName": "Кафе «Уют»",
    "menuName": "Новогоднее меню",
    "categories": ["Основные", "Десерты", "Напитки", "Закуски", "Гарниры", "Алкоголь"]
  },
]

const selectSomeProductInCart = (eachIndex = 10, maxAmount = 3, offset = 1) => {
  return PRODUCTS
    .filter(product => product.isActive)
    .filter((_, index) => index % eachIndex === 0)
    .map((product, index) => { return { 
      productId: product.id, 
      productName: product.name, 
      amount: (index % maxAmount) + offset } 
    });
}

const ORDERS = [
  {
    tableNum: "10",
    products: selectSomeProductInCart(),
    status: OrderStatus.NEW,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  },
  {
    tableNum: "10",
    products: selectSomeProductInCart(10, 4, 1),
    status: OrderStatus.NEW,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  },
  {
    tableNum: "10",
    products: selectSomeProductInCart(10, 4, 1).splice(0, 1),
    status: OrderStatus.NEW,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  },
  {
    tableNum: "12",
    products: selectSomeProductInCart(9, 3, 1),
    status: OrderStatus.NEW,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  },
  {
    tableNum: "14",
    products: selectSomeProductInCart(20, 3, 1),
    status: OrderStatus.NEW,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  },
  {
    tableNum: "20",
    products: selectSomeProductInCart(5, 3, 1),
    status: OrderStatus.NEW,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  },
]

function replaceCodeWithId(list) {
  list.forEach(e => {
    e.code = e.id;
    delete e.id;
  });
}

function randomInt(start, end) {
  const diff = end - start;
  return Math.round(start + Math.random() * diff);
}

function randomItem(list) {
  if (!list?.length) return;
  const index = Math.round(Math.random() * (list.length - 1));
  return list[index];
}

function randomItems({ list, filterChance, notEmpty = false }) {
  if (!list?.length) return [];
  const items = list.filter(item => Math.random() <= filterChance);
  return !items.length && notEmpty ? [randomItem(list)] : items;
}

async function createDirIfNotExists(dir) {
  await fs.mkdir(dir, { recursive: true });
  console.log(`Directory exists: ${dir}`);
}

async function clearDirectory(dir) {
  const files = await fs.readdir(dir);
  await Promise.all(files.map(file => fs.unlink(path.join(dir, file))));
  console.log(`All files deleted from: ${dir}`);
}

async function copyAllFiles(sourceDir, targetDir) {
  await fs.cp(sourceDir, targetDir, { recursive: true });
  console.log(`Seed images copied!`);
}

async function seed() {
  // prepare data

  replaceCodeWithId(PRODUCTS);
  replaceCodeWithId(MENUS);

  // connect mongo

  await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
  console.log("Successfully connected to MongoDB!");

  // public

  await createDirIfNotExists(imagesDir);
  await createDirIfNotExists(qrsDir);

  await clearDirectory(imagesDir);
  await clearDirectory(qrsDir);

  await copyAllFiles(seedImagesDir, imagesDir);

  const IMAGES = await fs.readdir(imagesDir);
  function findImage(imageName) {
    const pattern = new RegExp(`^${imageName}\\.(.+)$`);
    const fileName = IMAGES.find(file => pattern.test(file));
    return `/api/public/images/${fileName}`;
  }

  // seed users

  const MAIN_USER_INDEX = 1;

  USERS.forEach(u => {
    u.createAt = new Date();
    u.apiAccessToken = "not-set";
  });

  await User.deleteMany({}).exec();

  const avatar = findImage("avatar");
  USERS[MAIN_USER_INDEX].avatar = avatar;

  const createdUsers = await User.create(USERS);
  await Promise.all(createdUsers.map(async (user) => {
    const userTokenData = UserTokenData.build(user).model;
    user.apiAccessToken = generateToken(userTokenData);
    await user.save();
  }))

  const MAIN_USER = createdUsers[MAIN_USER_INDEX];

  // seed menus

  const MENU_WITH_IMAGE_MAX_INDEX = 1;

  const menuImage = findImage("menu_image");

  MENUS.forEach((m, i) => { 
    m.ownerId = MAIN_USER._id; 
    m.createAt = new Date(new Date().getTime() + i * 1000);
    if (i <= MENU_WITH_IMAGE_MAX_INDEX) m.image = menuImage;
  });

  PRODUCTS.forEach(product => {
    const image = findImage(`product_${product.code}`);
    product.image = image;
  });

  await Promise.all(MENUS.map(async (m) => m.qr = await generateQrCode(m.code)));

  await Menu.deleteMany({}).exec();
  await Menu.create(MENUS);

  const MAIN_MENU = MENUS.find(m => m.code == 1);

  // seed orders

  const CLOSED_ORDERS_COUNT = 100;
  const closedOrders = [];

  for (let i = CLOSED_ORDERS_COUNT; i >= 1; i--) {
    let products = randomItems({ list: MAIN_MENU.products, filterChance: 0.1, notEmpty: true });
    products = products.map(p => ({ productId: p.code, productName: p.name, amount: Math.round(Math.random() * 5) + 1}));

    const finalAmount = products.reduce((sum, productInCart) => 
			sum + MAIN_MENU.products.find(product => product.code == productInCart.productId).price * productInCart.amount,
			0
		);

    closedOrders.push({
      code: i,
      accessKey: randomUUID(),
      menuId: MAIN_MENU.code,
      ownerId: MAIN_USER._id,
      sendTime: new Date(new Date().getTime() - (CLOSED_ORDERS_COUNT - i) * 3_600_000),
      tableNum: randomInt(1, 30),
      products: products,
      finalAmount: finalAmount,
      status: randomItem([OrderStatus.BANNED, OrderStatus.EXECUTED, OrderStatus.CANCELED]),
      userAgent: randomItem(USERS_AGENTS),
    });
  }

  ORDERS.forEach((order, index) => {
    order.code = CLOSED_ORDERS_COUNT + index + 1;
    order.accessKey = randomUUID();
    order.menuId = MAIN_MENU.code;
    order.ownerId = MAIN_USER._id;
    order.sendTime = new Date(new Date().getTime() + index * 1000);
    order.finalAmount = order.products.reduce((sum, productInCart) => 
			sum + MAIN_MENU.products.find(product => product.code == productInCart.productId).price * productInCart.amount,
			0
		);
  });

  await Order.deleteMany({}).exec();
  await Order.create([...closedOrders, ...ORDERS]);

  // seed statistic

  const EVENTS_COUNT = 1500;
  const BORDER_DAYS = 40;
  const MIN_TIME = 10 * 3600000;  // 10:00 in milliseconds
  const MAX_TIME = 22 * 3600000;  // 22:00 in milliseconds

  const events = []
  for (let i = 0; i < EVENTS_COUNT; i++) {
    const eventType = randomItem(["view-menu", "view-product", "like-product"])

    const sendTime = new Date();
    sendTime.setDate(sendTime.getDate() - randomInt(1, BORDER_DAYS));
    sendTime.setHours(0, 0, 0, 0);
    const randomOffset = randomInt(MIN_TIME, MAX_TIME);
    sendTime.setTime(sendTime.getTime() + randomOffset);

    events.push({
      event: eventType,
      menuId: MAIN_MENU.code,
      productName: eventType !== "view-menu" ? randomItem(MAIN_MENU.products).name : undefined,
      sendTime: sendTime,
      userAgent: randomItem(USERS_AGENTS),
    })
  }

  await Event.deleteMany({}).exec();
  await Event.create(events);
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
