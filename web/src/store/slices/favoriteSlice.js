import { createSlice } from '@reduxjs/toolkit'

const FAVORITES_LIST_LOCAL_STORAGE_KEY = "favoriteSlice/favoritesList";

// const FAVORITES_LIST_RECORD_EXAMPLE = [
//   {
//     menuId: 0,
//     products: ["Product name 1", "Product name 2"],
//   }
// ]

// LOCAL_STORAGE_LIMIT_KB = 5000

const readFavoritesFromLocalStorage = () => {
  const favoritesList = localStorage.getItem(FAVORITES_LIST_LOCAL_STORAGE_KEY);
  return favoritesList ? JSON.parse(favoritesList) : null;
}

const writeFavoritesToLocalStorage = (favoritesList) => {
  localStorage.setItem(FAVORITES_LIST_LOCAL_STORAGE_KEY, JSON.stringify(favoritesList));
}

const FAVORITES_LIST_FROM_LOCAL_STORAGE = readFavoritesFromLocalStorage();

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: FAVORITES_LIST_FROM_LOCAL_STORAGE ?? [],
  reducers: {
    add: (state, action) => {
      const currentRecord = state.find(record => record.menuId == action.payload.menuId);
      
      if (currentRecord) {
        currentRecord.products.push(action.payload.productName);
      } 
      
      if (!currentRecord) {
        state.push({
          menuId: action.payload.menuId,
          products: [action.payload.productName],
        })
      }

      writeFavoritesToLocalStorage(state);
    },
    remove: (state, action) => {
      const currentRecord = state.find(record => record.menuId == action.payload.menuId);
      
      if (currentRecord) {
        const productIndex = currentRecord.products.indexOf(action.payload.productName);
        if (productIndex != -1) {
          currentRecord.products.splice(productIndex, 1);
          if (!currentRecord.products.length) {
            const currentRecordIndex = state.indexOf(currentRecord);
            state.splice(currentRecordIndex, 1)
          }
        }
      }

      writeFavoritesToLocalStorage(state);
    },
  }
})

export const { add, remove } = favoriteSlice.actions;
export const favoriteReducer = favoriteSlice.reducer;