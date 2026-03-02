import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants";

export const useAuth = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const updateUser = useAuthStore((state) => state.updateUser);
  const updateTokens = useAuthStore((state) => state.updateTokens);

  const logout = () => {
    clearAuth();
    navigate(APP_ROUTES.AUTH.LOGIN);
  };

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    isLoading,
    setAuth,
    clearAuth,
    setLoading,
    updateUser,
    updateTokens,
    logout,
  };
};
