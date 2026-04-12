import React, { use, useEffect, useState } from 'react'
import { PageTitle } from '../Components/PageTitle'
import {Link, useNavigate} from "react-router-dom"
import toast from 'react-hot-toast'
import { register, removeErrors, removeSuccess } from '../Redux/userSlicer'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'

export const Register = () => {
  const [preview, setPreview] = useState("https://cdn-icons-png.flaticon.com/512/3177/3177440.png")
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const {name, email, password, confirmPassword} = user
  const [avatar, setAvatar] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {error, success} = useSelector((state) => state.user)
  const handleChange = (e) => {
    if(e.target.name == "avatar"){
      const file = e.target.files[0]
    // ✅ Check file size (1MB = 1024 * 1024)
    if (file.size > 1024 * 1024) {
      alert("Image size should be less than 1MB")
      return
    }
    const reader = new FileReader()
        reader.onload = () => {
          if(reader.readyState==2){
            setPreview(reader.result)
            setAvatar(reader.result)
          }
        }
        reader.readAsDataURL(file)
    }else{
      setUser({...user, [e.target.name]:e.target.value})
    }
  }
  const registerNow = (e) => {
    e.preventDefault()
    if(!name || !email || !password){
      toast.error("Please fill all the required fields", {
        position: "top-center", autoClose: 3000
      }) 
    }
   
    const myform = new FormData()
    myform.set("name", name),
    myform.set("email", email),
    myform.set("password", password),
    myform.set("avatar", avatar)
    // console.log(myform.entries())
    // for (let pair of myform.entries()){
    //   console.log(pair[0] + ":" + pair[1])
    // }
    dispatch(register(myform))
  }

  useEffect(() => {
    if(error) {
      toast.error(error, {position: 'top-center', autoClose: 3000})
      dispatch(removeErrors())
    }
  }, [dispatch, error])
  useEffect(() => {
    if(success) {
      toast.success(success, {position: 'top-center', autoClose: 3000})
      dispatch(removeSuccess())
      navigate('/')
    }
  }, [dispatch, success])

  return (
      <div className=' d-flex justify-content-center align-items-center shadow vh-100' style={{background: "linear-gradient(to bottom, #ae8ba1, #f2ecb6"}}>
        <form onSubmit={registerNow} className='w-75 p-4 bg-white rounded-4 shadow-lg' style={{maxWidth: "500px"}}>
          <PageTitle title = "Register | Circuit-Store"/>
          <h3 className='text-center'>Create Account</h3>
          <div className='gap-3 d-flex flex-column mt-4'>
            <div className='d-flex flex-column gap-1'>
                <div className='text-black fw-semibold ms-2'>Name</div>
                <input 
                type='text' className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                placeholder='Enter your name'
                value={name}
                name='name'
                onChange={handleChange}/>
            </div>
            <div className='d-flex flex-column gap-1'>
                <div className='text-black fw-semibold ms-2'>Email</div>
                <input 
                type='email' className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                placeholder='Enter your email'
                value={email}
                name='email'
                onChange={handleChange}/>
            </div>
            <div className='d-flex flex-column gap-1 position-relative'>
                <div className='text-black fw-semibold ms-2'>Password</div>
                <input 
                type={showPassword ? "text" : "password"} className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                placeholder='Enter your password'
                name='password'
                value={password}
                onChange={handleChange}/>
            <span
              onClick={() => setShowPassword(!showPassword)}
                style={{
                position: "absolute",
                right: "15px",
                top: "68%",
                transform: "translateY(-50%)",
                cursor: "pointer"
                }}
              >
              {showPassword ? <Eye size={19}/> : <EyeOff size={19}/>}
            </span>
            </div>
            <div className='d-flex gap-3 align-items-center mt-3'>
                <div>
                  <img src={preview} style={{height:'40px', width:'40px', borderRadius:"50%"}}/>
                </div>
                <input 
                type='file' className=' custom-file-input'
                accept='image/*'
                name='avatar'
                onChange={handleChange}/>
            </div>
            <button type='submit' className='border rounded-pill p-2 reg-btn' style={{backgroundColor:"#217fea", color:"white"}}>Create Account</button>
          </div>

          <p className='mt-3 text-center text-secondary'> Already have an account? <Link to={"/login"} style={{marginLeft:"10px", textDecoration:"none"}}>Sign in</Link></p>
        </form>       
      </div>
  )
}
