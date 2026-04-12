import React, { useEffect, useState } from 'react'
import { PageTitle } from '../Components/PageTitle'
import axios from 'axios';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { Minus, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {

  const [cart, setCart] = useState([])
  const {isAuthenticated} = useSelector((state) => state.user)

  const navigate = useNavigate()
  useEffect(() => {
  const fetchCart = async () => {
    try {
      const { data } = await axios.get("/api/v1/cart", {
      withCredentials: true
    });
    setCart(data.cart.items);
    } catch (error) {
      if(error.response?.status === 401){
        setCart([])
      }else{
        console.log(error)
      }
    }
  };
  if(isAuthenticated){
     fetchCart();
  }else{
    setCart([])
  }
}, [isAuthenticated]);

const removeItem = async (id) => {
  await axios.delete(`/api/v1/cart/removeProducts/${id}`, {
    withCredentials: true
  });
  setCart(cart.filter(item => item.product._id !== id))
  window.dispatchEvent(new Event("cartUpdated"))
};

const updateQuantity = async (id, change) => {
  const item = cart.find(i => i.product._id === id)
  const newQty = item.quantity + change
  if(newQty < 1) return
  await axios.post("/api/v1/cart/addProduct", {
    productId: id,
    quantity: change > 0 ? 1 : -1
  },{
    withCredentials:true
  })
  setCart(cart.map(i => i.product._id === id ? {...i, quantity:newQty} : i ))
  window.dispatchEvent(new Event("cartUpdated"))
}



  //Total amount
  const total = cart.reduce((acc, item) => {
    return acc + item.product?.price * item.quantity
  }, 0)
  const shipping = 40
  const discount = Math.round(total*0.02)
  const tax = Math.round(total*0.01)
  const totalPrice = total + shipping + tax - discount

// //Cart products count
// const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div>
      <PageTitle title = "Cart | Circuit-Store"/>
      <Navbar/>
      <h2 className='text-center mt-4 mb-4'>Shopping Cart</h2>
      <div className='d-flex flex-column flex-lg-row col-12 mb-3 '>
      <div className='container-fluid mb-3 col-12 col-lg-9 shadow-lg rounded '>
    
        {cart.length === 0 ? (<div  style={{paddingTop:'17%', paddingBottom:"20%"}}>
          <h3 className='d-flex justify-content-center text-primary display-4 fw-semibold'>Your cart is empty</h3>
          <div className='d-flex align-items-center justify-content-center'><i className="bi bi-cart-x-fill fs-1 me-2 mb-2 text-dark"></i><h6 className='fs-3 text-primary'>Add some products to get started</h6></div>
          </div>
      ) : (
          <div className='justify-content-center py-2'>
            {cart.map((item) => (
              <div  key={item.product?._id} >
              <div className='shadow d-flex flex-column flex-md-row gap-4 my-3 align-items-center rounded  position-relative' >
                <div style={{width:"320px", height:"220px"}}>
                <img
                  src={item.product.image[0]?.url}
                  alt={item.product?.name}
                  style={{
                    width:"100%",
                    height:"100%",
                    objectFit:"cover",
                    borderRadius:"8px"
                  }}
                />
              </div>

                
                  <div className='p-2 w-100'>
                    <div className=''>
                      <h5 className='ms-2 d-flex justify-content-center justify-content-md-start'>{item.product?.name}</h5>
                      <p className='ms-2 d-none d-md-block'>{item.product?.detailedDescription}</p>
                      <div className='d-flex gap-4'>
                      <div>
                      <h6 className='fw-bold fs-5 ms-2 text-primary d-flex justify-content-center justify-content-md-start'>₹{item.product?.price}</h6>
                      <p className='text-success fw-medium ms-2 d-none d-md-block'>{item.product?.stock ? ("In Stock") : ("")}</p>
                      </div>
                      <div className='mt-3 ms-2 d-flex align-items-center justify-content-center border border-danger border-3 rounded-pill' style={{backgroundColor:"rgb(241, 244, 247)", width:'150px', height:'30px'}}>
                        <button className='btn btn-white mx-3 stockin' onClick={() => updateQuantity(item.product._id, -1)}><Minus size={17} /></button>
                        <span>{item?.quantity}</span>
                        <button className='btn btn-white mx-3 stockin' disabled={item.quantity >= item.product.stock} onClick={() => updateQuantity(item.product._id, +1)}><Plus size={17}/></button>
                      </div>
                      </div>
                    </div>
                      <div className="d-flex flex-column align-items-center align-items-md-start ">
                        
                      <div className='d-flex align-items-center my-2 gap-2 ms-2' style={{width:"300px"}}>
                        <button className='rounded btn btn-danger btn-sm color-white w-100 fs-6 pt-0 ' style={{height:"50px", width:"140px"}} onClick={() => removeItem(item.product._id)}> Remove from cart </button>
                        <button className='rounded btn w-100 fs-6 text-white ' style={{backgroundColor:"rgb(219, 98, 42)", height:"50px", width:"140px"}} onClick={() => navigate("/order", {state: {totalPrice, cart}})}>Buy now</button>
                      </div>
                    </div>
                   <div className='me-3 d-xl-block d-none position-absolute fw-medium' style={{right:"0%", bottom:"5%"}}>
                      Subtotal: ₹{(item.product?.price * item.quantity).toLocaleString()}
                    </div>
                </div> 
             </div>
            </div>
            ))}
          </div>
      )}
      {cart.length > 0 && 
      <div className='me-4'>
        <h5 className='fw-bold fs-4 py-2 d-flex justify-content-end'>Total Price: ₹{total.toLocaleString()}</h5>
      </div>
      }
      </div>
      {cart.length > 0 ? (
      <div className='container-fluid col-12 col-lg-3 mx-2'>
        <div className='shadow px-4 rounded border-secondary border-2 border order-summary'>
          <h5 className='d-flex justify-content-center pt-4'>Order Details</h5>
          <div>
            <div className='d-flex justify-content-between'>
              <h6>Items</h6>
              <h6>₹{total.toLocaleString()}.00</h6>
            </div>
            <div className='d-flex justify-content-between'>
              <h6>Shipping</h6>
              <h6>₹{40}.00</h6>
            </div>
            <div className='d-flex justify-content-between text-danger'>
              <h6>Discount</h6>
              <h6>-₹{discount.toLocaleString()}.00</h6>
            </div>
            <div className='d-flex justify-content-between'>
              <h6>Tax</h6>
              <h6>₹{tax.toLocaleString()}.00</h6>
            </div>
          </div>
          <hr/>
          <div className='d-flex justify-content-between'>
            <h5 className='fw-bold'>Total</h5>
            <h5 className='fw-bold'>₹{totalPrice.toLocaleString()}.00</h5>
          </div>
          <div className='mt-2 d-flex justify-content-center'>
            <button className='rounded mb-2 btn w-100 primary-btn' disabled={cart.length===0} onClick={() => navigate("/order", {state: {totalPrice, cart}})}>Proceed to Checkout</button>
          </div>
          </div>
      </div>
      ) : ("")}
      </div>
      <Footer/>
    </div>
  )
}
