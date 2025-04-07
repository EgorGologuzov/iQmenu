import { MENU_SERVICE, USER_SERVICE } from "../data/data"

function useIQmenuApi() {

  const services = {
    menu: MENU_SERVICE,
    user: USER_SERVICE,
  }

  return services;
}

export default useIQmenuApi