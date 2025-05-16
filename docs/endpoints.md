# Эндпоинты API

## Содержание

[Воспользуйтесь автоформируемым содержанием на GitHub]

## Настройка и запуск API

- Синхронизировать репозиторий с веткой dev
- Перейти в папку `api`
- Добавить файл переменных окружения `.env`, взять его из папки проекта на диске (ЭТОТ ФАЙЛ НЕ ДОЛЖЕН БЫТЬ ОПУБЛИКОВАН ИЛИ ПОПАСТЬ В ПУБЛИЧНЫЙ РЕПОЗИТОРИИ)
- Установить все зависимости `npm install`
- Запустить проект командой `npm run start` (должен запуститься на порту 4200)

Для отправки запросов можно использовать расширение для VS Code: `REST Client`

Пример запроса:
```http
GET http://localhost:4200/api/menu/1
```

Больше примеров в папке `/api/tests/http`

## Пользователи

### Авторизация

Авторизация владельца.

Метод: `POST` Путь: `/api/user/auth` Авторизация: `нет`

_Схема запроса_:

Модель Auth
```js
{
  phone: { type: "string", required: true, clear: /[^\d+]/g, regExp: /^\+\d{10,15}$/ },
  password: { type: "string", required: true, minLength: 8, maxLength: 100 },
}
```

_Пример запроса_:
```http
POST http://localhost:4200/api/user/auth
content-type: application/json

{
  "phone": "+7 (000) 000-00-00",
  "password": "12345678"
}
```

**Ответ 422: Ошибка в полях запроса**

**Ответ 401: Неверный логин или пароль**

**Ответ 403: Аккаунт не активен**

**Ответ 200: Авторизация прошла успешно**

_Схема ответа_:

Модель UserReturn
```js
{
  id: { type: "string", valid: true },
  phone: { type: "string", valid: true },
  email: { type: "string", valid: true },
  name: { type: "string", valid: true },
  isActive: { type: "boolean", valid: true },
  createAt: { type: "datetime", valid: true },
  apiAccessToken: { type: "string", valid: true },
  role: { type: "string", valid: true },
  avatar: { type: "string", valid: true },
}
```

### Регистрация

Регистрация владельца.

Метод: `POST` Путь: `/api/user/reg` Авторизация: `нет`

_Схема запроса_:

Модель UserCreate
```js
{
  phone: { type: "string", required: true, clear: /[^\d+]/g, regExp: /^\+\d{10,15}$/ },
  email: { type: "string", required: true, trim: true, regExp: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ },
  name: { type: "string", required: true, trim: true, minLength: 2, maxLength: 50 },
  avatar: { type: "string", required: false, maxLength: 255 },
  password: { type: "string", required: true, minLength: 8, maxLength: 100 },
}
```

_Пример запроса_:
```http
POST http://localhost:4200/api/user/reg
content-type: application/json

{
  "phone": " + 7 (000) 000-00-00 ",
  "email": "  example@example.com  ",
  "name": "  Пользователь 1  ",
  "password": "12345678",
  "avatar": "https://example.com/avatar"
}
```

**Ответ 422: Ошибка в полях запроса**

**Ответ 400: Не уникальный номер телефона**

**Ответ 200: Регистрация прошла успешно**

_Схема ответа_:

Модель UserReturn
```js
{
  id: { type: "string", valid: true },
  phone: { type: "string", valid: true },
  email: { type: "string", valid: true },
  name: { type: "string", valid: true },
  isActive: { type: "boolean", valid: true },
  createAt: { type: "datetime", valid: true },
  apiAccessToken: { type: "string", valid: true },
  role: { type: "string", valid: true },
  avatar: { type: "string", valid: true },
}
```

### Обновление данных аккаунта

Обновление данных пользователя.

Метод: `PUT` Путь: `/api/user/update` Авторизация: `есть`

_Схема запроса_:

Модель UserUpdate
```js
{
  phone: { type: "string", notnull: true, clear: /[^\d+]/g, regExp: /^\+\d{10,15}$/ },
  email: { type: "string", notnull: true, trim: true, regExp: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ },
  name: { type: "string", notnull: true, trim: true, minLength: 2, maxLength: 50 },
  avatar: { type: "string", maxLength: 255 },
  password: { type: "string", notnull: true, minLength: 8, maxLength: 100 },
}
```

_Особенности_:
- Id пользователя для обновления берется из токена авторизации (`user.apiAccessToken`)
- Обновяться только переданные поля, остальные сохранят прежние значения
- notnull != required, notnull не позволяет передать `"field": null` в json объекте, но позволяет не указывать field вовсе, в таком случае при обновлении неуказанное поле не будет никак изменено. Если атрибут notnull не установлен то при передаче `"field": null` в json объекте поле будет удалено из обновляемого документа в базе данных.

_Пример запроса_:
```http
PUT http://localhost:4200/api/user/update
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBlMWEzN2QzNTQxZGMyYTFjZjYyOWYiLCJpYXQiOjE3NDU3NTQ2ODB9.itiqU7QJdIjhCTQe65oKW9sTKMYvOyjPcKv--uph2RA
content-type: application/json

{
  "phone": " + 7 (000) 000-00-10 ",
  "email": "  example@example.com  ",
  "name": "  Пользователь 2  ",
  "avatar": null
}
```

**Ответ 422: Ошибка в полях запроса**

**Ответ 404: Пользователь, которому принадлежит токен не найден в БД**

**Ответ 400: Не уникальный номер телефона**

**Ответ 200: Обновление прошло успешно**

_Схема ответа_:

Модель UserReturn
```js
{
  id: { type: "string", valid: true },
  phone: { type: "string", valid: true },
  email: { type: "string", valid: true },
  name: { type: "string", valid: true },
  isActive: { type: "boolean", valid: true },
  createAt: { type: "datetime", valid: true },
  apiAccessToken: { type: "string", valid: true },
  role: { type: "string", valid: true },
  avatar: { type: "string", valid: true },
}
```

### Актуализация данных

Получение данных о пользователе по id из токена.

Метод: `GET` Путь: `/api/user/me` Авторизация: `есть`

_Особенности_:
- Запрос не требует параметров или тела, Id пользователя берется из токена авторизации (`user.apiAccessToken`)

_Пример запроса_:
```http
GET http://localhost:4200/api/user/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBlMWEzN2QzNTQxZGMyYTFjZjYyOWYiLCJpYXQiOjE3NDU3NTQ2ODB9.itiqU7QJdIjhCTQe65oKW9sTKMYvOyjPcKv--uph2RA
```

**Ответ 404: Пользователь, которому принадлежит токен не найден в БД**

**Ответ 200: Данные найдены и возвращены**

_Схема ответа_:

Модель UserReturn
```js
{
  id: { type: "string", valid: true },
  phone: { type: "string", valid: true },
  email: { type: "string", valid: true },
  name: { type: "string", valid: true },
  isActive: { type: "boolean", valid: true },
  createAt: { type: "datetime", valid: true },
  apiAccessToken: { type: "string", valid: true },
  role: { type: "string", valid: true },
  avatar: { type: "string", valid: true },
}
```

## Меню

### Получить список меню владельца

Получение списка меню, принадлежащих этому владельцу.

Метод: `GET` Путь: `/api/menu/my` Авторизация: `есть`

_Особенности_:
- Id пользователя для обновления берется из токена авторизации (`user.apiAccessToken`)

_Пример запроса_:
```http
GET {{baseUrl}}/api/menu/my
Authorization: {{token}}
```

**Ответ 200: Список меню владельца**

_Схема ответа_:

Модель MenuListReturn
```js
{
  menus: {
    type: "list",
    item: { type: MinimizedMenuReturn },
  }
}
```

Модель MinimizedMenuReturn
```js
{
  id: { type: "number", valid: true, sourceName: "code" },
  ownerId: { type: "string", valid: true },
  isActive: { type: "boolean", valid: true },
  createAt: { type: "datetime", valid: true },
  qr: { type: "string", valid: true },
  companyName: { type: "string", valid: true },
  menuName: { type: "string", valid: true },
  image: { type: "string", valid: true }
}
```

### Получить по id

Получение меню по id.

Метод: `GET` Путь: `/api/menu/:menuId` Авторизация: `нет`

_Пример запроса_:
```http
GET {{baseUrl}}/api/menu/1
```

**Ответ 404: Меню не найдено**

**Ответ 200: Меню найдено**

_Схема ответа_:

Модель MenuReturn
```js
{
  id: { type: "number", valid: true, sourceName: "code" },
  ownerId: { type: "string", valid: true },
  isActive: { type: "boolean", valid: true },
  createAt: { type: "datetime", valid: true },
  qr: { type: "string", valid: true },
  products: {
    type: "list",
    item: { type: ProductReturn },
  },
  companyName: { type: "string", valid: true },
  menuName: { type: "string", valid: true },
  categories: {
    type: "list",
    item: { type: "string" },
  },
  image: { type: "string", valid: true }
}
```

Модель ProductReturn
```js
{
  name: { type: "string", valid: true },
  price: { type: "number", valid: true },
  isActive: { type: "boolean", valid: true },
  categories: {
    type: "list",
    item: { type: "string", valid: true },
  },
  weight: { type: "number", valid: true },
  description: { type: "string", valid: true },
  composition: { type: "string", valid: true },
  image: { type: "string", valid: true }
}
```

### Создание меню

Создание меню.

Метод: `POST` Путь: `/api/menu` Авторизация: `есть`

_Схема запроса_:

Модель MenuCreate
```js
{
  isActive: { type: "boolean", required: true },
  products: {
    type: "list",
    required: true,
    minLength: 1,
    maxLength: 100,
    item: { type: ProductEdit, notnull: true },
    uniqueItems: true,
    itemsComparator: (p1, p2) => p1.name == p2.name,
  },
  companyName: { type: "string", required: true, trim: true, minLength: 1, maxLength: 100 },
  menuName: { type: "string", required: true, trim: true, minLength: 1, maxLength: 100 },
  categories: {
    type: "list",
    item: { type: "string", minLength: 1, maxLength: 30, trim: true, notnull: true, sentenseCase: true },
    maxLength: 30,
    uniqueItems: true
  },
  image: { type: "string", maxLength: 255 }
}
```

Модель ProductEdit
```js
{
  name: { type: "string", required: true, minLength: 1, maxLength: 50, trim: true, sentenseCase: true },
  price: { type: "number", required: true, min: 0, max: 1_000_000, round: true },
  isActive: { type: "boolean", required: true },
  categories: {
    type: "list",
    item: { type: "string", minLength: 1, maxLength: 15, trim: true, notnull: true, sentenseCase: true },
    maxLength: 30,
    uniqueItems: true
  },
  weight: { type: "number", min: 0, max: 1_000_000, round: true },
  description: { type: "string", maxLength: 1000, trim: true },
  composition: { type: "string", maxLength: 1000, trim: true },
  image: { type: "string", maxLength: 255 }
}
```

_Пример запроса_:
```http
POST {{baseUrl}}/api/menu
Authorization: {{token}}
content-type: application/json

{
  "isActive": true,
  "products": [
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
    }
  ],
  "companyName": "Кафе «Уют»",
  "menuName": "Основное меню",
  "categories": ["Основные", "Десерты", "Напитки", "Закуски", "Гарниры", "Алкоголь"],
  "image": "https://previews.123rf.com/images/vectorchef/vectorchef1507/vectorchef150709093/42871957-menu-icon.jpg"
}
```

**Ответ 422: Ошибка в полях запроса**

**Ответ 200: Меню создано**

_Схема ответа_:

Модель MenuReturn
```js
{
  id: { type: "number", valid: true, sourceName: "code" },
  ownerId: { type: "string", valid: true },
  isActive: { type: "boolean", valid: true },
  createAt: { type: "datetime", valid: true },
  qr: { type: "string", valid: true },
  products: {
    type: "list",
    item: { type: ProductReturn },
  },
  companyName: { type: "string", valid: true },
  menuName: { type: "string", valid: true },
  categories: {
    type: "list",
    item: { type: "string" },
  },
  image: { type: "string", valid: true }
}
```

Модель ProductReturn
```js
{
  name: { type: "string", valid: true },
  price: { type: "number", valid: true },
  isActive: { type: "boolean", valid: true },
  categories: {
    type: "list",
    item: { type: "string", valid: true },
  },
  weight: { type: "number", valid: true },
  description: { type: "string", valid: true },
  composition: { type: "string", valid: true },
  image: { type: "string", valid: true }
}
```

### Обновление меню

Обновление меню.

Метод: `PUT` Путь: `/api/menu/:menuId` Авторизация: `есть`

_Схема запроса_:

Модель MenuUpdate
```js
{
  isActive: { type: "boolean", notnull: true },
  products: {
    type: "list",
    notnull: true,
    minLength: 1,
    maxLength: 100,
    item: { type: ProductEdit, notnull: true },
    uniqueItems: true,
    itemsComparator: (p1, p2) => p1.name == p2.name,
  },
  companyName: { type: "string", notnull: true, trim: true, minLength: 1, maxLength: 100 },
  menuName: { type: "string", notnull: true, trim: true, minLength: 1, maxLength: 100 },
  categories: {
    type: "list",
    item: { type: "string", minLength: 1, maxLength: 30, trim: true, notnull: true, sentenseCase: true },
    maxLength: 30,
    uniqueItems: true
  },
  image: { type: "string", maxLength: 255 }
}
```

Модель ProductEdit
```js
{
  name: { type: "string", required: true, minLength: 1, maxLength: 50, trim: true, sentenseCase: true },
  price: { type: "number", required: true, min: 0, max: 1_000_000, round: true },
  isActive: { type: "boolean", required: true },
  categories: {
    type: "list",
    item: { type: "string", minLength: 1, maxLength: 15, trim: true, notnull: true, sentenseCase: true },
    maxLength: 30,
    uniqueItems: true
  },
  weight: { type: "number", min: 0, max: 1_000_000, round: true },
  description: { type: "string", maxLength: 1000, trim: true },
  composition: { type: "string", maxLength: 1000, trim: true },
  image: { type: "string", maxLength: 255 }
}
```

_Пример запроса_:
```http
PUT {{baseUrl}}/api/menu/1
Authorization: {{token}}
content-type: application/json

{
  "isActive": false,
  "createAt": "2024-04-29T12:38:32.609Z",
  "products": [
    {
      "name": "Цезарь с курицей 2",
      "price": 420,
      "isActive": false,
      "categories": ["Основные", "  new category  "],
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
    }
  ],
  "companyName": "Кафе «Уют»",
  "menuName": "Основное меню",
  "categories": ["Основные", "Десерты", "Напитки", "Закуски", "Гарниры", "Алкоголь"],
  "image": "https://previews.123rf.com/images/vectorchef/vectorchef1507/vectorchef150709093/42871957-menu-icon.jpg"
}
```

**Ответ 422: Ошибка в полях запроса**

**Ответ 404: Меню с таким id не найдено**

**Ответ 403: Это меню принадлежит другому пользователю**

**Ответ 200: Меню обнолвено**

_Схема ответа_:

Модель MenuReturn
```js
{
  id: { type: "number", valid: true, sourceName: "code" },
  ownerId: { type: "string", valid: true },
  isActive: { type: "boolean", valid: true },
  createAt: { type: "datetime", valid: true },
  qr: { type: "string", valid: true },
  products: {
    type: "list",
    item: { type: ProductReturn },
  },
  companyName: { type: "string", valid: true },
  menuName: { type: "string", valid: true },
  categories: {
    type: "list",
    item: { type: "string" },
  },
  image: { type: "string", valid: true }
}
```

Модель ProductReturn
```js
{
  name: { type: "string", valid: true },
  price: { type: "number", valid: true },
  isActive: { type: "boolean", valid: true },
  categories: {
    type: "list",
    item: { type: "string", valid: true },
  },
  weight: { type: "number", valid: true },
  description: { type: "string", valid: true },
  composition: { type: "string", valid: true },
  image: { type: "string", valid: true }
}
```

### Удаление меню

Удаление меню.

Метод: `DELETE` Путь: `/api/menu/:menuId` Авторизация: `есть`

_Пример запроса_:
```http
DELETE {{baseUrl}}/api/menu/1
Authorization: {{token}}
```

**Ответ 422: Ошибка в полях запроса**

**Ответ 404: Меню с таким id не найдено**

**Ответ 403: Это меню принадлежит другому пользователю**

**Ответ 200: Меню удалено и возвращено в ответе**

_Схема ответа_:

Модель MenuReturn
```js
{
  id: { type: "number", valid: true, sourceName: "code" },
  ownerId: { type: "string", valid: true },
  isActive: { type: "boolean", valid: true },
  createAt: { type: "datetime", valid: true },
  qr: { type: "string", valid: true },
  products: {
    type: "list",
    item: { type: ProductReturn },
  },
  companyName: { type: "string", valid: true },
  menuName: { type: "string", valid: true },
  categories: {
    type: "list",
    item: { type: "string" },
  },
  image: { type: "string", valid: true }
}
```

Модель ProductReturn
```js
{
  name: { type: "string", valid: true },
  price: { type: "number", valid: true },
  isActive: { type: "boolean", valid: true },
  categories: {
    type: "list",
    item: { type: "string", valid: true },
  },
  weight: { type: "number", valid: true },
  description: { type: "string", valid: true },
  composition: { type: "string", valid: true },
  image: { type: "string", valid: true }
}
```

## Медиа

### Загрузка картинки

Загрузка файла с изображением.

Метод: `POST` Путь: `/api/media/image` Авторизация: `есть` Тип контента: `multipart/form-data`

_Особенности_:
- возвращает относитьный путь к изображению (НЕ ПОЛНЫЙ URL)
- разрешенные форматы файлов: `['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']`
- максимальный размер файла 5 Мб

_Поля формы_:
- `image`: файл изображения

_Пример запроса_:
```http
POST {{baseUrl}}/api/media/image
Authorization: {{token}}
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="image"; filename="city_245KB.jpg"
Content-Type: image/jpeg

< ../assets/city_245KB.jpg
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Ответ 400: Файл не передан**

**Ответ 400: Недопустимый формат файла**

**Ответ 413: Файл слишком большой**

**Ответ 200: Изображение загружено**

_Схема ответа_:

Модель UploadedFile
```js
{
  url: { type: "string", valid: true }
}
```

## Схемы ответов на коды 4**

### Ответы: 400, 401, 403, 404, 413

_Схема ответа_:

Модель ErrorReturn
```js
{
  error: { type: "string", valid: true }
}
```

### Ответы: 422

Ошибка в полях запроса

_Схема ответа_:

Модель ErrorsReturn
```js
{
  errors: { // содержит объект-словарь, с названиями ошибочных полей из запроса в качестве ключей
    type: "dict",
    valid: true,
    item: { type: ValueErrorReturn }
  }
}
```
Модель ValueErrorReturn
```js
{
  given: { type: "any", valid: true }, // переданное значение
  error: { type: "string", valid: true }, // сообщение об ошибке
}
```
