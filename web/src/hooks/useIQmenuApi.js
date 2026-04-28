import { MENU_SERVICE as FAKE_MENU_SERVICE } from "../data/static/menu"
import { USER_SERVICE as FAKE_USER_SERVICE } from "../data/static/user"
import { MEDIA_SERVICE as FAKE_MEDIA_SERVICE } from "../data/static/media"
import { MENU_SERVICE as REAL_MENU_SERVICE } from "../data/api/menu"
import { USER_SERVICE as REAL_USER_SERVICE } from "../data/api/user"
import { MEDIA_SERVICE as REAL_MEDIA_SERVICE } from "../data/api/media"
import { useSelector } from "react-redux"
import { useMemo } from "react"
import axios from "axios"


function useIQmenuApi() {

  const apiAccessToken = useSelector(state => state.user.apiAccessToken);

  return useMemo(() => {

    const services = {}

    if (process.env.REACT_APP_USE_LOCAL_DATA_SOURCE === "true") {
      services.menu = FAKE_MENU_SERVICE;
      services.user = FAKE_USER_SERVICE;
      services.media = FAKE_MEDIA_SERVICE;
    } else {
      services.menu = REAL_MENU_SERVICE;
      services.user = REAL_USER_SERVICE;
      services.media = REAL_MEDIA_SERVICE;
    }

    const http = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiAccessToken ? `Bearer ${apiAccessToken}` : '',
      }
    });

    const prepareService = service => {
      service.services = services;
      service.http = http;
    }

    prepareService(services.menu);
    prepareService(services.user);
    prepareService(services.media);

    return services;
  }, [apiAccessToken]);
}

export default useIQmenuApi