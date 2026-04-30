import { createSlice } from '@reduxjs/toolkit'

const FAVORITES_LIST_LOCAL_STORAGE_KEY = "favoriteSlice/favoritesList";

// const FAVORITES_LIST_RECORD_EXAMPLE = [
//   {
//     menuId: 0,
//     products: [1, 3],
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
        currentRecord.products.push(action.payload.productId);
      } 
      
      if (!currentRecord) {
        state.push({
          menuId: action.payload.menuId,
          products: [action.payload.productId],
        })
      }

      writeFavoritesToLocalStorage(state);
    },
    remove: (state, action) => {
      const currentRecord = state.find(record => record.menuId == action.payload.menuId);
      
      if (currentRecord) {
        const productIndex = currentRecord.products.indexOf(action.payload.productId);
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