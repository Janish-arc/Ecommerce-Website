import { StrictMode } from 'react'
import "./App.css"
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import { Home } from './Pages/Home'
import { About } from './Pages/About'
import { Contact } from './Pages/Contact'
import { Register } from './User/Register'
import { Products } from './Pages/Products'
import { Cart } from './Pages/Cart'
import { store } from './Redux/store'
import { Provider, useSelector } from 'react-redux'
import {Toaster} from 'react-hot-toast'
import { ProductDetails } from './Pages/ProductDetails'
import { Login } from './User/Login'
import { UserProfile } from './User/UserProfile'
import { UpdateProfile } from './User/UpdateProfile'
import { ChangePassword } from './Pages/UpdatePassword'
import { AdminProduct } from './Admin/AdminProducts'
import { AdminDashboard } from './Admin/AdminDashboard'
import { Userdetails } from './Admin/Userdetails'
import { OrderDetails } from './Admin/OrderDetails'
import { SingleOrderDetails } from './Admin/SingleOrderDetails'
import { Order } from './Pages/Order'
import { FinalOrder } from './Pages/FinalOrder'
import { MyOrder } from './Pages/MyOrder'
import { ForgotPassword } from './Pages/ForgotPassword'
import { ResetPassword } from './Pages/ResetPassword'

const ProtectedRoute = ({children}) => {
  const { isAuthenticated } = useSelector((state) => state.user)

  if(!isAuthenticated){
    return <Navigate to="/login"/>
  }

  return children
}

const router = createBrowserRouter(
  [
    { path : '/', element : <Home/> },
    { path : "/product/:id", element: <ProductDetails/> },
    { path : "/about-us", element : <About/>},
    { path : "/contact-us", element : <Contact/>},
    { path : "/register", element : <Register/>},
    { path : "/products", element : <Products/>},
    { path : "/cart", element : <Cart/>},
    { path : "/login", element : <Login/>},
    { path : "/user", element : <UserProfile/>},
    { path : "/update-profile", element : <UpdateProfile/>},
    { path : "/password-update", element : <ChangePassword/>},
    { path : "/admin/dashboard", element : <AdminDashboard/>},
    { path : "/admin/product/:section", element : <AdminProduct/>},
    { path : "/admin/user", element : <Userdetails/>},
    { path : "/admin/orders", element : <OrderDetails/>},
    { path : "/admin/order/:id", element : <SingleOrderDetails/>},
    { path : "/order", element : <Order/>},
    { path : "/order/summary", element : <FinalOrder/>},
    { path : "/myorder", element : <MyOrder/>},
    { path : "/forgot-password", element : <ForgotPassword/>},
    { path : "/reset/password/:token", element : <ResetPassword/>}
  ]
)
  createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <RouterProvider router = {router} />
      <Toaster position='top-center'/>
   </Provider>
  
)