import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { PageTitle } from '../Components/PageTitle'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState("")
    const [Password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()
    const updatePassword = async(e)=> {
      e.preventDefault()
      try {
        if(newPassword !== confirmPassword){
            toast.error("Password doesn't match")
          }
        const {data} = await axios.put(`/api/v1/password/update`, 
          {Password, newPassword, confirmPassword}, {
            withCredentials: true
          })
          toast.success("Password updated successfully")
          navigate("/user")
      } catch (error) {
        toast.error(data.response?.data?.message)
      }
        
    }
  return (
    <div className='d-flex justify-content-center align-items-center vh-100 shadow'>
        <form onSubmit={updatePassword} className='w-75 p-4 bg-white rounded-4 shadow-lg' style={{maxWidth: "500px"}}>
          <PageTitle title = "Circuit-Store"/>
          <h3 className='text-center'>Change Password</h3>
          <div className='gap-3 d-flex flex-column mt-4'>
            <div className='d-flex flex-column gap-1 position-relative'>
                <div className='text-black fw-semibold ms-2'>Password</div>
                <input 
                type={showPassword ? "text" : "password"} className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                placeholder='Enter your password'
                name='Password'
                value={Password}
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
            <div className='d-flex flex-column gap-1 position-relative'>
                <div className='text-black fw-semibold ms-2'>New Password</div>
                <input 
                type={showPassword ? "text" : "password"} className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                placeholder='Enter your password'
                name='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}/>
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
            <div className='d-flex flex-column gap-1 position-relative'>
                <div className='text-black fw-semibold ms-2'>Confirm Password</div>
                <input 
                type={showPassword ? "text" : "password"} className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                placeholder='Enter your password'
                name='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}/>
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
            <button type='submit' className='mt-3 rounded-pill primary-btn btn'>Update Password</button>
            </div>
            </form>
    </div>
  )
}
