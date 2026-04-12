import React, { useEffect, useState } from 'react'
import { Navbar } from '../Components/Navbar'
import { Footer } from '../Components/Footer'
import { Rating } from '../Components/Rating'
import { Calendar, MessageSquare, Minus, PackageIcon, Plus, ShoppingCart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductDetails, removeErrors, review } from '../Redux/productSlicer'
import toast from 'react-hot-toast'
import { PageTitle } from '../Components/PageTitle'
import {discount, formatDate} from '../Components/Format'
import axios from 'axios'

export const ProductDetails = () => {

    const [reviews , setReviews] = useState(0)
    const [reviewMsg, setReviewMsg] = useState("")
    const [mainImage, setMainImage] = useState("")
    const {isAuthenticated} = useSelector((state) => state.user)
    const {product, loading, error, review: reviewState} = useSelector((state) => state.product)
    const [quantity, setQuantity] = useState(1)
    // console.log("Redux:", product)
    const {id} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const productId = product?._id
    const price = product?.price
    const Name = product?.name
    const Ddescription = product?.detailedDescription
    const Stock = product?.stock
    const proImage = product?.image[0]?.url
    const totalPrice = (price || 0)* quantity
    // console.log("ID from params:", id)
    // console.log("Full state:", useSelector(state => state.product))

    useEffect(() => {
        if(id){
           dispatch(getProductDetails(id))
        }
    }, [dispatch,id])

    useEffect(() => {
        if(error){
            toast.error(error.message)
            dispatch(removeErrors())
        }
    }, [dispatch, error])

const postedReview = () => {
    dispatch(review({
        rating: reviews,
        comment: reviewMsg,
        productId: id
    }))
    dispatch(getProductDetails(id))  // 🔥 refresh product
    setReviewMsg("")
    setReviews(0)
}
    const addToCartHandler = async(productId) => {
        try{
            await axios.post("/api/v1/cart/addProduct", {
                productId, 
                quantity: quantity
            },{
                withCredentials: true
            })
                toast.success("Product added to cart successfully")
        }catch(error){
            toast.error("Please login to access.")
        }
    }

    const increaseQuantity = () => {
        if(quantity >= product?.stock) return
            setQuantity(prev => prev+1)
    }
    
    const decreaseQuantity = () => {
        if(quantity <= 1) return
            setQuantity(prev => prev-1) 
    }

    useEffect(() => {
        if(product?.image?.length > 0){
            setMainImage(product?.image[0]?.url)
        }
    }, [product])
if(!isAuthenticated){
  return (
    <div className="text-center " style={{marginTop:"22%"}}>
      <h3>Please login to view this product</h3>
      <button className='btn primary-btn btn-lg mt-3' onClick={() => navigate("/login")}>Login</button>
    </div>
  )
}
  return (
    <div>
        <PageTitle title={`${product?.name} | Details`}/>
        <div className="position-fixed w-100" style={{marginTop:'0px', paddingTop:"0px", zIndex:"50"}}>
                <Navbar/>
            </div> 
        <main className="container p-4 p-md-5" >
            <div className='row g-0 mt-5'>
                <div className="col-12 col-lg-6 img-fluid d-flex pb-2 justify-content-center overflow-hidden">
                    <div className='d-flex flex-column gap-4'>
                    <div className='ratio ratio-1x1 img-cont mt-5 p-5' style={{ maxWidth: "400px" , minWidth:"400px"}} >
                        <img className='rounded' style={{objectFit:"contain"}} title={product?.name} 
                        src={mainImage || product?.image?.[0]?.url } alt={product?.name} />
                    </div>
                    <div className='d-flex gap-2 justify-content-center'>
                        {product?.image?.map((img, i) => (
                            <img key={i} src={img?.url} onClick={() => setMainImage(img?.url)}
                            style={{width:"100px", height:"100px", borderRadius:"12px", objectFit:"cover", cursor:"pointer"}}/>
                        ))}
                    </div>
                    </div>
                </div>
                <div className=' col-12 col-lg-6 p-4 product-card rounded mt-4 text-black shadow' >
                    <h3 className='m-0'>{product?.name}</h3>
                    <Rating value={product?.rating} disabled={true}/>
                    <span className=' m-0'>({product?.noOfReviews})</span>
                    <div className='m-0'>{product?.description}</div>
                <div className='mt-2'>
                    <div className='d-flex align-items-center'>
                        <div className='fs-3 fw-semibold' style={{color:'#0071E3'}}>₹{price} </div>
                        {product?.MRP && <div>
                        <del className='text-secondary ms-2' style={{fontSize:"13px"}}>M.R.P {product?.MRP}</del>
                        <span className='ps-1 fw-semibold' style={{fontSize:"17px", color:"#22C55E"}}>({discount (product?.MRP, product?.price)}% OFF)</span>
                        </div> 
                        } 
                        </div>
                    <p className='fs-6 fw-semibold'>{product?.detailedDescription}</p>
                </div>
                <div className='d-flex align-items-center'>
                    {product?.stock >1 ?
                    <>
                    <PackageIcon size={28} className='text-success me-2'/>
                    <span className='fw-semibold text-success fs-5'> In-Stock</span><span className='fw-semibold ms-1 fs-6 text-muted'>({product?.stock} available)</span>
                    </> : <>
                     <PackageIcon size={28} className='me-2'/>
                    <span className='fw-semiboldfs-5'> Out of Stock</span>
                    </>}
                </div>
                {product?.stock && 
                <div className='d-flex gap-3 mt-3 align-items-center flex-column flex-lg-row'>
                    <div className='mt-3 ms-2 d-flex align-items-center justify-content-center border border-danger border-3 rounded-pill' style={{backgroundColor:"rgb(241, 244, 247)", width:'150px', height:'30px'}}>
                    <button className='btn btn-white mx-3 stockin' disabled={quantity <= 1} onClick={decreaseQuantity}><Minus size={17}/></button>
                    <span>{quantity}</span>
                    <button className='btn btn-white mx-3 stockin' disabled={quantity >= product?.stock} onClick={increaseQuantity}><Plus size={17}/></button>
                </div>
                <div className='mt-3 cart d-flex gap-2'>
                    <button className='btn primary-btn' style={{fontSize:'17px', fontWeight:'600'}} onClick={() => addToCartHandler(product._id)}> <ShoppingCart size={25}/> Add to cart</button>
                    <button className='btn primary-btn' onClick={() => navigate("/order", {state: {price, totalPrice, Name, Ddescription, quantity, proImage, productId}})}>Buy now</button>
                </div>
                </div>
                }
                <div className=' p-4 rounded mt-3 border border-none review-box'>
                    <h4 className='fw-bold '> <MessageSquare className="mb-1 me-1"  size={20}/> SHARE YOUR REVIEW</h4>
                    <span className="star ">  <Rating  value={0} disabled={false} onRatingChange={(r) => setReviews(r)}/></span>
                    <textarea className='text w-100 mt-2 rounded border-0' style={{backgroundColor:"white", height:"80px"}} placeholder='Enter your feedback here' value={reviewMsg} onChange={(e) => setReviewMsg(e.target.value)}></textarea>
                    <button className='btn primary-btn w-100' onClick={postedReview}>Post Review</button>
                </div>
                </div>
                {product?.reviews.length > 0 &&
                <section className='rounded px-4 pb-4 shadow' style={{marginTop:"60px"}}>
                    <div>
                    <div className='border-start border-5 border-warning mb-4 mt-4'>
                        <h4 className='ms-2'>Customer Reviews</h4>
                        </div>
                        <div className='row g-5 px-4' >
                            {product?.reviews?.map((rev, index) => (
                                <div key={rev._id} className='col-12 col-lg-6'>
                                <div className='bg-white rounded p-2 overflow-auto cardy shadow' style={{backgroundColor:" #F8FAFC", height:"120px"}} key={index}>
                                    <div className='d-flex position-relative'>
                                        <div>
                                            <img style={{height:'60px', width:'60px'}} className='rounded-circle ms-2' src={rev?.avatar}/>
                                        </div> 
                                        <div className='ms-2 me-5'>
                                            <h5 className='text-black ms-2'>{rev?.name}</h5>
                                            <Rating value={rev?.rating} disabled={true}/>
                                        </div> 
                                        <div className='position-absolute fw-semibold d-flex align-items-center gap-1' style={{top:'0px', right:'10px',fontSize:"19px"}}>
                                            <span className='text-warning mb-2'><Calendar/></span>{formatDate(rev?.createdAt)} 
                                        </div>
                                         
                                    </div>
                                    <div className='w-100'>{rev?.comment}</div>
                                    </div>
                                    
                                </div>
                            ))}
                    </div>
                </div>
                
                </section>
}
            </div>
        </main>
        <Footer/>
    </div>
  )
}
