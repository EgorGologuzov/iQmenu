# Эндпоинты API

Для настройки и запуска API смотри [api.md](api.md)

## Содержание

- [Пользователи](#пользователи)
  - [Авторизация](#авторизация)
  - [Регистрация](#регистрация)
  - [Обновление](#обновление)
- [Схемы ответов на коды 4**](#схемы-ответов-на-коды-4)
_Пример запроса_
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

### Обновление

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

Особенности:
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

Особенности:
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

## Схемы ответов на коды 4**

**Ответы: 400, 401, 403, 404**

_Схема ответа_:

Модель ErrorReturn
```js
{
  error: { type: "string", valid: true }
}
```

**Ответы: 422**

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
