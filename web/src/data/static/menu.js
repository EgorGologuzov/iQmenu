import MENU_1 from "./json/menu-1.json"
import MENU_2 from "./json/menu-2.json"
import MENU_3 from "./json/menu-3.json"
import { deepCopy, logAndReturnError, sleep } from "../../utils/utils";

const MENUS = [MENU_1, MENU_2, MENU_3];
let idCount = 10;

export const MENU_SERVICE = {

  async getById(id) {
    await sleep(1000);
    console.log("/data/static/menu/getById", { id: id });

    if (id < 1) {
      throw logAndReturnError("Тестовая ошибка: id < 1");
    }

    return MENUS.find(menu => menu.id == id) ?? null;
  },

  async create(menuData) {
    await sleep(1000);
    console.log("/data/static/menu/create", menuData);

    if (menuData.categories && menuData.categories.length > 7) {
      throw logAndReturnError("Тестовая ошибка: категорий не может быть больше 7");
    }

    const newMenu = deepCopy(menuData);
    newMenu.id = idCount++;
    newMenu.qr = "https://assets.turbologo.ru/blog/ru/2020/01/18163037/qr-kod.png";
    MENUS.push(newMenu)

    return newMenu;
  },

  async update(id, menuData) {
    await sleep(1000);
    console.log("/data/static/menu/update", { id: id, menu: menuData });

    const current = MENUS.find(menu => menu.id == id);

    if (current < 0) {
      throw logAndReturnError("Тестовая ошибка: меню с таким id не найдено");
    }

    if (menuData.categories && menuData.categories.length > 7) {
      throw logAndReturnError("Тестовая ошибка: категорий не может быть больше 7");
    }

    const index = MENUS.indexOf(current);

    MENUS[index] = deepCopy(menuData);

    return MENUS[index];
  },

  async delete(id) {
    await sleep(1000);
    console.log("/data/static/menu/delte", { id: id });

    if (id == 2) {
      throw logAndReturnError("Тестовая ошибка: меню с id = 2 нельзя удалить");
    }

    const current = MENUS.find(menu => menu.id == id);

    if (current < 0) {
      throw logAndReturnError("Тестовая ошибка: меню с таким id не найдено");
    }

    const index = MENUS.indexOf(current);

    MENUS.splice(index, 1);

    return current;
  },
  
  async getUsersMenus(userId){
    await sleep(1000);

    return menus
  },
}
