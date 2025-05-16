import { sleep } from "../../utils/utils"
import { OWNER_USER_DATA_FOR_TEST } from "../../values/roles";
import { deepCopy } from "../../utils/utils";

const OWNER_TEST_CREDENTIALS = [
  {
    phone: "+7 (000) 00-00-00",
    password: "12345678",
  },
  {
    phone: "+7 (999) 99-99-99",
    password: "12345678",
  },
]

export const USER_SERVICE = {

  async auth(authData) {
    await sleep(1000);

    if (OWNER_TEST_CREDENTIALS.find((owner)=>owner.phone===authData.phone && owner.password === authData.password)) {
      return OWNER_USER_DATA_FOR_TEST;
    }
      
    throw new Error("Тестовая ошибка: неверный логин или пароль")
  },

  async reg(regData){
    await sleep(1000);

    if (!OWNER_TEST_CREDENTIALS.find((owner)=>owner.phone===regData.phone)){
      // {код вставки пользователя в бд}
      // ниже будем возвращать нового зареганого пользователя(пока будет фейковый)
      return OWNER_USER_DATA_FOR_TEST;
    }

    throw new Error("Тестовая ошибка: пользователь с таким телефоном уже существует")
  },
  async update(userData){
    await sleep(1000);
      const data=deepCopy(OWNER_USER_DATA_FOR_TEST)
      data.avatar=userData.avatar;
      data.email=userData.email;
      data.name=userData.name;
      
      return data;
  },
}