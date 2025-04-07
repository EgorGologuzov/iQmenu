import MENU_1 from "./json/menu-1.json"
import { sleep } from "../../utils/utils";


export const MENU_SERVICE = {
  async getById(id) {
    await sleep(1000);

    if (id < 1) {
      throw new Error("Тестовая ошибка: id < 1");
    }

    if (id == 1) {
      return MENU_1;
    }

    return null;
  },
  async create(menuData){},
  async update(id, menuData){},
  async delete(id){},
}
