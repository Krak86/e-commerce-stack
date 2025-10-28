import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import AuthLayout from "@/components/layouts/AuthLayout";
import Login from "@/components/features/Login";
import Register from "@/components/features/Register";
import Logout from "@/components/features/Logout";
import { langsRoutes, routes } from "@/utils/static/routes";
import "@/i18n";
import "@/css/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <Navigate
              to={`/${langsRoutes.default}/${routes.default}`}
              replace
            />
          }
        />

        <Route element={<AuthLayout />}>
          <Route path={`/:lang/${routes.login}`} element={<Login />} />

          <Route path={`/:lang/${routes.register}`} element={<Register />} />

          <Route path={`/:lang/${routes.logout}`} element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
