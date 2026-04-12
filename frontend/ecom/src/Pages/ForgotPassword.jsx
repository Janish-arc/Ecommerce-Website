import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState("")


  const UpdatePassword = async(e) => {
    e.preventDefault()

    try {
      await axios.post("/api/v1/password/forgot",
        {email}
      )
      toast.success("Email sent successfully, Check your inbox")
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center shadow vh-100'>
      <form onSubmit={UpdatePassword} className='w-75 p-4 bg-white rounded-4 shadow-lg' style={{maxWidth: "500px"}}>
        <h3 className='text-center'>Forgot Password ?</h3>
        <div className='d-flex flex-column gap-3'>
            <div className='d-flex flex-column gap-1'>
                <div className='text-black fw-semibold ms-2'>Email</div>
                <input 
                type='email' className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                placeholder='Enter your email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
            </div>
        </div>
        <button type='submit' className='d-flex ms-auto btn primary-btn mt-3'>Send Reset Link</button>
      </form>
    </div>
  )
}
