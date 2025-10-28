import { useTranslation } from "react-i18next";

import type { ErrorResponse, LoginResponse } from "@/utils/types";

const useAuthActions = () => {
  const { t } = useTranslation();

  const env = import.meta.env;

  const apiBaseUrl = env.VITE_API_BE_API_URL;

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
        // cache: "force-cache",
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          isError: true,
          message: errorData?.message || t("error.loginFailed"),
        };
      }

      const data = await response.json();

      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          isError: true,
          message: error.message || t("error.loginFailed"),
        };
      }

      return { isError: true, message: t("error.loginFailed") };
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
        // cache: "force-cache",
      });
      if (!response.ok) {
        const errorData = await response.json();
        return {
          isError: true,
          message: errorData?.message || t("error.registerFailed"),
        };
      }
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          isError: true,
          message: error.message || t("error.registerFailed"),
        };
      }
      return { isError: true, message: t("error.registerFailed") };
    }
  };

  const handleLogout = async (): Promise<
    Record<string, string> | ErrorResponse
  > => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
        // cache: "no-store",
      });
      if (!response.ok) {
        const errorData = await response.json();
        return {
          isError: true,
          message: errorData?.message || t("error.logoutFailed"),
        };
      }
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          isError: true,
          message: error.message || t("error.logoutFailed"),
        };
      }
      return { isError: true, message: t("error.logoutFailed") };
    }
  };

  const handleRedirect = () => {
    window.location.href = `${env.VITE_API_BE_API_URL}`;
  };

  return { handleLogin, handleRegister, handleLogout, handleRedirect };
};

export default useAuthActions;
