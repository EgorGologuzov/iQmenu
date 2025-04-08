import { configureStore } from '@reduxjs/toolkit'
import { pageReducer } from './slices/pageSlice'
import { userReducer } from './slices/userSlice'
import { favoriteReducer } from './slices/favoriteSlice'

export const APP_STORE = configureStore({
  reducer: {
    page: pageReducer,
    user: userReducer,
    favorite: favoriteReducer,
  }
})
