import React, { useEffect, useState } from 'react'
import {ChevronDown, HomeIcon, Menu, Package, PhoneCall, Search, ShoppingBag, ShoppingCart, User, User2, UserCircle2Icon, X} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getCategory } from '../Redux/categorySLice'


export const Navbar = () => {

  const { isAuthenticated, user, loading } = useSelector((state) => state.user)
  const { categories } = useSelector((state) => state.category)
  const [pop, setPop] = useState(false)
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [search, setSearch] = useState(" ")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleSearch = (e) => {
    e.preventDefault()
    if(search.trim()){
      navigate(`/products?keyword=${encodeURIComponent(search.trim())}`)
    }
    else{
      navigate(`/products`)
    }
    setSearch("")
  }

  useEffect(() => {
    const fetchCart = async () => {
      try{
        const {data} = await axios.get("/api/v1/cart", {
        withCredentials: true
      })
      const count = data.cart.items.reduce((acc, item) => acc + item.quantity , 0)
      setCartCount(count)
      }catch(error){
        if(error.response?.status === 401){
          setCartCount(0)
        }else{
          console.log(error)
          }
        }
      }
      fetchCart()
      window.addEventListener("cartUpdated", fetchCart)
      return () => {
        window.removeEventListener("cartUpdated", fetchCart)
      }
    },[])

    useEffect(() => {
      dispatch(getCategory())
    }, [dispatch])

  return (
    <nav style={{backgroundColor:"white", color:"black "}}>
       <div className=' d-flex justify-content-between px-3 shadow align-items-center flex-nowrap navbar'>
        <span onClick={() => setOpen(!open)} className='text-secondary d-block d-md-none position-relative'>
              <button className='btn p-0' title='Menu'>{open ? <X onClick={(e) => setOpen(!open)}/> :<div className='d-flex gap-1'> <Menu className='text-black' onClick={() => setOpen(open)}/> <h5>All </h5></div>}</button>
            </span>
        <div className=' d-flex gap-4 align-items-center' style={{color: '#0071E3'}} >
        <b className='d-flex fs-5 '><Link to="/" className='fs-6' style={{color: '#0071E3'}}> <ShoppingBag/> </Link> <div className='d-flex' onClick={() => navigate("/")} style={{cursor:"pointer"}}>Circuit Store</div></b>
        <div className='text-white primary-btn rounded d-flex align-items-center me-2 px-2 py-2' style={{cursor:"pointer"}} onClick={() => setPop(!pop)}>All Products<span ><ChevronDown size={18}/></span></div>
        </div>

        {isAuthenticated && 
        pop && (
          <div className="position-absolute bg-dark text-white p-2 rounded" 
          style={{ top: "60px", left: "150px", zIndex: 1000 }}>
            {categories.map((cat) => (
                <div key={cat._id} className='text-white' style={{cursor:"pointer"}}>
                  <p onClick={() => {navigate(`/products?category=${cat._id}`)
                      setPop(false)
                    }}>
                    {cat?.name}
                  </p>
                </div>
            ))}
          </div>  
        )}
        
        <div className='d-flex gap-3'>
          <form onSubmit={handleSearch} className='d-none d-md-flex align-items-center border rounded search-bar'> 
            <input value={search} onChange={(e) => setSearch(e.target.value)} className='border-0 outline-0 search-input' type='text-black' placeholder='Search Product' style={{width:"170px"}}/>
            <button type='submit' className='border border-none rounded'><Search size={17}/></button>
          </form>
          <div  className='position-relative d-inline-block'>
            <div className='d-flex align-items-center gap-2'>
              {isAuthenticated && 
              <Link to="/user" className='text-black d-md-none' title='Profile'><User/></Link> }
              <Link to={"/cart"} className='text-black' title='Cart'><ShoppingCart size={25}/></Link>  
            </div>
            <span className="position-absolute top-0 start-100 translate-middle bg-primary text-white rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "15px", height: "15px", fontSize: "12px"}}>{cartCount}</span>
          </div>

          {!loading && isAuthenticated && user?.role === "admin" && 
          (<button className='btn primary-btn  d-none d-md-flex' onClick={() => navigate("/admin/dashboard")}>Admin</button>) }
          {!isAuthenticated &&
          (<span className='gap-2 d-none d-sm-block '>
          <Link to="/login" className='btn primary-btn' title='Login' style={{height: " 30px", width:'100px', fontSize : "14px"}}><div><User className='mb-2' size={17}/>Log in</div></Link>
          </span>)}
          {!loading && isAuthenticated && 
          <>
          <div className='btn primary-btn btn d-none d-md-flex justify-content-center' style={{ fontSize : "14px"}} onClick={() => navigate('/user')}>Account</div>
          <div className='btn primary-btn btn d-none d-md-flex justify-content-center' style={{ fontSize : "14px"}} onClick={() => navigate('/myorder')}>My Order</div> 
          </> }
            
            
            {open && 
            <div className='d-flex flex-column d-xl-none position-absolute mt-5 rounded gap-1 vh-100' style={{width: '350px', zIndex: '100', left: '0px', backgroundColor: "rgb(244, 248, 251)"}}>
              <div className='bg-secondary text-white fw-bold ps-4 p-2 d-flex  align-items-center'><UserCircle2Icon size={27}/><h3 className='pt-1 ps-1'> Hello, Janish</h3></div>
              <div className='p-2 ps-4 d-flex flex-column'>
              <Link onClick={() => setOpen(!open)} to="/" className='links text-decoration-none text-black' ><button className='btn '> Home</button></Link>
              <Link onClick={() => setOpen(!open)} to="/products" className='links text-decoration-none text-black'><button className='btn' > Products</button></Link>
              <hr/>
              <div className='d-flex flex-column'>
                <h5 className='fw-bold'>Help & Settings</h5>
                <Link onClick={() => setOpen(!open)} to="/about-us" className='links text-decoration-none text-black '><button className='btn fw-semibold'> About</button></Link>
                <Link onClick={() => setOpen(!open)} to="/contact-us" className='links text-decoration-none text-black'><button className='btn fw-semibold' >Contact Us</button></Link>
                <Link onClick={() => setOpen(!open)} to="/login" className='links text-decoration-none text-black'><button className='btn fw-semibold'> Log in</button></Link>
                <Link onClick={() => setOpen(!open)} to="/myorder" className='links text-decoration-none text-black'><button className='btn fw-semibold'> My Order</button></Link>
                {user?.role === "admin" && 
                <>
                <Link onClick={() => setOpen(!open)} to="/admin/dashboard" className='links text-decoration-none text-black'><button className='btn fw-semibold'> Admin</button></Link>
                
                </>}
              </div>
              </div>
            </div>
            }
        </div>
        </div>
        <div className="d-block d-md-none px-2 py-2">
  <form onSubmit={handleSearch} className="d-flex align-items-center bg-black rounded-pill overflow-hidden" style={{height:"30px"}}>
    <input 
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-grow-1 border border-dark px-3 py-2 bg-dark text-white"
      placeholder="Search products..."
    />

    <button type="submit" className="text-white btn px-3 d-flex align-items-center justify-content-center">
      <Search size={18}/>
    </button>

  </form>
</div>
    </nav>
  )
}
