import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { adminProducts, deleteProducts } from '../Redux/productSlicer'
import { formatDate } from '../Components/Format'
import { addProduct, editProduct, resetProductState } from '../Redux/adminSlice'
import { addCategory, deleteCategory, editCategory, getCategory } from '../Redux/categorySLice'
import { PageTitle } from '../Components/PageTitle'
import { Search } from 'lucide-react'
import { Pagination } from '../Redux/Pagination'
import toast from 'react-hot-toast'

export const AdminProduct = () => {
  const [preview, setPreview] = useState("https://cdn-icons-png.flaticon.com/512/3081/3081559.png")
  const [preview1, setPreview1] = useState("https://cdn-icons-png.flaticon.com/512/3144/3144456.png")
  const [preview2, setPreview2] = useState("https://cdn-icons-png.flaticon.com/512/3144/3144456.png")
  const [preview3, setPreview3] = useState("https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500")
  const {categories, categoryCount} = useSelector((state) => state.category)
  const {Products, success} = useSelector((state) => state.admin)
  const {products, productsCount, productsPerPage, totalPages} = useSelector((state) => state.product)
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get("keyword") || ""
  const pageNoUrl = parseInt(searchParams.get("page"), 10) || 1
  const [currentPage, setCurrentPage] = useState(pageNoUrl)
      const {section}= useParams()
      const dispatch = useDispatch()
      const navigate = useNavigate()

      // const categories = [
      //   "Mobile Phones",
      //   "Laptops and Computers",
      //   "Audio Devices",
      //   "Gaming and Consoles",
      //   "Home Entertainment",
      //   "Cameras",
      //   "Smart Wearables",
      //   "Computer Peripherals",
      //   "Smart Home Devices",
      //   "Electronic Accessories"
      // ]

      const [name, setName] = useState("")
      const [price, setPrice] = useState("")
      const [MRP, setMRP] = useState("")
      const [description, setDescription] = useState("")
      const [detailedDescription, setDetailedDescription] = useState("")
      const [stock, setStock] = useState("")
      const [category, setCategory] = useState("")
      const [image, setImage] = useState("")
      const [categoryName, setCategoryName] = useState("")
      const [categoryImage, setCategoryImage] = useState("")
      const [editName, setEditName] = useState("")
      const [editImage, setEditImage] = useState("")
      const [editCatId, setEditCatId] = useState("")
      const [search, setSearch] = useState("")
      const [showModal, setShowModal] = useState(false)
      const [productId, setProductId] = useState("")
      const [productName, setProductName] = useState("")
      const [productPrice, setProductPrice] = useState("")
      const [productDescription, setProductDescription] = useState("")
      const [productDetDescription, setProductDetDescription] = useState("")
      const [productStock, setProductStock] = useState("")
      const [productCategory, setProductCategory] = useState("")
      const [productImage, setProductImage] = useState("")

      const setAsDefault = (index) => {
        const newArr = [...productImage]
        const [selected] = newArr.splice(index, 1)
        newArr.unshift(selected)

        setProductImage(newArr)
        setPreview3(newArr[0]) // update main preview
      }

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

      const handleSearch = (e) => {
        e.preventDefault()
        if(search.trim()){
          navigate(`/admin/product/allproduct?keyword=${encodeURIComponent(search.trim())}`)
        }
        else{
          navigate(`/admin/product/allproduct`)
        }
        setSearch(" ")
      }

      const submitHandler = (e) => {
        e.preventDefault();
        const productData = {
        name, price, MRP, description, detailedDescription, stock, category, image
      }
      dispatch(addProduct(productData))
      }

      const updateCategory = (e) => {
        e.preventDefault()
        const categoryData = {"name": editName}
            if (editImage) {
            categoryData.image = editImage
            }
        dispatch(editCategory({ id: editCatId, categoryData}))
        cancelEdit()
      }

      const handleImage = (e) => {
        if (!e.target.files || e.target.files.length === 0) return
        const files = Array.from(e.target.files)
        if (files.length > 4) {
          alert("Max 4 images only")
          return
        }
        const images = []
        files.forEach(file => {
          const reader = new FileReader()
          reader.onload = () => {
            if (reader.readyState === 2) {
              images.push(reader.result)
              if (images.length === files.length) {
                setImage(images)
              }
            }
          }
          console.log(e.target.files)
          reader.readAsDataURL(file)
        })
      }

      const handleCategoryImage= (e) => {
        const reader = new FileReader()
        reader.onload = () => {
          if(reader.readyState == 2){
            setPreview1(reader.result)
            setCategoryImage(reader.result)
          }
        }
        reader.readAsDataURL(e.target.files[0])
      }
      
      const handleEditCatImage = (e) => {
        const reader = new FileReader()
        reader.onload = () => {
          if(reader.readyState === 2){
            setPreview2(reader.result)
            setEditImage(reader.result)
          }
        }
        reader.readAsDataURL(e.target.files[0])
      }

      const handleProductImage = (e) => {
        const files = Array.from(e.target.files)
        if(files.length > 4){
          alert("Max 4 images only")
          return
        }
        const images = new Array(files.length)
        files.forEach((file, index) => {
        const reader = new FileReader()
          reader.onload = () => {
            if(reader.readyState === 2){
              images[index] = reader.result
            }
            if(images.length === files.length){
              setProductImage(images)
              setPreview3(images[0])
            }
          }
          reader.readAsDataURL(file)
          })
      }

      const updateProduct = () => {
        const editProductData = {
          name: productName,
          price: productPrice,
          description: productDescription,
          detailedDescription: productDetDescription,
          stock: productStock,
          category: productCategory,
        }
        if (productImage) {
          editProductData.image = productImage
        }
        dispatch(editProduct({id: productId, editProductData}))
        toast.success("Product data updated successfully")
        setShowModal(false)
       
      }

      const submitCategory = (e) => {
        e.preventDefault();
        const categoryData = {"name": categoryName, "image": categoryImage}
        dispatch(addCategory(categoryData))
      }

      const categoryEdit = (cat) => {
        setEditCatId(cat._id);
        setEditName(cat.name);
        setPreview2(cat.image?.url);
        setEditImage(cat.image?.url)  
      }

      const cancelEdit = () => {
        setEditCatId(null);
        setEditName("");
        setEditImage("");
        setPreview2("https://cdn-icons-png.flaticon.com/512/3144/3144456.png");
      }

      useEffect(() => {
          if(section){
              const element = document.getElementById(section)
              element?.scrollIntoView({behavior:"smooth"})
          }
      }, [section])

      useEffect(() => {
        dispatch(adminProducts({keyword, page: currentPage}))
        dispatch(getCategory())
      }, [dispatch, keyword, currentPage])

      // useEffect(() => {
      //   dispatch(getCategory())
      // }, [dispatch])

      const Categorydelete = (id) => {
        toast.success("Category deleted")
        dispatch(deleteCategory(id))
      }
    
    const handleDelete = (id) => {
      toast.success("Product deleted")
        dispatch(deleteProducts(id))
    }

    useEffect(() => {
      setCurrentPage(1)
    }, [keyword])

    useEffect(() => {
  if (success) {
    dispatch(adminProducts({ keyword, page: currentPage }))
    dispatch(resetProductState())
  }
}, [success, dispatch, keyword, currentPage])

  return (
    <div className="container-fluid p-0 vh-100 d-flex flex-column flex-lg-row">
      <PageTitle title="Admin-Products | Circuit Store"/>
      <div>
        <Sidebar/>
      </div>
      <div className='col-12 col-lg-9 p-2 main-content'>
      <div>
        {/* All Products */}
        <div className="shadow-lg p-1 rounded">
          <div  className="p-4 d-flex justify-content-between align-items-center ms-auto" style={{background: "linear-gradient(to right, #1f2937, #31507b)", color: "white", textTransform: "uppercase"}} id="allproduct">
             <h6>All Products</h6>
             <div className='d-flex gap-2'>
              <form onSubmit={handleSearch}  className='d-flex position-relative '>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} type='text' placeholder='Search Products' className='form-control px-3 '/>
                <button type='submit' onClick={() => navigate(`?keyword=${search}`)} className='position-absolute text-black border bg-white border-none' style={{top:"5px", right:"12px"}}><Search size={20}/></button>
              </form>   
              <button onClick={() => navigate("")} className='btn btn-danger'>Clear</button> 
             </div>                      
          </div>
          <div className="table-responsive category-scroll">
            <table className="table admin-table ">
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Product Id</th>
                  <th>Product Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Added Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products?.map((product, index) => (
                  <tr key={product._id} className="align-middle">
                    <td>#{product._id.slice(-5).toUpperCase()}</td>
                    <td className="text-truncate" style={{maxWidth:"120px"}}>
                      {product._id}
                    </td>
                    <td>
                        <img  className='rounded' src={product?.image[0]?.url} style={{width:"100px", height:"100px", objectFit:"cover"}}/>                  
                    </td>
                    <td className="text-truncate" style={{maxWidth:"150px"}}>{product.name}</td>
                    <td>₹{product.price.toLocaleString()}</td>
                    <td>{ categories?.find(cat => cat._id === product.category)?.name || "N/A"}</td>
                    <td>
                      <span className={product.stock < 5 ? "text-danger" : "text-success"}>
                        {product.stock}
                      </span>
                    </td>
                    <td >{formatDate(product.createdAt)}</td>
                    <td>
                      <div className="d-flex flex-column align-items-center gap-2">
                        <button className="btn btn-warning w-100"
                         onClick={() => {setShowModal(true) 
                                        setProductId(product._id)
                                        setProductName(product.name)
                                        setProductPrice(product.price)
                                        setProductDescription(product.description)
                                        setProductDetDescription(product.detailedDescription)
                                        setProductCategory(product.category?._id || product.category)
                                        const imgs = product.image.map(img => img.url)
                                          setProductImage(imgs)
                                          setPreview3(imgs[0]) 
                                        setProductStock(product.stock)
                                        }} >Edit</button>
                        <button className="btn btn-danger text-white w-100" onClick={() => handleDelete(product._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>  

        {/* Edit Product */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            
            <div 
              className="modal-box d-flex flex-column"
              onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
            >
              <h3 className='text-center mb-3'>Edit Product</h3> 
              <form className='row g-2'>
                <div className='col-12'>
                  <label className='form-label'>Product Name</label>
                  <input className='form-control' name='editname' value={productName}
                  onChange={(e) => setProductName(e.target.value)}/>
                </div>                
                <div className='col-12'>
                  <label className='form-label'>Product description</label>
                  <input className='form-control' name='editDescription' value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}/>
                </div>
                <div className='col-12'>
                  <label className='form-label'>Detailed description</label>
                  <input className='form-control' name='editDetailedDescription' value={productDetDescription}
                  onChange={(e) => setProductDetDescription(e.target.value)}/>
                </div>      
                <div className='col-6'>
                  <label className='form-label'>Product price</label>
                  <input className='form-control' name='editPrice' value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}/>
                </div>                          
                <div className='col-6'>
                  <label className='form-label'>Stock</label>
                  <input className='form-control' name='editStock' value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}/>
                </div>
                <div className='col-6 '>
                  <label className='form-label'>Category</label>
                  <select className='w-100 rounded border' name='editCategory' value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat?.name}
                      </option>                 
                    ))}
                  </select>
                </div>
                <div className='col-12 gap-2 d-flex align-items-center'>
                  <div className="d-flex gap-2 flex-wrap">
                    {Array.isArray(productImage) && productImage.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        onClick={() => setAsDefault(i)} // 🔥 THIS LINE
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          cursor: "pointer",
                          border: i === 0 ? "2px solid blue" : "1px solid #ccc",
                          borderRadius: "6px"
                        }}
                      />
                    ))}
                  </div>
                  <input type='file' className='custom-file-input' multiple  name='editImage' accept='image/*' onChange={handleProductImage}/>
                </div>
              </form>
              <div className='d-flex gap-2 ms-auto' style={{ marginTop: "10px" }}>
                <button className='btn rounded primary-btn' onClick={() => updateProduct()}>Update</button>
                <button className="btn btn-danger rounded fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
              </div>

            </div>

          </div>
        )}

        <div className='text-center mt-4 mb-3'>
            <Pagination onPageChange={handlePageChange} totalPages={totalPages} currentPage={currentPage}/>
        </div>
        
        {/* Add New Product */}
        <div className='shadow-lg p-1 rounded'>
          <h6 className='p-4 my-3' style={{ background: "linear-gradient(to right, #1f2937, #31507b)", color:"white", textTransform:"uppercase" }}id='addproduct'>Add Product</h6>
          <div >
            <form onSubmit={submitHandler} className='gap-2 d-flex flex-column'>
              <div className='d-flex justify-content-around w-100'>
                <h5 className='w-50 ms-5'>Product Name</h5>
                <input
                className='w-50 me-5  rounded border'
                type='text'
                placeholder='Enter product name'
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}/>
              </div>
              <div className='d-flex justify-content-center w-100'>
                <h5 className='w-50 ms-5'>MRP</h5>
                <input
                className='w-50 me-5  rounded border'
                type='Number'
                placeholder='Enter product MRP'
                name='MRP'
                value={MRP}
                onChange={(e) => setMRP(e.target.value)}/>
              </div>
              <div className='d-flex justify-content-center w-100'>
                <h5 className='w-50 ms-5'>Discounted Price</h5>
                <input
                className='w-50 me-5  rounded border'
                type='Number'
                placeholder='Enter product price'
                name='price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}/>
              </div>
              <div className='d-flex justify-content-center w-100'>
                <h5 className='w-50 ms-5'>Description</h5>
                <input
                className='w-50 me-5 rounded border'
                type='text'
                placeholder='Enter product description'
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}/>
              </div>
              <div className='d-flex justify-content-center w-100'>
                <h5 className='w-50 ms-5'>Detailed description</h5>
                <textarea
                className='w-50 me-5 rounded border'
                type='text'
                placeholder='Enter product detailed description'
                name='detailedDescription'
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}/>
              </div>
              <div className='d-flex justify-content-center w-100'>
                <h5 className='w-50 ms-5'>Category</h5>
                <select className='form-select w-50 me-5' value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className='d-flex justify-content-center w-100'>
                <h5 className='w-50 ms-5 '>Stock</h5>
                <input
                className='w-50 me-5 rounded border'
                type='Number'
                placeholder='Stock Available'
                name='stock'
                value={stock}
                onChange={(e) => setStock(e.target.value)}/>
              </div>
              <div className='d-flex flex-column flex-sm-row gap-2 my-2 justify-content-between w-100'>
                <div className='d-flex ms-5 gap-2 align-items-center'>
                <img src={preview} style={{height:"40px", width:"40px"}}/>
                <input
                type='file' className='custom-file-input'
                multiple
                name='image'
                accept='image/*'
                onChange={handleImage}/>
              </div>
              <div className='me-5 ms-auto'>
                <button type='submit' className='btn primary-btn'>Add Product</button>
              </div>
              </div>
              
            </form>
          </div>
        </div>

        {/* Category */}
        <div className='shadow-lg p-1 rounded'>
          <h6 className='p-4 my-3' style={{ background: "linear-gradient(to right, #1f2937, #31507b)", color:"white", textTransform:"uppercase" }} id='category'>Categories</h6>
          <div className='d-flex gap-2 flex-column flex-md-row'>
            <div className='col-12 col-md-6 overflow-x-auto category-scroll'>
              <table className='admin-table'>
              <thead>
                <tr>
                  <td>S.no</td>
                  <td>Image</td>
                  <td>Category Name</td>
                  <td>No. of Products</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat._id}>
                  <td>{index+1}</td>
                  <td>{<img src={cat?.image?.url} style={{width:"100px", height:"100px", objectFit:"cover"}}/>}</td>
                  <td>{cat?.name}</td>
                  <td>{cat?.productCount}</td>
                  <td>
                     <div className="d-flex flex-column align-items-center gap-2">
                        <button className="btn btn-warning w-100" onClick={() => categoryEdit(cat)}>Edit</button>
                        <button className="btn btn-danger text-white w-100" onClick={() => Categorydelete(cat._id)}>Delete</button>
                      </div>
                  </td>
                </tr>
                ))}  
              </tbody>
            </table>
            </div>


        <div className='col-12 col-md-6 pe-2 d-flex flex-column gap-4'>
        {/* Add Category */}
        <form onSubmit={submitCategory} className='shadow rounded pb-4'>
          <h6
            className='p-4 rounded-top'
            style={{
              background: "linear-gradient(to right, #1f2937, #31507b)",
              color: "white",
              textTransform: "uppercase"
            }}
          >
            Add Category
          </h6>
          <div className="px-4 d-flex flex-column gap-3">
            {/* Category Name */}
            <div className="d-flex align-items-center gap-3">
              <label className="fw-semibold w-25">Category Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Add new category"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            {/* Category Image */}
            <div className="d-flex align-items-center gap-3">
              <label className="fw-semibold w-25">Category Image</label>

              <div className="d-flex align-items-center gap-2">
                <img 
                  src={preview1}
                  style={{ height: "40px", width: "40px", objectFit: "cover" }}
                />
                <input
                  type="file"
                  className="custom-file-input"
                  name="image"
                  accept="image/*"
                  onChange={handleCategoryImage}
                />
              </div>
            </div>

            {/* Button */}
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn primary-btn px-4">
                Add Category
              </button>
            </div>

          </div>
        </form>

         {/* Edit Category */}
        {editCatId &&  
        <div className='shadow rounded pb-4'>
          <h6
            className='p-4 rounded-top'
            style={{
              background: "linear-gradient(to right, #1f2937, #31507b)",
              color: "white",
              textTransform: "uppercase"
            }}
          >
            Edit Category
          </h6>
          <form onSubmit={updateCategory} className="px-4 d-flex flex-column gap-3">
            {/* Category Name */}
            <div className="d-flex align-items-center gap-3">
              <label className="fw-semibold w-25">Category Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Add new category"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            {/* Category Image */}
            <div className="d-flex align-items-center gap-3">
              <label className="fw-semibold w-25">Category Image</label>

              <div className="d-flex align-items-center gap-2">
                <img
                  src={preview2}
                  style={{ height: "40px", width: "40px", objectFit: "cover" }}
                />
                <input
                  type="file"
                  className="custom-file-input"
                  name="image"
                  accept="image/*"
                  onChange= {handleEditCatImage}
                />
              </div>
            </div>

            {/* Button */}
            <div className="d-flex justify-content-end gap-2">
              <button type="submit" className="btn primary-btn px-4" >
                Update
              </button>
              <button type='button' className='btn btn-danger rounded px-3' onClick={cancelEdit}>
                Cancel
              </button>
            </div>

          </form>
        </div>
        }
        </div>
       
            </div>
        </div>
        
      </div>
      </div>

     
    </div>
   
  )
}
