import { createSlice } from '@reduxjs/toolkit'

const CART_LIST_LOCAL_STORAGE_KEY = "cartSlice/cartList";

// const CART_LIST_RECORD_EXAMPLE = [
//   {
//     menuId: 0,
//     productId: 0,
//     amount: 1
//   }
// ]

// LOCAL_STORAGE_LIMIT_KB = 5000

const readCartFromLocalStorage = () => {
  const cartList = localStorage.getItem(CART_LIST_LOCAL_STORAGE_KEY);
  return cartList ? JSON.parse(cartList) : null;
}

const writeCartToLocalStorage = (cartList) => {
  localStorage.setItem(CART_LIST_LOCAL_STORAGE_KEY, JSON.stringify(cartList));
}

const CART_LIST_FROM_LOCAL_STORAGE = readCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState: CART_LIST_FROM_LOCAL_STORAGE ?? [],
  reducers: {
    add: (state, action) => {
      const currentRecord = state.find(record => 
        record.menuId == action.payload.menuId && record.productId == action.payload.productId
    	);
      
      if (currentRecord) {
        currentRecord.amount++;
      } 
      
      if (!currentRecord) {
        state.push({
          menuId: action.payload.menuId,
					productId: action.payload.productId,
          amount: 1,
        })
      }

      writeCartToLocalStorage(state);
    },
    remove: (state, action) => {
      const currentRecord = state.find(record => 
        record.menuId == action.payload.menuId && record.productId == action.payload.productId
    	);
      
      if (currentRecord) {
        if (currentRecord.amount <= 1) {
					const currentRecordIndex = state.indexOf(currentRecord);
					state.splice(currentRecordIndex, 1)
				} else {
					currentRecord.amount--;
				}
      }

      writeCartToLocalStorage(state);
    },
  }
})

export const { add, remove } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;