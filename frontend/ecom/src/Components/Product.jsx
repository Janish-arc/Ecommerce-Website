import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Rating } from './Rating'
import axios from 'axios'
import toast from 'react-hot-toast'
import { discount } from './Format'

export const Product = ({product}) => {

    const addToCartHandler = async(productId) => {
        try{
            await axios.post("/api/v1/cart/addProduct", {
                productId, 
                quantity: 1
            },{
                withCredentials: true
            })
                toast.success("Product added to cart successfully")
        }catch(error){
            toast.error("Please login to access.")
        }
  }

    const [rating, setRating] = useState(0)
  return (
    <div >
        <div className='card cardy p-0' style={{ backgroundColor:'white'}}>
        <div>
            <Link to={`/product/${product._id}`} style={{textDecoration:'none'}}>
        <div className='d-flex justify-content-center overflow-hidden img-cont position-relative'>
            <img className="img-fluid product-image card-img-top rounded" src={product.image[0].url } loading='lazy'/>
            <p className='position-absolute bg-white text-black rounded m-0 p-1' style={{bottom: "10px", right:"10px", fontSize:"10px"}}>{discount (product?.MRP, product?.price)}% OFF</p>
        </div>
        <div className='text-black ps-3 mt-1 '>
            <h6>{product.name}</h6>
            <span className="m-0 text-truncate" style={{display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "14px"}}>{product.description}</span>
        </div>
        </Link>
        <div className='px-3 pb-2 justify-content-between d-flex-row'>
            
            <div className='align-items-center d-flex flex-row flex-md-column flex-xl-row gap-1 d-flex '>
                <Rating value={product.rating} onRatingChange = {(r) => setRating(r)}/>
                 <small className='text-muted text-nowrap mt-1'>({product.noOfReviews})</small>
            </div>
            <div className='d-flex justify-content-between align-items-center pt-1 pb-0'>
                <p className='text-black fw-semibold m-0 mb-2'>₹{product.price.toLocaleString()}</p>
                {/* <button className='btn primary-btn btn-sm  w-100  mb-2 me-2'>Buy</button> */}
                <button onClick={() => addToCartHandler(product._id)} className='btn primary-btn btn-sm  mb-2 me-2' disabled={product?.stock === 0}> {product?.stock === 0 ? "Out of Stock" : "Add to Cart"}</button>    
            </div>         
            </div>
            
        </div>
    </div>
    </div>
    
  )
}
