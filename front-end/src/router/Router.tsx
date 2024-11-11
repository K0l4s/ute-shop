
import { Route, Routes } from 'react-router-dom'
import Cart from '../pages/cart/Cart'
import Product from '../pages/products/Product'
import ProductDetail from '../pages/productDetail/ProductDetail'
import PaymentSuccess from '../pages/checkout/PaymentSuccess'
import Login from '../pages/login/Login';
// import Account from '../pages/account/Account'
import AccountPage from '../pages/account/AccountPage'
import Register from '../pages/register/Register'
import ForgotPassword from '../pages/forgotPassword/ForgotPassword'
import ResetPassword from '../pages/resetPassword/ResetPassword'
import LandingPage from '../pages/landingPage/LandingPage'
import ActiveAccount from '../pages/activeAccount/ActiveAccount'
import SearchResults from '../pages/search/SearchResult'
import Checkout from '../pages/checkout/Checkout'
import CustomerLayout from './layout/CustomerLayout'
import AdminLayout from './layout/AdminLayout'
import Dashboard from '../pages/admin/dashboard/Dashboard'
import AdminOrder from '../pages/admin/order/AdminOrder'
import AdminAuthorPage from '../pages/admin/author/AdminAuthorPage'
import { RequireAuth } from './RequireAuth'
import AdminProduct from '../pages/admin/product/AdminProduct'
import NotFoundPage from '../pages/errorPage/NotFoundPage'
import AdminPublisher from '../pages/admin/publisher/AdminPublisher'
import AdminUser from '../pages/admin/user/AdminUser'
import AdminVoucher from '../pages/admin/voucher/AdminVoucher'
import AdminEvent from '../pages/admin/eventPage/AdminEvent'
import AdminCategory from '../pages/admin/category/AdminCategory'
import AdminFreeship from '../pages/admin/voucher/AdminFreeship'
import RedirectIfAuthenticated from './layout/RedirectIfAuthenticated'
// import OrderDetailModal from '../components/modals/OrderDetailModal'




const Router = () => {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/active"
          element={
            <RedirectIfAuthenticated>
              <ActiveAccount />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/forgot"
          element={
            <RedirectIfAuthenticated>
              <ForgotPassword />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/reset/password"
          element={
            <RedirectIfAuthenticated>
              <ResetPassword />
            </RedirectIfAuthenticated>
          }
        />

        <Route element={<CustomerLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
          <Route path="/notifications/view" />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/account/profile" element={<RequireAuth><AccountPage /></RequireAuth>} />
          <Route path="/account/address" element={<RequireAuth><AccountPage /></RequireAuth>} />
          <Route path="/account/orders" element={<RequireAuth><AccountPage /></RequireAuth>} />
          <Route path="/account/favoriteBooks" element={<RequireAuth><AccountPage /></RequireAuth>} />
          <Route path="/account/purchasedBooks" element={<RequireAuth><AccountPage /></RequireAuth>} />
          <Route path="/account/viewHistory" element={<RequireAuth><AccountPage /></RequireAuth>} />
          {/* <Route path="/profile" element={<Cart />} /> */}
          {/* <Route path="/profile/edit" element={<Cart />} /> */}
          {/* <Route path="/orders" element={<Order />} /> */}
          {/* <Route path="/orders/:id" element={<OrderDetailModal />} /> */}
          <Route path="/search/" element={<SearchResults />} />
          <Route path="/order/vnpay_return" element={<RequireAuth><PaymentSuccess/></RequireAuth>} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/categories" element={<AdminCategory />} />
          <Route path="/admin/categories/:id" element={<Cart />} />
          <Route path="/admin/products" element={<AdminProduct />} />
          <Route path="/admin/product/:id" element={<Cart />} />
          <Route path="/admin/orders" element={<AdminOrder />} />
          {/* <Route path="/admin/orders/:id" element={<Order />} /> */}
          <Route path="/admin/publishers" element={<AdminPublisher />} />
          <Route path="/admin/users" element={<AdminUser />} />
          <Route path="/admin/user/:id" element={<AdminUser />} />
          <Route path="/admin/authors" element={<AdminAuthorPage />} />
          {/* Vouchers */}
          <Route path="/admin/vouchers" element={<AdminVoucher />} />
          <Route path="/admin/freeships" element={<AdminFreeship />} />
          <Route path="/admin/event" element={<AdminEvent />} />
          {/* <Route path="/admin/config" element={<Cart />} /> */}

          {/* Cashier */}
          {/* <Route path="admin/cashier" element={<Cart />} /> */}
        </Route>
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>

    </>
  )
}

export default Router;