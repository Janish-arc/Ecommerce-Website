import React, { useEffect, useState } from 'react'
import { PageTitle } from '../Components/PageTitle'
import { Navbar } from '../Components/Navbar'
import { Footer } from '../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct, removeErrors } from '../Redux/productSlicer'
import toast from 'react-hot-toast'
import { PackageIcon } from 'lucide-react'
import { Product } from '../Components/Product'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader } from '../Components/Loader'
import { Pagination } from '../Redux/Pagination'
import { getCategory } from '../Redux/categorySLice'

export const Products = () => {

  const {products, productsCount, loading, error, productsPerPage} = useSelector((state) => state.product)
  const {categories} = useSelector((state) => state.category)
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get("keyword") || ""
  const category = searchParams.get("category") || ""
  const pageNoUrl = parseInt(searchParams.get("page"), 10) || 1
  const [currentPage, setCurrentPage] = useState(pageNoUrl)
  const totalPages = Math.ceil(productsCount / (productsPerPage || 6))
  const navigate = useNavigate()
  const [sort, setSort] = useState("")

//   const categories = [
//   { name: "All"},
//   { name: "Mobile Phones", img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb" },
//   { name: "Laptops and Computers", img: "https://images.unsplash.com/photo-1763162139130-240507e9fad5" },
//   { name: "Audio Devices", img: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf" },
//   { name: "Gaming and Consoles", img: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf" },
//   { name: "Home Entertainment", img: "https://images.unsplash.com/photo-1643208589889-0735ad7218f0" },
//   { name: "Cameras", img: "https://images.unsplash.com/photo-1542328457-f450cab675c5" },
//   { name: "Smart Wearables", img: "https://images.unsplash.com/photo-1575125069494-6a0c5819d340" },
//   { name: "Computer Peripherals", img: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a" },
//   { name: "Smart Home Devices", img: "https://images.unsplash.com/photo-1462392435449-542c64fd805d" },
//   { name: "Electronic Accessories", img: "https://images.unsplash.com/photo-1596207891316-23851be3cc20" },
//   { name: "Printers", img: "https://images.unsplash.com/photo-1708793699492-5fa208f52dcb"}
// ]

  const handlePageChange = (pageNumber) => {
    if(pageNumber != currentPage){
      setCurrentPage(pageNumber)
      const newSearchParams = new URLSearchParams(location.search)
      if(pageNumber == 1){
        newSearchParams.delete("page")
      }
      else{
        newSearchParams.set("page", pageNumber)
      }
      navigate(`?${newSearchParams.toString()}`)
    }
  }

  const handleCategory = (cat) => {
    setCurrentPage(1)
    const newSearchParams = new URLSearchParams(location.search)
    newSearchParams.delete("page")
    if(cat !== "All"){
      newSearchParams.set("category",cat)
    }
    if(cat == "All"){
      newSearchParams.delete("category")
    }
    console.log(newSearchParams.toString())
    navigate(`?${newSearchParams.toString()}`)
  }

  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage, category, sort }))

    // 👇 remove keyword from URL after using it
    if (keyword) {
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete("keyword")

      navigate(`?${newSearchParams.toString()}`, { replace: true })
    }

  }, [dispatch, keyword, currentPage, category, sort])

  useEffect(() => {
    if(error) {
      toast.error(error.message)
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  useEffect(() => {
    dispatch(getCategory())
  }, [dispatch])

  return loading ? (<Loader/>) : (
    <>
    <PageTitle title = "Products | Circuit-Store"/>
    <div className='d-flex flex-column min-vh-100' >
      <div className="position-fixed w-100" style={{marginTop:'0px', paddingTop:"0px", zIndex:"50"}}>
          <Navbar/>
      </div>
      <ul className='text-white category-scroll ms-2 p-2 mt-5 d-flex list-unstyled shadow rounded'>
          {(categories || [] ).map((cat) => (
            <li className="p-1 ms-1 " key={cat._id}>
              <button onClick={() => handleCategory(cat._id)} className={`category-btn ${category === cat._id ? "active-cat" : ""}` } style={{ marginTop:"20px"}}>
                {cat.name === "All" ? (<PackageIcon size={60}/>) : (<img className='rounded category-img mt-0' src={cat.image?.url} alt={cat.name} style={{width:"100%", height:"80px", objectFit:"cover"}}/>)} <p>{cat.name}</p>
              </button>
            </li>
          ))}
        </ul>
      <main className='flex-fill container mt-3'>
        <div className='row  gx-5'>
        <div className='col-12 col-lg-3 gap-2' >
        {/* <div className='p-2 px-3 shadow' style={{backgroundColor:"white", borderRadius:"8px", top:"10%", position:"sticky"}}>
          <h3 className='border-bottom border-warning border-3 pb-2'>Categories</h3>
          
        </div> */}
        </div>
        <div className=' mt-4 rounded pt-3 mb-3 shadow bg-white'>
          <div className=' d-flex justify-content-between'>
                <div> <h3 >Our Products</h3> </div>
                <div>
                  
                  <select className='form-select sort-dropdown mx-2'
                    onChange={(e)=>{
                      setSort(e.target.value)
                      setCurrentPage(1)
                    }}>
                    <option value={""} >Sort By</option>
                    <option value={"asc_price"}>Price low to high</option>
                    <option value={"desc_price"}>Price high to low</option>
                    <option value={"newest"}>Newest</option>
                    <option value={"rating"}>User rating</option>
                  </select>
                </div>
                <div className='d-none d-md-block' style={{color:"white"}}><PackageIcon/> {products?.length || 0} products found</div>
              </div>
              {products.length > 0 ? (
                <div className='row pt-3 justify-content-center'>
                {products && products.map((product) => 
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={product._id}>
                    <Product product={product}/>
                </div>
                )}
              </div>
              ) : (<div className='d-flex justify-content-center text-white' style={{marginTop:"15%"}}>No Products Found</div>)}
              
        </div>
        
        <div className='text-center mb-3'>
         <Pagination onPageChange={handlePageChange} totalPages={totalPages} currentPage={currentPage}/>
        </div>
        </div>
      </main>
      <Footer/>
    </div>
    </>
  )
}
