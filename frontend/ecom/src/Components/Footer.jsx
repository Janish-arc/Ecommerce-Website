import { Instagram, Linkedin, Mail, Phone } from 'lucide-react'
import React from 'react'

export const Footer = () => {
  return (
    <footer className='bg-black d-flex justify-content-evenly row text-center text-md-start pt-3'>
        <div className='col-12 col-sm-3'>
            <h6 className='text-white d-flex justify-content-center'>Contact Us</h6>
            <p className='text-secondary d-flex justify-content-center gap-1 m-0'><Phone size= {20}/> Phone - 8148427615</p>
            <p className='text-secondary d-flex justify-content-center gap-1'><Mail size= {20}/> Email: infantjanish27@gmail.com</p>
        </div>
        <div className='col-12 col-sm-3 '>
            <h6 className='text-white d-flex justify-content-center'>Follow Me</h6>
            <p className='d-flex gap-3 text-secondary d-flex justify-content-center'><Linkedin/><Instagram/></p>
        </div>
        <div className='col-12 col-sm-3'>
            <h6 className='text-white d-flex justify-content-center'>About</h6>
            <p className='text-secondary m-0 d-flex justify-content-center'>Providing professional e-commerce solutions to help you grow your online business</p>
        </div>

        <hr style={{color:'white'}}/>
        <h6 className='text-secondary d-flex justify-content-center'>@ 2026 Circuit Store-All rights reserved </h6>
    </footer>
  )
}
