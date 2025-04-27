# Эндпоинты API

Для настройки и запуска API смотри [api.md](api.md)

## Пользователи

### Авторизация

Авторизация владельца.

Путь: `/api/user/auth`

Авторизация: `нет`

Схема запроса (модель Auth):
```js
{
  phone: { type: "string", required: true, clear: /[^\d+]/g, regExp: /^\+\d{10,15}$/ },
  password: { type: "string", required: true, minLength: 8, maxLength: 100 },
}
```

Пример запроса:
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

Схема ответа (модель UserReturn):
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

Путь: `/api/user/reg`

Авторизация: `нет`

Схема запроса (модель UserCreate):
```js
{
  phone: { type: "string", required: true, clear: /[^\d+]/g, regExp: /^\+\d{10,15}$/ },
  email: { type: "string", required: true, trim: true, regExp: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ },
  name: { type: "string", required: true, trim: true, minLength: 2, maxLength: 50 },
  avatar: { type: "string", required: false, maxLength: 255 },
  password: { type: "string", required: true, minLength: 8, maxLength: 100 },
}
```

Пример запроса:
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

Схема ответа (модель UserReturn):
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

Путь: `/api/user/update`

Авторизация: `есть`

Схема запроса (модель UserUpdate):
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

Пример запроса:
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

**Ответ 400: Пользователь, которому принадлежит токен не найден в БД**

**Ответ 400: Не уникальный номер телефона**

**Ответ 200: Авторизация прошла успешно**

Схема ответа (модель UserReturn):
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

Схема ответа (модель ErrorReturn):
```js
{
  error: { type: "string", valid: true }
}
```

**Ответы: 422**

Ошибка в полях запроса

Схема ответа (модель ErrorsReturn):
```js
{
  errors: { // содержит объект, с названиями ошибочных полей из запроса в качестве ключей
    type: "dict",
    schema: { // каждый ключ ошибочного поля содержит информацию об ошибке в виде такой схемы
      given: { type: "any", valid: true },    // переданное значение
      error: { type: "string", valid: true }, // сообщение о проблеме
    }
  }
}
```
