import { MenuCreate } from '../../src/models/menuModels.js';
import { UserCreate } from '../../src/models/userModels.js';
import util from 'util';
import MENU_1 from './json/menu-1.json' with { type: "json" };

function printJson(obj) {
  console.log(util.inspect(obj, { colors: true, depth: 10 }));
}

function printMenu() {
  console.log(MENU_1);
}

function mapMenu() {
  const { model, errors, isValid } = MenuCreate.build(MENU_1);
  console.log("-----------------------------------------------------------------------------------------");
  printJson(model);
  console.log("-----------------------------------------------------------------------------------------");
  printJson(errors);
  console.log("-----------------------------------------------------------------------------------------");
  printJson(isValid);
  console.log("-----------------------------------------------------------------------------------------");
}

function mapUser() {
  const user = {
    "id": "680e1a8ab6ec307fbcfadbbf",
    "phone": "+70000000002",
    "email": "example@example.com",
    "name": "Пользователь 1",
    "isActive": true,
    "createAt": "2025-04-27T11:52:42.113Z",
    "apiAccessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBlMWE4YWI2ZWMzMDdmYmNmYWRiYmYiLCJpYXQiOjE3NDU3NTQ3NjJ9.CDj93utoo9VkSkVEYYB29ysZwqkoh_4mQY6E43nXrHA",
    "role": "owner"
  }
  const { model, errors, isValid } = UserCreate.build(user);
  console.log("-----------------------------------------------------------------------------------------");
  console.log(model);
  console.log("-----------------------------------------------------------------------------------------");
  console.log(errors);
  console.log("-----------------------------------------------------------------------------------------");
  console.log(isValid);
  console.log("-----------------------------------------------------------------------------------------");
}

// printMenu();
mapMenu();
// mapUser();
