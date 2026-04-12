import React, { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { deleteOrders, orderDetails } from '../Redux/adminSlice'
import { Link, useNavigate } from 'react-router-dom'

export const OrderDetails = () => {
  const {orders} = useSelector((state) => state.admin)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getStatusClass = (status) => {
  if (status === "Delivered") return "badge p-2 bg-success mt-3"
  if (status === "Cancelled") return "badge p-2 bg-danger mt-3"
  return "badge p-2 bg-warning mt-3 text-black"
}

  useEffect(() => {
    dispatch(orderDetails())
  }, [dispatch])

  const handleDelete = (id) => {
    dispatch(deleteOrders(id))
  }

  return (
    <div className='container-fluid p-0 vh-100 d-flex flex-column'>
      <div>
        <Sidebar/>
      </div>
      <div className='col-12 col-lg-9 p-2 main-content'>
        <h5 className='p-4' style={{ background: "linear-gradient(to right, #1f2937, #31507b)", color:"white", textTransform:"uppercase" }}>Order Details</h5>
        <div className='overflow-x-auto category-scroll'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Username</th>
                <th>Email</th>
                <th>Total</th>
                <th>Status</th> 
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order,index) => {
                return (
                  <tr key={order._id} onClick={() => navigate(`/admin/order/${order._id}`)}>
                    <td>#{order._id.slice(-5).toUpperCase()}</td>
                    <td>{order.user?.name || <span className='text-danger'>User Deleted</span>}</td>
                    <td>{order?.user?.email || <span className='text-danger'>NA</span>}</td>
                    <td className='fw-semibold'>₹{(order?.totalPrice).toLocaleString()}</td>
                    <td className={getStatusClass(order?.orderStatus)} style={{fontSize:"15px"}}>{order.orderStatus}</td>
                    <td>{new Date(order?.createdAt).toLocaleDateString()}</td>
                    <td><span className='d-flex gap-2'>
                      <div>
                      <Link to={`/admin/order/${order._id}`}>
                      <button className='btn primary-btn'>View</button>
                      </Link>
                      </div>
                      <button className='btn btn-danger' onClick={() => handleDelete(order._id)}>Delete</button>
                    </span></td>
                  </tr>
                )}
              )}
            </tbody>
          </table>  
        </div>
      </div>
    </div>
  )
}
