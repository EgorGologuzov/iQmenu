import { createSlice } from '@reduxjs/toolkit'
import { ROLES } from '../../values/roles';

const USER_DATA_LOCAL_STORAGE_KEY = "userSlice/user";

const DEFAULT_GUEST_DATA = {
  role: ROLES.GUEST.NAME,
  apiAccessToken: undefined,
  id: undefined,
  phone: undefined,
  email: undefined,
  name: undefined,
  avatar: undefined, 
}

const readUserFromLocalStorage = () => {
  const user = localStorage.getItem(USER_DATA_LOCAL_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
}

const writeUserToLocalStorage = (user) => {
  localStorage.setItem(USER_DATA_LOCAL_STORAGE_KEY, JSON.stringify(user));
}

const removeUserFromLocalStorage = () => {
  localStorage.removeItem(USER_DATA_LOCAL_STORAGE_KEY);
}

const USER_DATA_FROM_LOCAL_STORAGE = readUserFromLocalStorage();

const userSlice = createSlice({
  name: "user",
  initialState: USER_DATA_FROM_LOCAL_STORAGE ?? DEFAULT_GUEST_DATA,
  reducers: {
    setUserData: (state, action) => {
      writeUserToLocalStorage(action.payload);
      return action.payload;
    },
    clearUserData: (state, action) => {
      removeUserFromLocalStorage();
      return DEFAULT_GUEST_DATA;
    },
  }
})

export const { setUserData, clearUserData } = userSlice.actions;
export const userReducer = userSlice.reducer;