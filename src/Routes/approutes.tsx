import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/mainlayout";
import AuthLayout from "../layouts/authlayout";
import DashboardLayout from "../layouts/dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../Pages/home";
import Login from "../Pages/login";
import Register from "../Pages/register";
import ForgotPassword from "../Pages/forgotpassord";
import ForgotPasswordVerify from "../Pages/forgotpassword/ForgotPasswordVerify";
import Dashboard from "../Pages/dashboard";
import Profile from "../Pages/profile";
import RepairPage from "../Pages/repair";
import RecyclingPage from "../Pages/recyling";
import RegisterDevice from "../Pages/devices/RegisterDevice";
import ScanDiagnose from "../Pages/devices/ScanDiagnose";
import Passport from "../Pages/passport";
import NotFound from "../Pages/notfound";
import { ROUTES } from "../utils/constants";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.home} element={<Home />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<Login />} />
          <Route path={ROUTES.register} element={<Register />} />
          <Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
          <Route path={ROUTES.forgotPasswordVerify} element={<ForgotPasswordVerify />} />
        </Route>

        <Route path={`${ROUTES.passport}/:productId`} element={<Passport />} />

        <Route
          path={ROUTES.dashboard}
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="devices/register" element={<RegisterDevice />} />
          <Route path="scan" element={<ScanDiagnose />} />
          <Route path="repairs" element={<RepairPage />} />
          <Route path="recycling" element={<RecyclingPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
