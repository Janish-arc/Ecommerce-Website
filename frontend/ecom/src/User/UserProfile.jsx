import React, { useEffect, useState } from 'react'
import { Navbar } from '../Components/Navbar'
import { Footer } from '../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { profile } from '../Redux/userSlicer'
import {formatDate} from "../Components/Format"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { logout } from '../Redux/userSlicer'

export const UserProfile = () => {
    const {user, isAuthenticated} = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [pop, setPop] = useState(false)

    const logoutHandler = async () => {
        try {
            await axios.get("/api/v1/logout", {
                withCredentials: true
            })
            dispatch(logout())
            navigate("/")
        }
  
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        dispatch(profile())
    },[dispatch])

    if(!isAuthenticated){
     return (
        <div className='d-flex justify-content-center'>
            <div className="shadow-lg w-50 d-flex flex-column justify-content-center align-items-center p-5 rounded" style={{marginTop:"22%"}}>
                <h2 className='text-center'>Please login first</h2>
                <button className="primary-btn btn mt-3 w-50" onClick={() => navigate("/login")}>Login</button>
            </div>
        </div>
     )
    }else{
        return (
    <div>
        <Navbar/>
        <div className='d-flex justify-content-center align-items-center vh-100 ' style={{background: "linear-gradient(to bottom, black, #507ca7"}}>
            {!pop && 
            <div className='col-10 col-lg-6 p-4 bg-white shadow-lg rounded' style={{zIndex:20}}>
                <div>
                <h3 className='text-center fw-bold'>My Profile </h3>
                <hr/>
                <div className='mt-4 d-flex flex-column flex-md-row justify-content-center justify-content-md-around text-center align- text-md-start'>
                        <img src={user?.avatar?.url} className='rounded-circle' style={{width:"150px", height:"150px", objectFit:"cover"}} alt={user?.name}/>
               
                <div className="mt-3 text-start fs-6 fw-medium">
                <div className="row mb-2">
                    <div className="col-4 col-md-4 fw-semibold">Name:</div>
                    <div className="col-8 col-md-8">{user?.name}</div>
                </div>
                <div className="row mb-2">
                    <div className="col-4 col-md-4 fw-semibold">Email:</div>
                    <div className="col-8 col-md-8">{user?.email}</div>
                </div>
                <div className="row">
                    <div className="col-4 col-md-4 fw-semibold">Joined:</div>
                    <div className="col-8 col-md-8">{formatDate(user?.createdAt)}</div>
                </div>
                </div>

                </div>
                <div className='d-flex justify-content-center justify-content-md-evenly gap-3 mt-3'>
                <button className='rounded btn primary-btn btn-md w-25' onClick={() => navigate("/update-profile")}>Edit Profile</button>
                <button className='rounded btn primary-btn btn-md w-25' onClick={() => navigate("/password-update")}>Change Password</button>
                <button className='rounded btn btn-danger btn-md w-25' onClick={() => setPop(true)}>Logout</button>
                </div>      
            </div>
            {user?.role === "admin" &&
            <div className="pb-3 rounded mt-5" style={{backgroundColor:"rgb(216, 216, 216)"}}>
                <h3 className='text-center fw-bold pt-2'>Admin Panel</h3>
                <hr/>
                <div className='d-flex justify-content-center'>
                    <button className='primary-btn btn' onClick={() => navigate("/admin/dashboard")}>Admin Dashboard</button>
                </div>
            </div>
            }
            </div>
            }

            {pop && 
                <div className='bg-white p-4 rounded d-flex flex-column gap-3 justify-content-center' style={{zIndex:40}}>
                    <h5>Are you sure, do you want to logout?</h5>
                    <div className='d-flex justify-content-evenly gap-3'>
                        <button className='btn primary-btn w-50' onClick={() => setPop(false)}>No</button>
                        <button className='primary-btn btn w-50' onClick={() => logoutHandler()}>Confirm Logout</button>
                    </div>
                </div>
            }
        </div>

        
        <Footer/>
    </div>
  )
    }
}