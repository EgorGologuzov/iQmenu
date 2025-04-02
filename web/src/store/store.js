import { configureStore } from '@reduxjs/toolkit'
import { pageReducer } from './slices/pageSlice'
import { setUserData, userReducer } from './slices/userSlice'
import { CURRENT_USER_DATA_FOR_TEST } from '../values/roles'

export const APP_STORE = configureStore({
  reducer: {
    page: pageReducer,
    user: userReducer,
  }
})

// Для тестирования
APP_STORE.dispatch(setUserData(CURRENT_USER_DATA_FOR_TEST));