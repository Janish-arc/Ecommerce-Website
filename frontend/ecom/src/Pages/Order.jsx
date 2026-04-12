import React, { useState } from 'react'
import { Navbar } from '../Components/Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

export const Order = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const {totalPrice, price, Name, proImage, Ddescription, quantity, product, productId, cart=[]} = location.state || {}
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [number, setNumber] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [pincode, setPincode] = useState("")
    const [country, setCountry] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    let delivery = 40
    if (totalPrice > 2000) {
    delivery = 0
    } else {
    delivery = 60
    }
    const COD = 10
    const total = totalPrice + delivery + COD
    const Total = total - delivery

    const handlenext = () => {
        if(!name || !number || !email || !address || !city || !state || !pincode || !country){
        toast.error("Please fill out the address details")
        return
    }
        if(!paymentMethod){
            toast.error("Please select a payment method")
            return
        }
        if(paymentMethod != "Cash"){
            toast.error("Only cash on delivery is available right now")
            return
        }
    navigate("/order/summary", {state: {totalPrice, name, number, address, city, state, country, pincode, price, Name, proImage, Ddescription, quantity ,productId, cart, product}})
    }
    
  return (
    <div>
        <Navbar/>
        <h3 className="text-center my-4 fw-bold">Order Checkout</h3>
        <div className='col-12 d-flex flex-column flex-md-row' style={{ backgroundColor: "#f8f9fa"}}>
            <div className='col-12 col-lg-8 mx-auto '>
                <div className='m-3 d-flex flex-column gap-4'>
                    {/* Address */}
                    <div className="p-4 shadow rounded">
                        <h5 className="fw-bold mb-3">Delivery Address</h5>
                        <div className="row g-3">

                            <div className="col-md-6">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-control" name='name' onChange={(e) => setName(e.target.value)}/>
                            </div>

                            <div className="col-md-6">
                            <label className="form-label">Phone Number</label>
                            <input type="Number" className="form-control" name='number' onChange={(e) => setNumber(e.target.value)}/>
                            </div>

                            <div className="col-12">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" name='email' onChange={(e) => setEmail(e.target.value)}/>
                            </div>

                            <div className="col-12">
                            <label className="form-label">Address</label>
                            <textarea className="form-control" rows="3" name='address' onChange={(e) => setAddress(e.target.value)}></textarea>
                            </div>

                            <div className="col-md-6">
                            <label className="form-label">Village (or) Town (or) City</label>
                            <input type="text" className="form-control" name='city' onChange={(e) => setCity(e.target.value)}/>
                            </div>

                            <div className="col-md-6">
                            <label className="form-label">Pincode</label>
                            <input type="Number" className="form-control" name='pincode' onChange={(e) => setPincode(e.target.value)}/>
                            </div>

                            <div className="col-md-6">
                            <label className="form-label">State</label>
                            <input type="text" className="form-control" name='state' onChange={(e) => setState(e.target.value)}/>
                            </div>

                            <div className="col-md-6">
                            <label className="form-label">Country</label>
                            <input type="text" className="form-control" name='country' onChange={(e) => setCountry(e.target.value)}/>
                            </div>

                        </div>
                    </div>

                    {/* Payment */}
                    <div className="p-4 shadow rounded">
                        <h5 className="fw-bold mb-3">Payment Method</h5>
                        <div className="d-flex flex-column gap-3">

                            {/* COD */}
                            <div className="flex-fill">
                            <input 
                                type="radio" 
                                name="payment" 
                                id="cod" 
                                value="Cash"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label className=" ms-2" htmlFor="cod">
                                Cash on Delivery
                            </label>
                            </div>

                            {/* UPI */}
                            <div className="flex-fill">
                            <input 
                                type="radio" 
                                name="payment" 
                                id="upi" 
                                value="UPI"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label className="ms-2" htmlFor="upi">
                                UPI (Coming Soon)
                            </label>
                            </div>

                            {/* Card */}
                            <div className="flex-fill">
                            <input 
                                type="radio" 
                                name="payment" 
                                id="card" 
                                value="CARD"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label className="ms-2" htmlFor="card">
                                Card Payment (Coming Soon)
                            </label>
                            </div>
                        </div>
                        <button className='btn btn-warning-subtle rounded-pill mt-3' style={{background:"#ffe066"}} onClick={handlenext}>Use this payment method</button>
                    </div>

                    {/* Optional Notes */}
                    <div className="p-4 shadow rounded">
                        <h5 className='mb-3'><b>Delivery Instructions </b><small>(optional)</small></h5>
                        <div className='d-flex flex-column'>
                            <textarea className='rounded form-control' rows="3"
                            placeholder='eg. Call me before delivery, Leave at gate '></textarea>
                            <small className='text-muted mt-1'>This helps the delivery person to deliver your order easily</small>
                        </div>
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
                    <button className='btn btn-warning-subtle rounded-pill my-3 w-100' style={{background:"#ffe066"}} onClick={handlenext}>Proceed to confirm</button>
                </div>
                </div>  
            </div>
        </div>
    </div>
  )
}
