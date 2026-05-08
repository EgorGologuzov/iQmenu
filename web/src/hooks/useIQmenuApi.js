import { useSelector } from "react-redux"
import { useMemo } from "react"
import axios from "axios"
import { getServices } from "../data/data";


function useIQmenuApi() {

  const apiAccessToken = useSelector(state => state.user.apiAccessToken);

  return useMemo(() => {

    const http = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiAccessToken ? `Bearer ${apiAccessToken}` : '',
      }
    });

    return getServices(http);
  }, [apiAccessToken]);
}

export default useIQmenuApi