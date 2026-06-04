import { handleHttpError } from '../../utils/http';

export const ORDER_SERVICE = {
  
	async post(orderData) {
		try {
      const response = await ORDER_SERVICE.http.post('/order', orderData);
      return response.data;
    } catch (error) {
      throw handleHttpError(error);
    }
	},

	async cancel(orderAccessKey, params) {
		try {
      const response = await ORDER_SERVICE.http.patch(`/order/${orderAccessKey}/cancel`, undefined, { params });
      return response.data;
    } catch (error) {
      throw handleHttpError(error);
    }
	},

  async getOrders(params) {
    try {
      const response = await ORDER_SERVICE.http.get('/order', { params });
      return response.data;
    } catch (error) {
      throw handleHttpError(error);
    }
  },

  async updateOrdersStatusByIds(query) {
    try {
      const response = await ORDER_SERVICE.http.patch('/order/update/status/by/ids', query);
      return response.data;
    } catch (error) {
      throw handleHttpError(error);
    }
  },

  async updateOrdersStatusByFilters(query) {
    try {
      const response = await ORDER_SERVICE.http.patch('/order/update/status/by/filters', query);
      return response.data;
    } catch (error) {
      throw handleHttpError(error);
    }
  },

}