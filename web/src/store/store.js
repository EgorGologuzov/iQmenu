import { configureStore } from '@reduxjs/toolkit'
import pageReducer from './pageSlice'

export const APP_STORE = configureStore({
  reducer: {
    page: pageReducer,
  }
})