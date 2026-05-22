import { handleHttpError } from '../../utils/http';

export const USER_SERVICE = {

  async auth(authData) {
    try {
      const response = await USER_SERVICE.http.post('/user/auth', authData);
      return response.data;
    } catch (error) {
      throw handleHttpError(error, {
        401: "Неверный логин или пароль",
        403: "Аккаунт не активен",
        422: "Номер телефона или пароль имеют неверный формат",
      })
    }
  },

  async reg(regData) {
    try {
      const response = await USER_SERVICE.http.post('/user/reg', regData);
      return response.data;
    } catch (error) {
      throw handleHttpError(error, {
        400: "Пользователь с таким номером уже существует",
        422: "Некоторые поля имеют неверный формат",
      })
    }
  },

  async update(userData) {

    const uploadImage = USER_SERVICE.services.media.uploadImage;
    userData = { ...userData };

    try {
      if (!userData.avatar) {
        userData.avatar = null;
      }
      if (userData.avatar instanceof File) {
        userData.avatar = (await uploadImage(userData.avatar)).url;
      }
    } catch (error) {
      throw error;
    }

    try {
      const response = await USER_SERVICE.http.put('/user/update', userData);
      return response.data;
    } catch (error) {
      throw handleHttpError(error, {
        400: "Пользователь с таким номером уже существует",
        404: "Пользователь, которому принадлежит токен, не найден в базе данных",
        422: "Некоторые поля имеют неверный формат",
      })
    }
  },

  async refresh() {
    try {
      const response = await USER_SERVICE.http.get('/user/me');
      return response.data;
    } catch (error) {
      throw handleHttpError(error, {
        404: "Пользователь, которому принадлежит токен, не найден в базе данных",
      })
    }
  },
}
