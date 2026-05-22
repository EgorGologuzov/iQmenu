import { handleHttpError } from '../../utils/http';

export const MENU_SERVICE = {

  async getById(id) {
    try {
      const response = await MENU_SERVICE.http.get(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw handleHttpError(error, {
        403: "Меню снято с публикации",
        404: "Меню не найдено",
      })
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
      throw handleHttpError(error, {
        422: "Ошибка в полях запроса",
      })
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
      throw handleHttpError(error, {
        403: "Это меню принадлежит другому пользователю",
        404: "Меню не найдено",
        422: "Ошибка в полях запроса",
      })
    }
  },

  async delete(id) {
    try {
      const response = await MENU_SERVICE.http.delete(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw handleHttpError(error, {
        403: "Это меню принадлежит другому пользователю",
        404: "Меню не найдено",
      })
    }
  },

  async getUsersMenus() {
    try {
      const response = await MENU_SERVICE.http.get("/menu/my");
      return response.data.menus;
    } catch (error) {
      throw handleHttpError(error);
    }
  },
}
