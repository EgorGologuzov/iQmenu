export const ROLES = Object.freeze({
  GUEST: Object.freeze({
    NAME: 'guest'
  }),
  OWNER: Object.freeze({
    NAME: 'owner'
  }),
})

const GUEST_USER_DATA_FOR_TEST = {
  role: ROLES.GUEST.NAME,
  apiAccessToken: undefined,
  id: undefined,
  phone: undefined,
  email: undefined,
  name: undefined,
  avatar: undefined, 
}

const OWNER_USER_DATA_FOR_TEST = {
  role: ROLES.OWNER.NAME,
  apiAccessToken: "bearer_token",
  id: "uuid-uuid-uuid-uuid-uuid",
  phone: "+79934568712",
  email: "owner@test.com",
  name: "Иванов Иван",
  avatar: "https://sotni.ru/wp-content/uploads/2023/08/genri-kavill-1.webp", 
}

export const CURRENT_USER_DATA_FOR_TEST = OWNER_USER_DATA_FOR_TEST;