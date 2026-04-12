import { Loader2 } from 'lucide-react'
import React from 'react'

export const Loader = () => {
  return (
    <div className='d-flex justify-content-center align-items-center' style={{height:"100vh"}}>
         <div className='text-primary spinner-border' style={{height:"70px", width:"70px"}} ></div>
    </div>
   
  )
}
