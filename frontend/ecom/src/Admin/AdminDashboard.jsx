import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDashboardDetails, orderDetails } from '../Redux/adminSlice'
import {formatDate} from "../Components/Format"
import { useNavigate, useParams } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Bar , Pie } from 'react-chartjs-2'
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js"
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export const AdminDashboard = () => {
    const {productCount, userCount, orderCount} = useSelector((state) => state.admin)
    const {orders, totalAmount} = useSelector((state) => state.admin)
    // console.log("Orders:", orders)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const statusCount = {
        Delivered: 0, Processing: 0, Cancelled: 0
    }
    orders?.forEach(order => {
        if(order.orderStatus === "Delivered"){
            statusCount.Delivered++
        }
        else if(order.orderStatus === "Cancelled"){
            statusCount.Cancelled++
        }
        else{
            statusCount.Processing++
        }
    })

    const pieData = {
    labels: ["Delivered", "Processing", "Cancelled"],
    datasets: [
        {
        label: "Orders",
        data: [
            statusCount.Delivered,
            statusCount.Processing,
            statusCount.Cancelled
        ],
        backgroundColor: [
        "#22c55e",   // green (Delivered)
        "#f59e0b",   // yellow (Processing)
        "#ef4444"    // red (Cancelled)
      ],
      hoverOffset: 10,
      borderWidth: 1
        }
    ]
    }

    const revenueByDate = {}

    orders?.forEach(order => {
    const date = formatDate(order.createdAt)

    if (!revenueByDate[date]) {
        revenueByDate[date] = 0
    }

    revenueByDate[date] += order.totalPrice
    })

    const barData = {
    labels: Object.keys(revenueByDate),
    datasets: [
        {
        label: "Revenue",
        data: Object.values(revenueByDate),
        backgroundColor: "#3b82f6",
        barThickness: 50
        }
    ]
    }

      const getStatusClass = (status) => {
        if (status === "Delivered") return "badge p-2 bg-success mt-3"
        if (status === "Cancelled") return "badge p-2 bg-danger mt-3"
        return "badge p-2 bg-warning mt-3"
        }

    useEffect(() => {
        dispatch(getDashboardDetails())
    }, [dispatch])

    useEffect(() => {
        dispatch(orderDetails())
    }, [dispatch])

  return (
    <div className="container-fluid p-0 vh-100 d-flex flex-column ">
        <div><Sidebar/></div>

        <div className='col-12 col-lg-9 p-2 main-content'>
        <div className='p-4' style={{ background: "linear-gradient(to right, #1f2937, #31507b)", color:"white", textTransform:"uppercase" }}>
            <h1>Admin Dashboard</h1>
            <p>Manage your store, products, users, and orders from one place.</p>
        </div>    
        <div className="row g-3 mt-2">

            <div className="col-12 col-sm-4 ">
            <div className="rounded-bottom p-3 shadow h-100 d-flex flex-column align-items-center count" style={{borderTop:"#1f2937 4px solid"}} onClick={() => navigate("/admin/product/allproduct")}>
                <h2>{productCount}</h2>
                <h5 style={{textTransform:"uppercase"}} >Total Products</h5>
            </div>
            </div>

            <div className="col-12 col-sm-4">
            <div className="rounded-bottom p-3 shadow h-100 d-flex flex-column align-items-center count" style={{borderTop:"#1f2937 4px solid"}} onClick={() => navigate("/admin/user")}>
                <h2>{userCount}</h2>
                <h5 style={{textTransform:"uppercase"}} >Total Users</h5>
            </div>
            </div>

            <div className="col-12 col-sm-4">
            <div className="rounded-bottom p-3 shadow h-100 d-flex flex-column align-items-center count" style={{borderTop:"#1f2937 4px solid"}} onClick={() => navigate("/admin/orders")}>
                <h2>{orderCount}</h2>
                <h5 style={{textTransform:"uppercase"}} >Total Orders</h5>
            </div>
            </div>

        </div>
        <div className="row mt-4 g-3">

        <div className="col-md-6">
            <div className="p-3 shadow rounded bg-white" style={{ height: "500px", position: "relative" }}>
                <div className='d-flex align-items-center'>
                    <h5 className="mb-3">Order Status</h5>
                    <h5 className='ms-5 ps-5 mb-3'>Total Order: {orderCount}</h5>
                </div>
            <Pie className='pb-4' data={pieData} options={{ maintainAspectRatio: false, cutout: "60%", plugins: {legend: { position: "bottom" }} }}/>
            </div>
        </div>

        <div className="col-md-6">
            <div className="p-3 shadow rounded bg-white " style={{ height: "500px", position: "relative" }}>
            <h5 className="mb-3">Revenue</h5>
            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: {tooltip: {callbacks: {label: function(context) {return "₹" + context.raw.toLocaleString()}}}} }}/>
            </div>
        </div>

        </div>
        <div className='d-flex flex-column flex-xl-row gap-2 mt-5'>
            <div className='shadow rounded mt-5 p-3 overflow-auto category-scroll col-12 col-xl-8'>
            <h4>Latest Orders</h4>
            
            <table className='border border-2 border-black admin-table mt-4'>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Total</th>
                        <th>Order Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.slice()    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order, index) => 
                    <tr key={order._id} onClick={() => navigate(`/admin/order/${order._id}`)}>
                        <td>{index+1}</td>
                        <td>{order?.user?.name || <span className='text-danger'>Deleted User</span>}</td>
                        <td>{order?.user?.email || <span className='text-danger'>N/A</span>}</td>
                        <td>₹{(order?.totalPrice).toLocaleString()}</td>
                        <td><span className={getStatusClass(order.orderStatus)} style={{fontSize:"15px"}}>
                        {order.orderStatus}
                        </span>
                        </td>
                        <td>{formatDate(order?.createdAt)}</td>
                    </tr>
                    )}
                </tbody>
            </table>
            </div>

            <div className='col mt-5 d-flex flex-row flex-xl-column gap-3 vh-100'>
                <div className='shadow col-6 col-xl-12 p-4 d-flex flex-column justify-content-center align-items-center rounded-bottom count' style={{borderTop:"#1f2937 4px solid", height:"300px"}}>
                    <h6 className='text-primary fs-2'>₹{(totalAmount).toLocaleString()}</h6>
                    <h4>Total Revenue</h4>
                </div>
                <div className='shadow col-6 col-xl-12 p-4 pt-5 rounded-bottom count' style={{borderTop:"#1f2937 4px solid", height:"300px"}}>
                    <h4>Quick Actions</h4>
                    <div className='gap-2 mt-3 d-flex flex-column align-items-center'>
                        <button className='w-100 p-1 btn rounded-pill primary-btn' onClick={() => navigate("/admin/product/addproduct")}>Add Product</button>
                        <button className='w-100 p-1 btn rounded-pill primary-btn' onClick={() => navigate("/admin/orders")}>View Order</button>
                        <button className='w-100 p-1 btn rounded-pill primary-btn' onClick={() => navigate("/admin/user")}>Manage User</button>
                    </div>
                </div>
            </div>
        </div>
        
        </div>
    </div>
  )
}
