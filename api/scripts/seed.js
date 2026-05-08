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

dotenv.config();

const __dirname = path.resolve();

// Пути к папкам
const imagesDir = path.join(__dirname, '/public/images');
const qrsDir = path.join(__dirname, '/public/qrs');
const seedImagesDir = path.join(__dirname, '/public/seed-images');

const USERS = [
  {
    phone: "+70000000000",
    email: "example@example.com",
    name: "Иван Иванович",
    passwordHash: hashPassword("12345678"),
    isActive: true,
    createAt: new Date(),
    apiAccessToken: "not-set",
    role: "owner",
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
    avatar: "https://sotni.ru/wp-content/uploads/2023/08/genri-kavill-1.webp",
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
    "image": "https://menunedeli.ru/wp-content/uploads/2022/07/41322293-5B97-451F-886E-2522AB91F67B-886x700.jpeg"
  },
  {
    "id": 2,
    "name": "Тирамису",
    "price": 350,
    "isActive": true,
    "categories": ["Десерты"],
    "weight": 150,
    "description": "Итальянский десерт с маскарпоне и кофейной пропиткой",
    "image": "https://19tortov.ru/upload/resize_cache/iblock/39f/500_500_1/20192643.jpg"
  },
  {
    "id": 3,
    "name": "Латте",
    "price": 220,
    "isActive": true,
    "categories": ["Напитки"],
    "weight": 250,
    "image": "https://coffee61.ru/wa-data/public/photos/68/03/368/368.970.jpg"
  },
  {
    "id": 4,
    "name": "Брускетта с томатами",
    "price": 180,
    "isActive": true,
    "categories": ["Закуски"],
    "description": "Хрустящий тост с помидорами и базиликом",
    "image": "https://eda.ru/images/RecipePhoto/390x390/brusketta-s-pomidorami-i-mocarelloj_41582_photo_33956.jpg"
  },
  {
    "id": 5,
    "name": "Стейк Рибай",
    "price": 890,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 300,
    "composition": "Говядина, соль, перец",
    "image": "https://la-riva.ru/assets/images/products/2302/e1deb7394fdd7f15ede274980b1ee6e7baac4eba.jpg"
  },
  {
    "id": 6,
    "name": "Картофель фри",
    "price": 150,
    "isActive": false,
    "categories": ["Гарниры"],
    "description": "Хрустящий картофель с солью",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESjIDOn4TZW75bmLjyCvT_D9dPZ37ZB7V1w&s"
  },
  {
    "id": 7,
    "name": "Крем-суп из грибов",
    "price": 240,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 200,
    "image": "https://eda.ru/images/RecipePhoto/390x390/krem-sup-iz-shampinonov-s-timyanom-i-soevym-sousom_125761_photo_149129.jpg"
  },
  {
    "id": 8,
    "name": "Мохито",
    "price": 320,
    "isActive": true,
    "categories": ["Напитки", "Алкоголь"],
    "composition": "Ром, лайм, мята, содовая",
    "image": "https://ist.say7.info/img0007/11/711_01303xh_3913_1024.jpg"
  },
  {
    "id": 9,
    "name": "Чизкейк Нью-Йорк",
    "price": 380,
    "isActive": true,
    "categories": ["Десерты"],
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8Xi9QxCSIz-2kCv59Hd1NbBVSP0NhEvDnmQ&s"
  },
  {
    "id": 10,
    "name": "Салат Греческий",
    "price": 290,
    "isActive": true,
    "categories": ["Основные"],
    "composition": "Помидоры, огурцы, оливки, фета, оливковое масло",
    "image": "https://art-lunch.ru/content/uploads/2018/07/Greek_salad_01.jpg"
  },
  {
    "id": 11,
    "name": "Пицца Маргарита",
    "price": 450,
    "isActive": true,
    "categories": ["Основные"],
    "weight": 400,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZBz8TcV074DnRF_I2oNUdjxiHVxEfGoHVng&s"
  },
  {
    "id": 12,
    "name": "Вино красное сухое",
    "price": 520,
    "isActive": true,
    "categories": ["Алкоголь"],
    "description": "Испанское вино, 2019 год",
    "image": "https://media.uteka.ru/media/512/202311/2_4539.jpg"
  },
  {
    "id": 13,
    "name": "Гуакамоле",
    "price": 210,
    "isActive": true,
    "categories": ["Закуски"],
    "composition": "Авокадо, лайм, кинза, чили",
    "image": "https://receptoriy.ru/upload/Guacamole.jpg"
  },
  {
    "id": 14,
    "name": "Шоколадный фондан",
    "price": 310,
    "isActive": false,
    "categories": ["Десерты"],
    "description": "Тёплый шоколадный кекс с жидкой сердцевиной",
    "image": "https://eda.ru/images/RecipePhoto/390x390/shokoladnij-fondan_49755_photo_53437.jpg"
  },
  {
    "id": 15,
    "name": "Эспрессо",
    "price": 150,
    "isActive": true,
    "categories": ["Напитки"],
    "image": "https://e1.edimdoma.ru/data/ingredients/0000/2850/2850-ed4_wide.jpg?1515762750"
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
    "image": "https://i.ytimg.com/vi/0jRxAf7GpUs/maxresdefault.jpg"
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
    "image": "https://seafood-shop.ru/_next/image/?url=https%3A%2F%2Fapi.seafood-shop.ru%2Fupload%2Fiblock%2F6f5%2Fhffvyrl3vk6q43lu662l6qjsamm9pe0u%2Ftom_yam.png&w=3840&q=75"
  },
  {
    "id": 18,
    "name": "Морс клюквенный",
    "price": 190,
    "isActive": true,
    "categories": ["Напитки"],
    "weight": 300,
    "description": "Освежающий напиток из клюквы",
    "image": "https://cdn.кухня.рф/preview/b35e57ad-d4ee-4714-b732-c4b177b8d361.webp"
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
    "image": "https://porusski.me/wp-content/uploads/2020/09/IMG-5843.jpg"
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
    "image": "https://eda.rambler.ru/images/RecipePhoto/1280x1280/ratatuy-s-sousom_51981_photo_60330.jpg"
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
    "image": "https://images2.novochag.ru/upload/img_cache/93f/93f89c1d9567dfe2c1b5252c1b2c244a_ce_1275x881x0x488_cropped_666x444.webp"
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
    "image": "https://grill-bbq.ru/wp-content/uploads/2023/03/file-semgi-s-salsoj-1.jpg"
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
    "image": "https://menunedeli.ru/wp-content/uploads/2016/08/olive-500x300.jpg"
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
    "image": "https://avatars.mds.yandex.net/get-vertis-journal/3934100/948603ab-b98e-4a7e-9e74-6f462f924052.jpeg/1600x1600"
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
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8ydIAi2Rs5n9rhtRxk04KXSYyw4mRKjIK9Q&s"
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
    "image": "https://tutknow.ru/uploads/posts/2025-10/borsch2.webp"
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
    "image": "https://baku32.ru/catalog/zakuski-k-pivo/units/kurinie-krilishki/images/kurinie-krilishki"
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
    "image": "https://lasunka.com/Blog/2023/dietychna-panna-kotta-zi-smetany-bez-vershkiv.jpg"
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
    "image": "https://foodfriends.ru/assets/image-cache/files/images/old/images/ff-images/%D0%A0%D0%95%D0%A6%D0%95%D0%9F%D0%A2%D0%AB/Mango_marakuya.Turandot.6707353c.jpg"
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
    "image": "https://img.povar.ru/mobile/0b/e6/58/de/ris_s_ovoshami_po-kitaiski-371288.png"
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
    "image": "https://s1.eda.ru/StaticContent/Photos/120131085305/1711131155020/p_O.jpg"
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
    "image": "https://static.vkusnyblog.com/full/uploads/2009/07/glintwein-new.jpg"
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
    "image": "https://www.arise-app.com/images/dishes/ru/salat-cezar-s-krevetkami-i-lososem-y10qbi.webp"
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
    "image": "https://www.russianfood.com/dycontent/images_upl/549/big_548793.jpg"
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
    "image": "https://barlist.ru/media/uploads/str_milkshake.jpg"
  }
]

const MENUS = [
  {
    "id": 1,
    "isActive": true,
    "createAt": new Date(),
    "products": PRODUCTS,
    "companyName": "Кафе «Уют»",
    "menuName": "Основное меню",
    "categories": ["Основные", "Десерты", "Напитки", "Закуски", "Гарниры", "Алкоголь"],
    "image": "https://images.assetsdelivery.com/compings_v2/vectorchef/vectorchef1507/vectorchef150709093.jpg"
  },
  {
    "id": 2,
    "isActive": true,
    "createAt": new Date(),
    "products": PRODUCTS.filter((_, index) => index % 2 == 0),
    "companyName": "Кафе «Уют»",
    "menuName": "Основное меню",
    "categories": ["Основные", "Десерты", "Напитки", "Закуски", "Гарниры", "Алкоголь"],
    "image": "https://images.assetsdelivery.com/compings_v2/vectorchef/vectorchef1507/vectorchef150709093.jpg"
  },
  {
    "id": 3,
    "isActive": false,
    "createAt": new Date(),
    "products": PRODUCTS.filter((_, index) => index % 2 != 0),
    "companyName": "Кафе «Уют»",
    "menuName": "Новогоднее меню",
    "categories": ["Основные", "Десерты", "Напитки", "Закуски", "Гарниры", "Алкоголь"]
  },
]

const ORDERS = [
  {
    id: 1,
    accessKey: "0711a659-4533-447e-b523-a19bbffd5313",
    menuId: 1,
    tableNum: "10",
    sendTime: new Date(),
    products: PRODUCTS.filter((_, index) => index % 10 === 0).map((product, index) => { return { productId: product.id, amount: index % 3 } }),
    status: OrderStatus.CANCELED,
  },
  {
    id: 2,
    accessKey: "43dc8ef4-45ab-4e8d-97f2-ea92015e31de",
    menuId: 1,
    tableNum: "10",
    sendTime: new Date(),
    products: PRODUCTS.filter((_, index) => index % 10 === 0).map((product, index) => { return { productId: product.id, amount: index % 4 } }),
    status: OrderStatus.CANCELED,
    prevId: 1,
    prevCount: 1,
  },
  {
    id: 3,
    accessKey: "bd4f792f-87fb-4c47-8b39-57c8cb73503e",
    menuId: 1,
    tableNum: "10",
    sendTime: new Date(),
    products: PRODUCTS.filter((_, index) => index % 10 === 0).map((product, index) => { return { productId: product.id, amount: index % 4 } }).splice(0, 1),
    status: OrderStatus.NEW,
    prevId: 2,
    prevCount: 2,
  },
  {
    id: 4,
    accessKey: "698b13a4-2af2-491d-8d2e-89a62fd9e131",
    menuId: 1,
    tableNum: "12",
    sendTime: new Date(),
    products: PRODUCTS.filter((_, index) => index % 9 === 0).map((product, index) => { return { productId: product.id, amount: index % 3 } }),
    status: OrderStatus.NEW,
  },
  {
    id: 5,
    accessKey: "a83a0a80-33d6-4523-a1e2-87fed9619144",
    menuId: 1,
    tableNum: "14",
    sendTime: new Date(),
    products: PRODUCTS.filter((_, index) => index % 20 === 0).map((product, index) => { return { productId: product.id, amount: index % 3 } }),
    status: OrderStatus.NEW,
  },
]

function replaceCodeWithId(list) {
  list.forEach(e => {
    e.code = e.id;
    delete e.id;
  });
}

async function clearDirectory(dir) {
  const files = await fs.readdir(dir);
  await Promise.all(files.map(file => fs.unlink(path.join(dir, file))));
  console.log(`All files deleted from: ${dir}`);
}

async function seed() {
  // prepare data

  replaceCodeWithId(PRODUCTS);
  replaceCodeWithId(MENUS);
  replaceCodeWithId(ORDERS);

  // connect mongo

  await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
  console.log("Successfully connected to MongoDB!");

  // public

  await clearDirectory(imagesDir);
  await clearDirectory(qrsDir);

  // seed users

  await User.deleteMany({}).exec();
  const createdUsers = await User.create(USERS);

  await Promise.all(createdUsers.map(async (user) => {
    const userTokenData = UserTokenData.build(user).model;
    user.apiAccessToken = generateToken(userTokenData);
    await user.save();
  }))

  // seed menus

  MENUS.forEach(m => m.ownerId = createdUsers[1]._id);
  await Promise.all(MENUS.map(async (m) => m.qr = await generateQrCode(m.code)));

  await Menu.deleteMany({}).exec();
  await Menu.create(MENUS);

  // seed orders

  await Order.deleteMany({}).exec();
  await Order.create(ORDERS);
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
