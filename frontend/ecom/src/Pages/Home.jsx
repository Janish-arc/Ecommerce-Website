import React, { useEffect } from 'react'
import { Navbar } from '../Components/Navbar'
import { ImageSlider } from '../Components/ImageSlider'
import { Footer } from '../Components/Footer'
import { Product } from '../Components/Product'
import { PageTitle } from '../Components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct, latestProduct, removeErrors } from '../Redux/productSlicer'
import { Loader } from '../Components/Loader'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'


// const products = [
//     {
//       "_id": "69996fb8d996b970caeef1b8",
//       "name": "iPhone 15 Pro",
//       "description": "Apple smartphone 128GB storage",
//       "price": 134900,
//       "image": [
//         {
//           "public_id": "prod-101",
//           "url": "https://images.pexels.com/photos/1647978/pexels-photo-1647978.jpeg",
//           "_id": "69996fb8d996b970caeef1b9"
//         }
//       ],
//       "category": "Electronics",
//       "rating": 3.5,
//       "stock": 23,
//       "noOfReviews": 198,
//       "createdAt": "2026-02-21T08:08:51.000Z",
//       "reviews": [],
//       "__v": 0
//     },
//     {
//       "_id": "69996fb8d996b970caeef1bc",
//       "name": "Sony Headphones",
//       "description": "Wireless over-ear headphones",
//       "price": 29990,
//       "image": [
//         {
//           "public_id": "prod-103",
//           "url": "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
//           "_id": "69996fb8d996b970caeef1bd"
//         }
//       ],
//       "category": "Electronics",
//       "rating": 4,
//       "stock": 58,
//       "noOfReviews": 118,
//       "createdAt": "2026-02-21T08:08:51.000Z",
//       "reviews": [],
//       "__v": 0
//     },
//     {
//       "_id": "69996fb8d996b970caeef1ba",
//       "name": "Samsung Galaxy S24",
//       "description": "Samsung flagship smartphone",
//       "price": 89999,
//       "image": [
//         {
//           "public_id": "prod-102",
//           "url": "https://images.pexels.com/photos/16149966/pexels-photo-16149966.jpeg",
//           "_id": "69996fb8d996b970caeef1bb"
//         }
//       ],
//       "category": "Electronics",
//       "rating": 5,
//       "stock": 40,
//       "noOfReviews": 56,
//       "createdAt": "2026-02-21T08:08:51.000Z",
//       "reviews": [],
//       "__v": 0
//     },
//     {
//       "_id": "69996fb8d996b970caeef1c2",
//       "name": "Boat Rockerz 450",
//       "description": "Wireless Bluetooth headphones",
//       "price": 1499,
//       "image": [
//         {
//           "public_id": "prod-106",
//           "url": "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg",
//           "_id": "69996fb8d996b970caeef1c3"
//         }
//       ],
//       "category": "Electronics",
//       "rating": 3,
//       "stock": 100,
//       "noOfReviews": 208,
//       "createdAt": "2026-02-21T08:08:51.000Z",
//       "reviews": [],
//       "__v": 0
//     },
//     {
//       "_id": "69996fb8d996b970caeef1c4",
//       "name": "OnePlus 12",
//       "description": "Snapdragon processor & 256GB storage",
//       "price": 64999,
//       "image": [
//         {
//           "public_id": "prod-201",
//           "url": "https://images.pexels.com/photos/33210189/pexels-photo-33210189.jpeg",
//           "_id": "69996fb8d996b970caeef1c5"
//         }
//       ],
//       "category": "Electronics",
//       "rating": 2,
//       "stock": 35,
//       "noOfReviews": 120,
//       "createdAt": "2026-02-21T08:08:51.000Z",
//       "reviews": [],
//       "__v": 0
//     }
//   ]
  
 export  const Home = () => {

  const {products, productsCount, loading, error} = useSelector((state) => state.product)
  const dispatch = useDispatch();
  // const [searchParams] = useSearchParams()
  // const keyword = searchParams.get("keyword") || ""
  

  useEffect (() => {
    dispatch(getProduct({keyword: ""}))
  }, [dispatch])

  useEffect (() => {
    dispatch(latestProduct())
  },[dispatch])

  useEffect(() => {
    if(error) {
      toast.error(error.message)
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  return loading ? (<Loader/>) :(
    <div>
    <PageTitle title = "Home | Circuit-Store"/>
    <div className="position-fixed w-100" style={{marginTop:'0px', paddingTop:"0px", zIndex:"50"}}>
        <Navbar/>
    </div>
    <div className='pt-5'>
      <ImageSlider/>
    </div>  
    <div className='pb-5 bg-white'>
      <h4 className='fw-bold pt-5 pb-3 fs-3 text-center' style={{color:"#0071E3"}}>
        Latest Products
      </h4>
      <div className='container shadow mt-2 p-4 rounded bg-white'>
          <div className='row g-4'>
              {products.map((product, index) => (
                <div className='col-12 col-sm-6 col-md-4 col-lg-3 justify-content-center' key={index} >
                <Product product={product} />
                </div>
                ))}
          </div>
        
     
      </div>
    </div>
    
    <Footer/>
    </div>
  )
}
