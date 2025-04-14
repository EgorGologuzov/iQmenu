import { ROLES } from './roles';

export const GUEST_DATA_DEFAULT = Object.freeze({
  role: ROLES.GUEST.NAME,
  apiAccessToken: undefined,
  id: undefined,
  phone: undefined,
  email: undefined,
  name: undefined,
  avatar: undefined, 
})

export const MENU_FILTERS_DEFAULT = Object.freeze({
  favoritesOnly: false,
  isActiveOnly: false,
  categories: [],
})

export const MENU_CREATE_TEMPLATE = Object.freeze({
  isActive: true,
  products: [],
  companyName: undefined,
  menuName: undefined,
  categories: ["Основные", "Десерты", "Напитки"],
  image: undefined,
})

export const PRODUCT_CREATE_TEMPLATE = Object.freeze({
  name: '',
  price: '',
  isActive: true,
  categories: [],
  weight: '',
  description: '',
  composition: '',
  image: '',
})
