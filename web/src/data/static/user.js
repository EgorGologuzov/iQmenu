import { sleep } from "../../utils/utils"
import { OWNER_USER_DATA_FOR_TEST } from "../../values/roles";

const OWNER_TEST_CREDENTIALS = [
  {
  phone: "+7(000)00-00-00",
  password: "12345678",
  },
  {
    phone: "+7(999)99-99-99",
    password: "1234",
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

    return regData;
  },
  async update(userData){},
}
