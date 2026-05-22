import { handleHttpError } from "../../utils/http";

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
      throw handleHttpError(error, {
        400: "Недопустимый формат файла или файл не передан",
        413: "Файл слишком большой",
      })
    }
  },
}
