import { createSlice } from '@reduxjs/toolkit'

const ORDER_LIST_LOCAL_STORAGE_KEY = "orderSlice/ordersList";
const ORDER_LIFE_TIME_MILLIS = 3 * 3600 * 1000;

// const ORDERS_LIST_EXAMPLE = [{
//   menuId: 0,
//   tableNum: "F05",
//   sendTime: "2025-01-01T00:00:00.000Z",
//   products: [{
//     productId: 0,
//     amount: 1
//   }]
// }]

// LOCAL_STORAGE_LIMIT_KB = 5000

const readOrderListFromLocalStorage = () => {
  const ordersList = localStorage.getItem(ORDER_LIST_LOCAL_STORAGE_KEY);
  return ordersList ? JSON.parse(ordersList) : null;
}

const writeOrderListToLocalStorage = (orderList) => {
  localStorage.setItem(ORDER_LIST_LOCAL_STORAGE_KEY, JSON.stringify(orderList));
}

const actualizeAndGetOrdersList = () => {
	const savedOrders = readOrderListFromLocalStorage();
	const actualOrders = savedOrders
		? savedOrders.filter(order => (new Date() - new Date(order.sendTime)) <= ORDER_LIFE_TIME_MILLIS)
		: null;
	writeOrderListToLocalStorage(actualOrders);
	return actualOrders;
}

const ORDER_LIST_FROM_LOCAL_STORAGE = actualizeAndGetOrdersList();

const orderSlice = createSlice({
  name: "orders",
  initialState: ORDER_LIST_FROM_LOCAL_STORAGE ?? [],
  reducers: {
    saveOrder: (state, action) => {
			const currentOrder = state.find(order => order.menuId == action.payload.menuId);
			if (currentOrder) {
				state.splice(state.indexOf(currentOrder), 1);
			}

			state.push({ ...action.payload });
      writeOrderListToLocalStorage(state);
    },
		removeOrder: (state, action) => {
			const currentOrder = state.find(order => order.menuId == action.payload.menuId);
			if (currentOrder) {
				state.splice(state.indexOf(currentOrder), 1);
			}
      writeOrderListToLocalStorage(state);
    },
  }
})

export const { saveOrder, removeOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;