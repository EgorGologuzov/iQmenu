import { MEDIA_SERVICE, MENU_SERVICE, USER_SERVICE } from "../data/data"

function useIQmenuApi() {

  const services = {
    menu: MENU_SERVICE,
    user: USER_SERVICE,
    media: MEDIA_SERVICE,
  }

  return services;
}

export default useIQmenuApi