import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

export const ResetPassword = () => {
    const {token} = useParams()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const resetHandler = async(e) => {
        e.preventDefault()

        try {
            await axios.post(`/api/v1/reset/${token}`, {password, confirmPassword})
            toast.success("Password reset successful")
            navigate("/")
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }
    return (
    <div className='d-flex justify-content-center align-items-center shadow vh-100'>
      <form onSubmit={resetHandler} className='w-75 p-4 bg-white rounded-4 shadow-lg' style={{maxWidth: "500px"}}>
        <h3 className='text-center'>Forgot Password ?</h3>
        <div className='d-flex flex-column gap-3'>
            <div className='d-flex flex-column gap-1'>
                <div>
                    <div className='text-black fw-semibold ms-2'>Password</div>
                        <input 
                        type={showPassword ? "text" : "password"} className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                        placeholder='Enter your Password'
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
                <div>
                    <div className='text-black fw-semibold ms-2'>Password</div>
                        <input 
                        type={showPassword ? "text" : "password"} className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                        placeholder='Enter your Password'
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
            </div>
        </div>    
        <button type='submit' className='d-flex ms-auto btn primary-btn mt-3'>Update Password</button>
      </form>
    </div>
  )
}
