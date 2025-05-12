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

      throw logAndReturnError('При отправке запроса что-то пошло не так');
    }
  },

  async reg(regData) {

  },

  async update(userData) {

  },

  async refresh() {

  },
}
