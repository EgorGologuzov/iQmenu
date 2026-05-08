import { logAndReturnError } from '../../utils/utils';

export const ORDER_SERVICE = {
  
	async post(orderData) {
		try {
      const response = await ORDER_SERVICE.http.post('/order', orderData);
      return response.data;
    } catch (error) {
      throw logAndReturnError(`При отправке произошла ошибка: ${error.response.data?.error}`);
    }
	},

	async cancel(orderAccessKey) {
		try {
      const response = await ORDER_SERVICE.http.patch(`/order/${orderAccessKey}/cancel`);
      return response.data;
    } catch (error) {
      throw logAndReturnError(`При отправке произошла ошибка: ${error.response.data?.error}`);
    }
	},

}