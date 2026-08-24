import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import NotFoundPage from "../pages/NotFoundPage";
import ScrollToTop from "../components/ScrollToTop";

import CustomerLayout from "../layouts/Customer/CustomerLayout";
import AdminLayout from "../layouts/Admin/AdminLayout";
import AuthLayout from "../layouts/Auth/AuthLayout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import GuestRoute from "./GuestRoute";

// Customer pages

const HomePage = lazy(() => import("../pages/customer/HomePage"));

const MenuPage = lazy(() => import("../pages/customer/MenuPage"));

const ProductDetailPage = lazy(
  () => import("../pages/customer/ProductDetailPage"),
);

const CartPage = lazy(() => import("../pages/customer/CartPage"));

const CheckoutPage = lazy(() => import("../pages/customer/CheckoutPage"));

const OrderConfirmationPage = lazy(
  () => import("../pages/customer/OrderConfirmationPage"),
);

const MyOrdersPage = lazy(() => import("../pages/customer/MyOrdersPage"));

const OrderDetailPage = lazy(() => import("../pages/customer/OrderDetailPage"));

const ProfilePage = lazy(() => import("../pages/customer/ProfilePage"));

const AboutPage = lazy(() => import("../pages/customer/AboutPage"));
const PrivacyPage = lazy(() => import("../pages/customer/PrivacyPage"));
const TermsPage = lazy(() => import("../pages/customer/TermsPage"));

// Auth pages

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));

const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));

// Admin pages

const DashboardPage = lazy(() => import("../pages/admin/DashboardPage"));

const MenuManagementPage = lazy(
  () => import("../pages/admin/MenuManagementPage"),
);

const AddMenuItemPage = lazy(() => import("../pages/admin/AddMenuItemPage"));

const EditMenuItemPage = lazy(() => import("../pages/admin/EditMenuItemPage"));

const OrdersManagementPage = lazy(
  () => import("../pages/admin/OrdersManagementPage"),
);

const AdminOrderDetailPage = lazy(
  () => import("../pages/admin/AdminOrderDetailPage"),
);

const AdminProfilePage = lazy(() => import("../pages/admin/AdminProfilePage"));

// Loading fallback

function LoadingPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#1f3478]" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* ==================== Customer Routes ==================== */}

          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Protected Customer Routes */}

            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/order-confirmation/:id"
                element={<OrderConfirmationPage />}
              />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ==================== Auth Routes ==================== */}

          <Route element={<AuthLayout />}>
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* ==================== Admin Routes ==================== */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="menu" element={<MenuManagementPage />} />
            <Route path="menu/add" element={<AddMenuItemPage />} />
            <Route path="menu/edit/:id" element={<EditMenuItemPage />} />
            <Route path="orders" element={<OrdersManagementPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>

          {/* ==================== 404 ==================== */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
