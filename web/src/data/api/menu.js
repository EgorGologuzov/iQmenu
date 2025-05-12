import { logAndReturnError } from '../../utils/utils';

export const MENU_SERVICE = {

  async getById(id) {
    try {
      const response = await MENU_SERVICE.http.get(`/menu/${id}`);
      return response.data;
    } catch (error) {

      if (error.response) {
        switch (error.response.status) {
          case 404:
            throw logAndReturnError('Меню не найдено')
        }
      }

      throw logAndReturnError('При отправке запроса что-то пошло не так');
    }
  },

  async create(menuData) {

    const uploadImage = MENU_SERVICE.services.media.uploadImage;
    menuData = { ...menuData, products: menuData.products.map(product => ({ ...product })) };

    try {

      if (!menuData.image) {
        menuData.image = null;
      }

      if (menuData.image instanceof File) {
        menuData.image = (await uploadImage(menuData.image)).url;
      }

      const productsWithFileImages = menuData.products.filter(product => product.image instanceof File);
      await Promise.all(productsWithFileImages.map(async (product) => product.image = (await uploadImage(product.image)).url));

    } catch (error) {
      throw error;
    }

    try {
      const response = await MENU_SERVICE.http.post(`/menu`, menuData);
      return response.data;
    } catch (error) {

      if (error.response) {
        switch (error.response.status) {
          case 422:
            throw logAndReturnError('Ошибка в полях запроса')
        }
      }

      throw logAndReturnError('При отправке запроса что-то пошло не так');
    }
  },

  async update(id, menuData) {

    const uploadImage = MENU_SERVICE.services.media.uploadImage;
    menuData = { ...menuData, products: menuData.products.map(product => ({ ...product })) };

    try {

      if (!menuData.image) {
        menuData.image = null;
      }

      if (menuData.image instanceof File) {
        menuData.image = (await uploadImage(menuData.image)).url;
      }

      const productsWithFileImages = menuData.products.filter(product => product.image instanceof File);
      await Promise.all(productsWithFileImages.map(async (product) => product.image = (await uploadImage(product.image)).url));
      
    } catch (error) {
      throw error;
    }

    try {
      const response = await MENU_SERVICE.http.put(`/menu/${id}`, menuData);
      return response.data;
    } catch (error) {

      if (error.response) {
        switch (error.response.status) {
          case 422:
            throw logAndReturnError('Ошибка в полях запроса')
          case 404:
            throw logAndReturnError('Меню не найдено')
          case 403:
            throw logAndReturnError('Это меню принадлежит другому пользователю')
        }
      }

      throw logAndReturnError('При отправке запроса что-то пошло не так');
    }
  },

  async delete(id) {
    try {
      const response = await MENU_SERVICE.http.delete(`/menu/${id}`);
      return response.data;
    } catch (error) {

      if (error.response) {
        switch (error.response.status) {
          case 422:
            throw logAndReturnError('Ошибка в полях запроса')
          case 404:
            throw logAndReturnError('Меню не найдено')
          case 403:
            throw logAndReturnError('Это меню принадлежит другому пользователю')
        }
      }

      throw logAndReturnError('При отправке запроса что-то пошло не так');
    }
  },

  async getUsersMenus() {
    try {
      const response = await MENU_SERVICE.http.get("/menu/my");
      return response.data.menus;
    } catch (error) {
      throw logAndReturnError('При отправке запроса что-то пошло не так');
    }
  },
}
