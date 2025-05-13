import { processMenu, processUser } from "./processing";

export function compareMenu(menu1, menu2) {
  if (!menu1 || !menu2) {
    return;
  }

  menu1 = processMenu(menu1);
  menu2 = processMenu(menu2);

  return JSON.stringify(menu1) === JSON.stringify(menu2);
}

export function compareUser(user1, user2) {
  if (!user1 || !user2) {
    return;
  }

  user1 = processUser(user1);
  user2 = processUser(user2);

  return JSON.stringify(user1) === JSON.stringify(user2);
}
