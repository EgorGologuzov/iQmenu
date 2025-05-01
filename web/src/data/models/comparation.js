
export function compareMenu(menu1, menu2) {
  if (!menu1 && !menu2) {
    return;
  }

  return JSON.stringify(menu1) === JSON.stringify(menu2);
}
