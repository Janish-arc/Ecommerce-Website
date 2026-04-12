import React, { useEffect, useState } from 'react'
import { Navbar } from '../Components/Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { neworder } from '../Redux/userSlicer'
import toast from 'react-hot-toast'

export const FinalOrder = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {order, success} = useSelector((state) => state.user)
    const {totalPrice = 0, name, address, city, state, number, country, pincode, Name, price, proImage, Ddescription, quantity, productId, cart=[]} = location.state || {}
    
    const createOrder = () => {
        const orderData = {
            shippingAddress : {
                address, city, state, country, pincode, phoneNo: number, 
            },
            orderItems : isCartFlow ? cart.map(item => ({
                name : item?.product?.name,
                price : item?.product?.price,
                quantity : item?.quantity,
                image : item?.product?.image[0]?.url,
                product : item?.product?._id,
                    
            })) : [{
                name : Name,
                price : price,
                quantity : quantity,
                image : proImage,
                product : productId
            }],
        paymentInfo: {
        id: "COD",
        status: "pending",
        method: "COD"
      },

      itemPrice: totalPrice,
      taxPrice: COD,
      shippingPrice: delivery,
      totalPrice: Total
    }
    dispatch(neworder(orderData))
    }

    useEffect(() => {
        if(success){
            toast.success("Order placed successfully")
            navigate("/myorder")
        }
    }, [success, navigate])

    const isCartFlow = cart.length > 0
    let delivery = 40
    if (totalPrice > 2000) {
    delivery = 0
    } else {
    delivery = 60
    }
    const COD = 10
    const total = totalPrice + delivery + COD
    const Total = total - delivery


  return (
    <div>
        <Navbar/>
        <div className='col-12 d-flex flex-column flex-lg-row'>
            <div className='col-12 col-lg-8 mx-auto'>
               <div className='d-flex flex-column gap-4 m-3'>
                {/* Delivery Address */}
                <div className='p-4 shadow rounded'>
                    <h5><b>Delivering to {name}</b></h5>
                    <p>{address}, {city}, {state}, {pincode}, {country}</p>
                </div>
                {/* Payment Method */}
                <div className='p-4 shadow rounded'>
                    <h5><b>Pay on delivery</b> (Cash/Card)</h5>
                </div>                
                {/* Products */}
                <div className='p-4 shadow rounded'>

                {isCartFlow ? (
                    cart.map((item) => (
                    <div key={item.product._id} className="d-flex gap-3 mb-3 shadow p-2 rounded">
                        <img 
                        src={item.product?.image?.[0]?.url} 
                        style={{width: "200px", height:"200px", objectFit:"cover", borderRadius:"8px"}}/>
                        <div>
                        <h6>{item.product.name}</h6>
                        <p>{item.product?.detailedDescription}</p>
                        <p ><b>₹{item.product.price * item.quantity}</b></p>
                        <div className='d-flex flex-column flex-md-row'>
                            <div>
                                
                                <p className='m-0'>Qty: {item.quantity}</p>
                            </div>
                            <div className='ms-2 d-flex align-items-center justify-content-center border border-warning border-3 rounded-pill ' style={{backgroundColor:"rgb(241, 244, 247)", width:'150px', height:'40px'}}>
                                <button className='border mx-3'><Minus size={17} /></button>
                                <span>1</span>
                                <button className='border mx-3'><Plus size={17}/></button>
                            </div>
                        </div>
                        </div>

                    </div>
                    ))
                ) : (
                    <div className="d-flex gap-3">

                    <img 
                        src={proImage} 
                        style={{width: "200px", height:"200px", objectFit:"cover"}}
                    />

                    <div>
                        <h6>{Name}</h6>
                        <p>{Ddescription}</p>
                        <p><b>₹{price}</b></p>
                         <div className='mt-3 ms-2 d-flex align-items-center justify-content-center border border-danger border-3 rounded-pill' style={{backgroundColor:"rgb(241, 244, 247)", width:'150px', height:'40px', borderRadius:'10px'}}>
                            <button className='btn border btn-white mx-3'><Minus size={17} /></button>
                            <span>{quantity || 1}</span>
                            <button className='btn border btn-white mx-3' ><Plus size={17}/></button>
                        </div>
                    </div>

                    </div>
                )}

                </div>         
                </div>      
            </div>

            <div className='col-12 col-lg-4 mt-3'>
                <div className='shadow px-4 me-4 rounded border-secondary border-2 border order-summary'>
                <h5 className='d-flex justify-content-center pt-4'>Order Details</h5>
                <div>
                    <div className='d-flex justify-content-between'>
                    <h6>Items </h6>
                    <h6>₹{totalPrice?.toLocaleString()}</h6>
                    </div>
                    {delivery === 0 ? (
                        <div className='d-flex justify-content-between text-success'>
                        <h6>Delivery</h6>
                        <h6>FREE</h6>
                        </div>
                    ) : (
                        <div className='d-flex justify-content-between'>
                        <h6>Delivery</h6>
                        <h6>₹{delivery?.toLocaleString()}</h6>
                        </div>
                    )}
                    
                    <div className='d-flex justify-content-between'>
                    <h6>Cash/Pay on Delivery</h6>
                    <h6>₹{COD?.toLocaleString()}</h6>
                    </div>
                    <div className='d-flex justify-content-between'>
                    <h6>Total</h6>
                    <h6>₹{total?.toLocaleString()}</h6>
                    </div>
                </div>
                <hr/>
                <div className='d-flex justify-content-between'>
                    <h5 className='fw-bold'>Total</h5>
                    <h5 className='fw-bold'>₹{Total?.toLocaleString()}.00</h5>
                </div>

                <div className='mt-2 d-flex justify-content-center'>
                    <button className='btn btn-warning-subtle rounded-pill my-3 w-100' style={{background:"#ffe066"}} onClick={createOrder}>Place Order</button>
                </div>
                </div>  
            </div>
        </div>
    </div>
  )
}
