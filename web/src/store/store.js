import { configureStore } from '@reduxjs/toolkit'
import { pageReducer } from './slices/pageSlice'
import { userReducer } from './slices/userSlice'
import { favoriteReducer } from './slices/favoriteSlice'
import { cartReducer } from './slices/cartSlice'
import { orderReducer } from './slices/orderSlice'

export const APP_STORE = configureStore({
  reducer: {
    page: pageReducer,
    user: userReducer,
    favorite: favoriteReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
