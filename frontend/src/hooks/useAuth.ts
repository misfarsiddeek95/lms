import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/slices/auth.slice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  return {
    user,
    token,
    isAuthenticated: !!token,
    logout: () => dispatch(logout()),
  };
}
