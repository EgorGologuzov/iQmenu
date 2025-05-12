
export function compareMenu(menu1, menu2) {
  if (!menu1 && !menu2) {
    return;
  }

  menu1 = { ...menu1 };
  menu2 = { ...menu2 };

  if (menu1.products) {
    menu1.products = menu1.products.map(product => ({ ...product, id: undefined }));
  }

  if (menu2.products) {
    menu2.products = menu2.products.map(product => ({ ...product, id: undefined }));
  }

  return JSON.stringify(menu1) === JSON.stringify(menu2);
}
