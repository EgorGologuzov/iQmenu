import { useDispatch, useSelector } from "react-redux";
import useIQmenuApi from "./useIQmenuApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { clearUserData, setUserData } from "../store/slices/userSlice";
import { ROLES } from "../values/roles";

export function useUserRefresh() {
  const api = useIQmenuApi();
  const dispatch = useDispatch();
  const userRole = useSelector(state => state.user?.role);

  let queryFn;
  if (userRole !== ROLES.GUEST.NAME) {
    queryFn = () => api.user.refresh();
  } else {
    queryFn = () => null;
  }

  const { data: refreshedUser, error } = useQuery({
    queryKey: ["api.user.refresh"],
    queryFn: queryFn,
    refetchOnWindowFocus: false,
    retry: false,
  })

  useEffect(() => {
    if (refreshedUser) {
      dispatch(setUserData(refreshedUser));
    }
  }, [refreshedUser])

  useEffect(() => {
    if (error) {
      dispatch(clearUserData());
    }
  }, [error])
}
