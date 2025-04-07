import MENU_1 from "./json/menu-1.json"


export const MENU_SERVICE = {
  getById(id) {
    return id == 1 ? MENU_1 : null;
  },
  create(menuData){},
  update(id, menuData){},
  delete(id){},
}
