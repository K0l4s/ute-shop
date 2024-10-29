
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
// import OrderDetailModal from '../components/modals/OrderDetailModal'




const Router = () => {
  return (
    <>
      <Routes>
        <Route >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/active" element={<ActiveAccount />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset/password" element={<ResetPassword />} />
        </Route>
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
          {/* <Route path="/profile" element={<Cart />} /> */}
          {/* <Route path="/profile/edit" element={<Cart />} /> */}
          {/* <Route path="/orders" element={<Order />} /> */}
          {/* <Route path="/orders/:id" element={<OrderDetailModal />} /> */}
          <Route path="/search/" element={<SearchResults />} />
          <Route path="/order/vnpay_return" element={<RequireAuth><PaymentSuccess/></RequireAuth>} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/categories" element={<Cart />} />
          <Route path="/admin/categories/:id" element={<Cart />} />
          <Route path="/admin/products" element={<AdminProduct />} />
          <Route path="/admin/products/:id" element={<Cart />} />
          <Route path="/admin/orders" element={<AdminOrder />} />
          {/* <Route path="/admin/orders/:id" element={<Order />} /> */}
    
          <Route path="/admin/users" element={<Cart />} />
          <Route path="/admin/users/:id" element={<Cart />} />
          <Route path="/admin/authors" element={<AdminAuthorPage />} />
          {/* Vouchers */}
          <Route path="/admin/vouchers" element={<Cart />} />
 
          <Route path="/admin/config" element={<Cart />} />

          {/* Cashier */}
          <Route path="admin/cashier" element={<Cart />} />
        </Route>
      </Routes>

    </>
  )
}

export default Router;