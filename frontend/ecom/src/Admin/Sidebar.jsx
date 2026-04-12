import React from 'react'
import {BarChart3, LogOut, Package, ShoppingBag, ShoppingCart, User} from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { logout } from '../Redux/userSlicer'
import { useDispatch } from 'react-redux'
import axios from 'axios'

export const Sidebar = () => {
     const navigate = useNavigate()
     const dispatch = useDispatch()

        const logoutHandler = async () => {
            try {
                await axios.get("/api/v1/logout", {
                    withCredentials: true
                })
                dispatch(logout())
                navigate("/login")
            }
      
            catch (error) {
                console.log(error)
            }
        }

   
  return (
    <div className="col-12 shadow d-flex flex-column category-scroll overflow-x-auto sidebar-container"
        style={{  background: "linear-gradient(to bottom, #1f2937, #31507b)", color:"white" }}>
            <div className="d-flex align-items-center gap-2 mt-4 border-bottom mx-2">
                <ShoppingBag size={34}/>
                <h2 className="mt-2 fw-bold">CIRCUIT STORE</h2>
            </div>

            <div className='mx-2 mt-3 d-flex flex-row flex-lg-column gap-3'>
            <div className='d-flex gap-1 align-items-center sidebar'>
                <BarChart3/>
                <h4 className='mt-2' onClick={() => navigate("/admin/dashboard")}>Dashboard</h4>
            </div>    
                {/* Products */}
            <div  className="px-2" style={{boxShadow:"rgba(255, 255, 255, 0.47) 0px 0px 10px 1px"}}>
                <div className='d-flex gap-1 align-items-center'>
                    <Package/>
                    <h4 className=' rounded d-flex align-items-center mt-2' style={{height:"40px"}}>Products</h4>
                </div>
                <div className='d-flex flex-row flex-lg-column gap-1 '>
                    <h6 className=' py-2 pe-3 sidebar' onClick={() => navigate("/admin/product/allproduct")}>All Products</h6>
                    <h6 className=' py-2 pe-3 sidebar' onClick={() => navigate("/admin/product/addproduct")}>Add Product</h6>
                    <h6 className=' py-2 pe-3 sidebar' onClick={() => navigate("/admin/product/category")}>Category</h6>
                </div>
            </div>
            {/* Users */}
            <div className="px-2" style={{boxShadow:"rgba(255, 255, 255, 0.47) 0px 0px 10px 1px"}}>
                <div className='d-flex gap-1 align-items-center'>
                    <User/>
                    <h4 className='rounded d-flex align-items-center mt-2' style={{height:"40px"}}>Users</h4>
                </div>
                <div>
                    <h6 className=' py-2 pe-3 sidebar' onClick={() => navigate("/admin/user")}>All Users</h6>
                </div>
            </div>
            {/* Orders */}
            <div className="px-2" style={{boxShadow:"rgba(255, 255, 255, 0.47) 0px 0px 10px 1px"}}>
                <div className='d-flex gap-1 align-items-center'>
                    <ShoppingCart/>
                    <h4 className='rounded d-flex align-items-center mt-2' style={{height:"40px"}}>Orders</h4>
                </div>
                <div>
                    <h6 className=' py-2 pe-3 sidebar' onClick={() => navigate("/admin/orders")}>All Orders</h6>
                </div>
            </div>
            <div className='d-flex flex-column gap-2'>
                <button className='btn btn-dark text-danger rounded mt-3 d-flex flex-row gap-2 align-items-center justify-content-center' onClick={logoutHandler} style={{height:"40px"}}>
                    <div><LogOut/></div>    
                    <div>Logout</div>
                </button>
                <button className='btn primary-btn' onClick={() => navigate("/")}>Home</button>
            </div>
                
            
            </div>
        </div>
  )
}
