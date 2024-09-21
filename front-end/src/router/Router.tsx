
import { Route, Routes } from 'react-router-dom'
import Homepage from '../pages/homepage/Homepage'
import Cart from '../pages/cart/Cart'
import Product from '../pages/products/Product'
import Order from '../pages/order/Order'
import OrderDetail from '../pages/order/orderDetails/OrderDetail'
import ProductDetail from '../pages/productDetail/ProductDetail'
import Login from '../pages/login/login'
import Register from '../pages/register/Register'


const Router = () => {
  const infor = {
    title: "Dế mèn phiêu lưu ký",
  author: "Tô Hoài",
  publisher: "Dân trí",
  price: 80000,
  discountPrice: 30000,
  image: "https://lh4.googleusercontent.com/proxy/EBAyH1uGo9-ZhCvcsFiKFa4AixalbCWbR39f4S2yR68MYzf16ZdapZAbcibeYnYrsLU7HTL-kTIOGFTexFw_u2Xmk3W7Iibz",
  stock: 20
  }
  return (
    <>
    
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/cart" element={<Cart/>} />
            {/* Products Route */}
            <Route path="/products" element={<Product/>} />
            <Route path="/products/:id" element={<Product/>} />
            {/* User */}
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/profile" element={<Cart/>} />
            <Route path="/profile/edit" element={<Cart/>} />

            {/* Orders */}
            <Route path="/orders" element={<Order/>} />
            <Route path="/orders/:id" element={<ProductDetail {...infor}/>} />

            {/* Admin */}
            <Route path="/admin" element={<Cart/>} />
            <Route path="/admin/categories" element={<Cart/>} />
            <Route path="/admin/categories/:id" element={<Cart/>} />
            <Route path="/admin/products" element={<Cart/>} />
            {/* <Route path="/admin/products/create" element={<Cart/>} />  */} 
            <Route path="/admin/products/:id" element={<Cart/>} />
            
            {/* <Route path="/admin/products/:id/edit" element={<Cart/>} /> */}
            <Route path="/admin/orders" element={<Order/>} />
            <Route path="/admin/orders/:id" element={<Order/>} />

            <Route path="/admin/users" element={<Cart/>} />
            <Route path="/admin/users/:id" element={<Cart/>} />

            {/* Vouchers */}
            <Route path="/admin/vouchers" element={<Cart/>} />

            <Route path="/admin/config" element={<Cart/>} />

            {/* Cashier */}
            <Route path="admin/cashier" element={<Cart/>} />
        </Routes>
        
    </>
  )
}

export default Router;