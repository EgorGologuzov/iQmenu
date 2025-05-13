import { logAndReturnError } from '../../utils/utils';

export const USER_SERVICE = {

  async auth(authData) {
    try {
      const response = await USER_SERVICE.http.post('/user/auth', authData);
      return response.data;
    } catch (error) {

      if (error.response) {
        switch (error.response.status) {
          case 422:
            throw logAndReturnError('Ошибка в полях запроса')
          case 401:
            throw logAndReturnError('Неверный логин или пароль');
          case 403:
            throw logAndReturnError('Аккаунт не активен');
        }
      }

      throw logAndReturnError(`При отправке произошла ошибка: ${error.response.data?.error}`);
    }
  },

  async reg(regData) {
    try {
      const response = await USER_SERVICE.http.post('/user/reg', regData);
      return response.data;
    } catch (error) {

      if (error.response) {
        switch (error.response.status) {
          case 422:
            throw logAndReturnError('Ошибка в полях запроса')
          case 400:
            throw logAndReturnError('Пользователь с таким номером уже существует');
        }
      }

      throw logAndReturnError(`При отправке произошла ошибка: ${error.response.data?.error}`);
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

      if (error.response) {
        switch (error.response.status) {
          case 422:
            throw logAndReturnError('Ошибка в полях запроса')
          case 404:
            throw logAndReturnError('Пользователь, которому принадлежит токен, не найден в базе данных');
          case 400:
            throw logAndReturnError('Пользователь с таким номером уже существует');
        }
      }

      throw logAndReturnError(`При отправке произошла ошибка: ${error.response.data?.error}`);
    }
  },

  async refresh() {
    try {
      const response = await USER_SERVICE.http.get('/user/me');
      return response.data;
    } catch (error) {
      throw logAndReturnError(`При отправке произошла ошибка: ${error.response.data?.error}`);
    }
  },
}
