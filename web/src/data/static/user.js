import { sleep } from "../../utils/utils"
import { OWNER_USER_DATA_FOR_TEST } from "../../values/roles";

const OWNER_TEST_CREDENTIALS = {
  phone: "+7(000)00-00-00",
  password: "12345678",
}

export const USER_SERVICE = {

  async auth(authData) {
    await sleep(1000);

    if (authData.phone == OWNER_TEST_CREDENTIALS.phone && authData.password == OWNER_TEST_CREDENTIALS.password) {
      return OWNER_USER_DATA_FOR_TEST;
    }
      
    throw new Error("Тестовая ошибка: неверный логин или пароль")
  },

  async reg(regData){},
  async update(userData){},
}
