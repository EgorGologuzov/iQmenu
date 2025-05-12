import { MENU_SERVICE as FAKE_MENU_SERVICE } from "../data/static/menu"
import { USER_SERVICE as FAKE_USER_SERVICE } from "../data/static/user"
import { MEDIA_SERVICE as FAKE_MEDIA_SERVICE } from "../data/static/media"
import { MENU_SERVICE as REAL_MENU_SERVICE } from "../data/api/menu"
import { USER_SERVICE as REAL_USER_SERVICE } from "../data/api/user"
import { MEDIA_SERVICE as REAL_MEDIA_SERVICE } from "../data/api/media"
import { useSelector } from "react-redux"
import { useMemo } from "react"
import { API_BASE_URL } from "../values/urls"
import axios from "axios"


function useIQmenuApi() {

  const apiAccessToken = useSelector(state => state.user.apiAccessToken);

  return useMemo(() => {
    const menuService = REAL_MENU_SERVICE;
    const userService = REAL_USER_SERVICE;
    const mediaService = REAL_MEDIA_SERVICE;

    const services = {
      menu: menuService,
      user: userService,
      media: mediaService,
    }

    const http = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiAccessToken ? `Bearer ${apiAccessToken}` : '',
      }
    });

    const prepareService = service => {
      service.services = services;
      service.http = http;
    }

    prepareService(menuService);
    prepareService(userService);
    prepareService(mediaService);

    return services;
  }, [apiAccessToken]);
}

export default useIQmenuApi