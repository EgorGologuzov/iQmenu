import { logAndReturnError } from "../../utils/utils";

export const MEDIA_SERVICE = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await MEDIA_SERVICE.http.post('/media/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {

      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw logAndReturnError('Недопустимый формат файла или файл не передан')
          case 413:
            throw logAndReturnError('Файл слишком большой')
        }
      }

      throw logAndReturnError(`При отправке произошла ошибка: ${error.response.data?.error}`);
    }
  },
}
