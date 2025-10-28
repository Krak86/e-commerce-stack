import { Outlet, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import LanguageDetector from "@/utils/hooks";

const AuthLayout = () => {
  LanguageDetector();
  const { t } = useTranslation("");

  const location = useLocation();

  const env = import.meta.env;

  const isNew = location.pathname.includes("register");
  const isLogout = location.pathname.includes("logout");

  const footerText = `© ${new Date().getFullYear()} ${
    env.VITE_API_DOMAIN_COMMON
  }. ${t("allRightsReserved")}.`;

  const title = isLogout
    ? t("logout.title")
    : isNew
      ? t("register.title")
      : t("login.title");

  const subtitle = isNew ? t("register.subtitle") : t("login.subtitle");

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-balance text-white">
            {title}
          </h1>

          {!isLogout && (
            <p className="text-pretty text-slate-400">{subtitle}</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
          <Outlet />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">{footerText}</p>
      </div>
    </div>
  );
};

export default AuthLayout;
