import React, { useEffect, useState } from 'react'
import { PageTitle } from '../Components/PageTitle'
import { removeErrors, removeSuccess, updateProfile } from '../Redux/userSlicer'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const UpdateProfile = () => {
    const [preview, setPreview] = useState("https://cdn-icons-png.flaticon.com/512/3177/3177440.png")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user, error, success} = useSelector((state) => state.user)
   const [users, setUsers] = useState({
       name: "",
       email: ""
     })
     const {name, email} = users || {}
     const [avatar, setAvatar] = useState("")

    const handleChange = (e) => {
    if(e.target.name == "avatar"){
        const reader = new FileReader()
        reader.onload = () => {
          if(reader.readyState==2){
            setPreview(reader.result)
            setAvatar(reader.result)
          }
        }
        reader.readAsDataURL(e.target.files[0])
    }else{
      setUsers({...users, [e.target.name]:e.target.value})
    }
  }

  const updateNow = (e) => {
      e.preventDefault()
    //   if(!name || !email){
    //     toast.error("Please fill all the required fields", {
    //       position: "top-center", autoClose: 3000
    //     }) 
    //     return 
    //   }
  dispatch(updateProfile({
  name,
  email,
  avatar
}))

    }

     useEffect(() => {
        if(error) {
          toast.error(error, {position: 'top-center', autoClose: 3000})
          dispatch(removeErrors())
        }
      }, [dispatch, error])
      useEffect(() => {
        if(success) {
          toast.success("Profile updated successfully", {position: 'top-center', autoClose: 3000})
          dispatch(removeSuccess())
          navigate('/user')
        }
      }, [dispatch, success])
      useEffect(() => {
  if(user){
    setUsers({
      name: user.name,
      email: user.email
    })
    setPreview(user.avatar?.url)
  }
}, [user])

   return (
      <div className=' d-flex justify-content-center align-items-center shadow vh-100' style={{background: "linear-gradient(to bottom, #ae8ba1, #f2ecb6"}}>
        <form onSubmit={updateNow} className='w-75 p-4 bg-white rounded-4 shadow-lg' style={{maxWidth: "500px"}}>
          <PageTitle title = "Register | Circuit-Store"/>
          <h3 className='text-center'>Update Profile</h3>
          <div className='gap-3 d-flex flex-column mt-4'>
            <div className='d-flex flex-column gap-1'>
                <div className='text-black fw-semibold ms-2'>Name</div>
                <input 
                type='text' className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                placeholder='Enter your name'
                value={users?.name}
                name='name'
                onChange={handleChange}/>
            </div>
            <div className='d-flex flex-column gap-1'>
                <div className='text-black fw-semibold ms-2'>Email</div>
                <input 
                type='email' className='w-100 rounded-pill reg px-3' style={{height:"40px"}}
                placeholder='Enter your email'
                name='email'
                value={users?.email}
                onChange={handleChange}/>
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
            <button type='submit' className='border rounded-pill p-2 reg-btn' style={{backgroundColor:"#217fea", color:"white"}}>Update Profile</button>
          </div>
        </form>       
      </div>
  )
}
