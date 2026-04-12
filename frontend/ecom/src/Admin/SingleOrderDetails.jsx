import React, { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getSingleOrder, orderDetails, updateOrder, userOrders } from '../Redux/adminSlice'

export const SingleOrderDetails = () => {
    const {singleOrder, userOrderCount, userOrderAmount} = useSelector((state) => state.admin)
    const {id} = useParams()
    const dispatch = useDispatch()
    // const order = orders?.find(o => o._id === id)

    useEffect(() => {
        dispatch(orderDetails())
    },[dispatch])

    useEffect(() => {
        dispatch(getSingleOrder(id))
    }, [dispatch, id])  

    useEffect(() => {
        if (singleOrder?.user?._id) {
            dispatch(userOrders(singleOrder.user._id))
        }
    }, [dispatch, singleOrder])

    const getStatusClass = (status) => {
    if (status === "Delivered") return "badge p-2 bg-success mt-3"
    if (status === "Cancelled") return "badge p-2 bg-danger mt-3"
    return "badge p-2 bg-warning mt-3 text-black"
    }

   const orderSteps = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

    const updatedOrder = (status) => {
         console.log("clicked", status);
        dispatch(updateOrder({id: singleOrder._id, status}))
    }
    
  return (
        <div className='container-fluid p-0 vh-100 d-flex flex-column'>
            <div>
                <Sidebar/>
            </div>

            <div className='col-12 col-lg-9 p-2 gap-3 main-content'>
            {/* Order Header */}
                <div className="rounded p-2">
                {/* ORDER HEADER */}
                <div className="shadow p-4 rounded d-flex flex-column flex-md-row justify-content-around align-items-center" style={{ background: "linear-gradient(to right, #1f2937, #31507b)", color:"white", textTransform:"uppercase" }}>
                <div>
                    <h3>ORDER #{singleOrder?._id?.slice(-5).toUpperCase()}</h3>
                    <h4>Order placed on: {new Date(singleOrder?.createdAt)?.toLocaleDateString()}</h4>
                </div>
                <div className='gap-2 d-flex flex-column'>
                    <div className='d-flex gap-2 align-items-center'>
                        <h5 className="mt-3" style={{width:"100px"}}>Order</h5>
                        {/* <h5 className={getStatusClass(singleOrder?.orderStatus)} style={{fontSize:"15px", width:"110px"}}>{singleOrder?.orderStatus}</h5> */}
                        <select style={{fontSize:"15px", width:"130px", paddingLeft:"10px", borderRadius:"7px", height:"36px", border:"none"}}
                        value={singleOrder?.orderStatus}
                        onChange={(e) => updatedOrder(e.target.value)}>
                            {orderSteps.map((step,index) => {
                                const currentIndex = orderSteps.indexOf(singleOrder?.orderStatus)
                                return(
                                    <option
                                    key={step} value={step} disabled={index < currentIndex}>
                                        {step}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='d-flex gap-2 align-items-center'>
                        <h5 style={{width:"100px"}}>Payment</h5>
                        <h5 className="badge bg-info p-2 text-black" style={{fontSize:"15px", width:"110px"}}>{singleOrder?.paymentInfo?.status}</h5>
                    </div>
                </div>
                </div>
                </div>

                <div className='d-flex p-2 flex-column'>
                <div className='row g-3'>
                    <div className="col-12 col-md-4">
                    {/* CUSTOMER INFO */}
                    <div className="shadow p-4 rounded h-100" style={{ background: "linear-gradient(to right, #1f2937, #31507b)", color:"white"}}>
                    <h4 style={{textTransform:"uppercase"}}><b>Customer Info</b></h4>
                    <div className='ms-4 mt-3'>             
                    <div className='d-flex mb-2'>
                        <span style={{width:"150px"}}><b>Name:</b></span>
                        <span>{singleOrder?.user?.name}</span>
                    </div>
                    <div className="d-flex mb-2">
                        <span style={{width:"150px"}}><b>Email: </b></span>
                        <span>{singleOrder?.user?.email}</span>
                    </div>

                    <div className="d-flex mb-2">
                        <span style={{width:"150px"}}><b>PhoneNo: </b></span>
                        <span>{singleOrder?.shippingAddress?.phoneNo}</span>
                    </div>
                    <div className='d-flex mb-2'>
                        <span style={{width:"150px"}}><b>Total Orders: </b></span>
                        <span>{userOrderCount}</span>
                    </div>
                    <div className='d-flex mb-2'>
                        <span style={{width:"150px"}}><b>Total Spent: </b></span>
                        <span>₹{userOrderAmount.toLocaleString()}</span>
                    </div>
                    </div>
                    </div>
                    </div>

                    <div className='col-12 col-md-4'>
                    {/* ORDER SUMMARY */}
                    <div className="shadow p-4 rounded h-100" style={{ background: "linear-gradient(to right, #1f2937, #31507b)", color:"white"}}>
                    <h4 style={{textTransform:"uppercase"}}><b>Order Summary</b></h4>
                    <div className='ms-4 mt-3'>
                    <div className="d-flex mb-2">
                        <span style={{width:"200px"}}><b>Items:</b></span>
                        <span>{singleOrder?.orderItems?.length}</span>
                    </div>
                    <div className="d-flex mb-2">
                        <span style={{width:"200px"}}><b>Items Price: </b></span> 
                        <span>₹{singleOrder?.itemPrice?.toLocaleString()}</span>
                    </div>
                    <div className="d-flex mb-2">
                        <span style={{width:"200px"}}><b>Tax:</b> </span> 
                        <span>₹{singleOrder?.taxPrice?.toLocaleString()}</span>
                    </div>
                    <div className="d-flex mb-2">
                        <span style={{width:"200px"}}><b>Shipping:</b></span> 
                        <span>₹{singleOrder?.shippingPrice?.toLocaleString()}</span>
                    </div>
                    <hr/>
                    <div className="d-flex mb-2">
                        <span style={{width:"200px"}}><h5>Total: </h5></span>
                        <span><h5>₹{singleOrder?.totalPrice?.toLocaleString()}</h5></span>
                    </div>
                    </div>
                    </div>
                    </div>

                    <div className='col-12 col-md-4'>
                    <div className="shadow p-4 rounded h-100" style={{ background: "linear-gradient(to right, #1f2937, #31507b)", color:"white"}}>
                    <h4 style={{textTransform:"uppercase"}}><b>Shipping Address</b></h4>
                    <div className='ms-4 mt-3'>
                        <h6>Address: </h6>
                        <div>{singleOrder?.shippingAddress?.address}</div> 
                        <div>{singleOrder?.shippingAddress?.city}, {singleOrder?.shippingAddress?.state}</div>
                        <div>{singleOrder?.shippingAddress?.country}, {singleOrder?.shippingAddress?.pincode}</div>
                        <div>{singleOrder?.shippingAddress?.phoneNo}</div>
                    </div>
                </div>
                    </div>
                </div>

                </div>

                <div className='overflow-x-auto mb-3 shadow-lg category-scroll'>
                    <table className='admin-table '>
                        <thead>
                            <tr>
                                <th>ProductId</th>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {singleOrder?.orderItems?.map((item, index) => (
                                <tr key={index}>
                                    <td>#{item?._id.slice(-5).toUpperCase()}</td>
                                    <td>
                                        <img src={item?.image}
                                        alt={item?.name} className='rounded' style={{width:"100px", height:"100px", objectFit:"cover"}}/>
                                    </td>
                                    <td>{item?.name}</td>
                                    <td>₹{item?.price?.toLocaleString()}</td>
                                    <td>{item?.quantity}</td>
                                    <td ><span className={getStatusClass(singleOrder?.orderStatus)} style={{fontSize:"15px"}}>{singleOrder?.orderStatus}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
   
  )
}
