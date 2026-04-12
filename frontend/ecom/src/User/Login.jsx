import React, { useEffect, useState } from 'react'
import { PageTitle } from '../Components/PageTitle'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from "lucide-react"
import { useDispatch, useSelector } from 'react-redux'
import { login, removeErrors, removeSuccess } from '../Redux/userSlicer'
import toast from 'react-hot-toast'

export const Login = () => {
  const {success, error} = useSelector((state) => state.user)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
  if(error) {
    toast.error(error, {position: 'top-center', autoClose: 3000})
    dispatch(removeErrors())
  }
  }, [dispatch, error])
  
  useEffect(() => {
  if(success) {
    toast.success("Login successful" , {position: 'top-center', autoClose: 3000})
    dispatch(removeSuccess())
    navigate('/')
  }
  }, [dispatch, success])

  const loginNow = (e) => {
  e.preventDefault()
  if(!email || !password){
    toast.error("Please enter email and password")
  }
  dispatch(login({ email, password }))
}

  return (
   <div className=' d-flex justify-content-center align-items-center shadow vh-100' style={{background: "linear-gradient(to bottom, black, #507ca7"}}>
        <form onSubmit={loginNow} className='w-75 p-4 bg-white rounded-4 shadow-lg' style={{maxWidth: "500px"}}>
          <PageTitle title = "Login | Circuit-Store"/>
          <h3 className='text-center'>Log in</h3>
          <div className='gap-3 d-flex flex-column mt-4'>
            <div className='d-flex flex-column gap-1'>
                <div className='text-black fw-semibold ms-2'>Email</div>
                <input 
                type='email' className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                placeholder='Enter your email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className='d-flex flex-column gap-1 position-relative'>
                <div className='text-black fw-semibold ms-2'>Password</div>
                <input 
                type={showPassword ? "text" : "password"} className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                placeholder='Enter your password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>

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
            <button type='submit' className='border rounded-pill p-2 reg-btn' style={{backgroundColor:"#217fea", color:"white"}}>Login</button>
          </div>
          <div className='d-flex flex-column align-items-center flex-sm-row mt-3 gap-2 justify-content-center'>
            <p className='text-center text-secondary m-0' onClick={() => navigate("/forgot-password")}> <Link className='text-secondary me-4' style={{textDecoration:"none"}}>Forgot password?</Link></p>
            <p className='m-0'> Don't have an account?<Link to={"/register"} style={{marginLeft:"5px", textDecoration:"none"}}>Register</Link></p>
          </div>
        </form>       
      </div>
  )
}
