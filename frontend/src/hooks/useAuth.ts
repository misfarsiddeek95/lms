import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/slices/auth.slice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    token,
    isAuthenticated: !!token, // true if token exists, false if null
    isLoading, // Loading state
    error, // Error state
    logout: () => dispatch(logout()),
  };
}
