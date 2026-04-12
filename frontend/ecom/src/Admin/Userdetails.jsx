import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import {useDispatch, useSelector} from 'react-redux'
import {deleteUsers, getUsers, orderDetails, updateRole} from "../Redux/adminSlice"
import { useSearchParams } from 'react-router-dom'
import { Pagination } from '../Redux/Pagination'


export const Userdetails = () => {

    const {users, UsersPerPage, userCount, orders} = useSelector((state) => state.admin)
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get("keyword") || ""
    const pageNoUrl = parseInt(searchParams.get("page"), 10) || 1
    const totalPages = Math.ceil(userCount / (UsersPerPage || 6))
    const [currentPage, setCurrentPage] = useState(pageNoUrl)
    const [selectedUserId, setSelectedUserId] = useState("")
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [showManage, setShowManage] = useState(false)
 
    const manageUser = (user)=> {
        setSelectedUserId(user?._id)
        setUserName(user?.name)
        setEmail(user?.email)
        setRole(user?.role)

        setShowManage(true)
    }

    const handleDelete = (id) => {
        dispatch(deleteUsers(id))
    }

    useEffect(() => {
        if(showManage){
            document.getElementById("manageUser")?.scrollIntoView({behavior: "smooth"})
        }
    })

    const updatedRole = () => {
        dispatch(updateRole({
            id: selectedUserId,
            role: role
        }))
    }
    const handlePageChange = (pageNumber) => {
    if(pageNumber != currentPage){
      setCurrentPage(pageNumber)
      const newSearchParams = new URLSearchParams(location.search)
      if(pageNumber == 1){
        newSearchParams.delete("page")
      }
      else{
        newSearchParams.set("page", pageNumber)
      }
      navigate(`?${newSearchParams.toString()}`)
    }
  }

    useEffect(() => {
    dispatch(getUsers({keyword, page: currentPage}))
    dispatch(orderDetails())
    }, [dispatch, keyword, currentPage])  

    console.log(users)

  return (
    <div className='container-fluid p-0 vh-100 d-flex flex-column'>
        <div>
            <Sidebar/>
        </div>
        <div className='col-12 col-lg-9 p-2 main-content'>
            <h6 className='p-4' style={{ background: "linear-gradient(to right, #1f2937, #31507b)", color:"white", textTransform:"uppercase" }}>User Details</h6>

            <div className='overflow-x-auto category-scroll'>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <td>S.no</td>
                            <td>Username</td>
                            <td>Email</td>
                            <td>Role</td>
                            <td>Orders</td>
                            <td>Joined</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user, index) => (                    
                        <tr key={user._id}>
                            <td>#{user._id.slice(-5).toUpperCase()}</td>
                            <td>{user?.name}</td>
                            <td>{user?.email}</td>
                            <td>{user?.role}</td>
                            <td>{orders?.filter(o => o.user?._id === user._id).length}</td>   
                            <td>{new Date(user?.createdAt).toLocaleDateString()}</td>
                            <td><span className='d-flex w-100 gap-2'>
                                <button className='btn primary-btn w-50' onClick={() => manageUser(user)}>Manage</button>
                                <button className='btn btn-danger w-50' onClick={() => handleDelete(user._id)}>Delete</button>
                            </span></td>
                        </tr>
                         ))}
                    </tbody>
                </table>
            </div>

            <div className='text-center mt-4 mb-3'>
            <Pagination onPageChange={handlePageChange} totalPages={totalPages} currentPage={currentPage}/>
        </div>

        {showManage && 
        <div className='mt-3 shadow' id='manageUser'>
            <h6  className='p-4' style={{ background: "linear-gradient(to right, #1f2937, #31507b)", color:"white", textTransform:"uppercase" }}>Manage User</h6>
            <form className='d-flex flex-column gap-2'>
                <div className='d-flex justify-content-between w-100'>
                    <h5 className='w-50 ms-5'>Username</h5>
                    <input
                    className='w-50 form-control me-5'
                    type='text'
                    value={userName}
                    readOnly
                    />
                </div>
                <div className='d-flex justify-content-between w-100'>
                    <h5 className='w-50 ms-5'>Email</h5>
                    <input
                    className='w-50 form-control me-5'
                    type='text'
                    value={email}
                    readOnly
                    />
                </div>
                <div className='d-flex justify-content-between w-100'>
                    <h5 className='w-50 ms-5'>Role</h5>
                    <select
                    className='w-50 form-control me-5' value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className='d-flex justify-content-center ms-auto gap-2'>
                    <button  type="button" className=' btn primary-btn mb-2' disabled={!selectedUserId} onClick={updatedRole}>Update User</button>
                    <buuton className="btn btn-danger rounded mb-2 me-5" onClick={() => setShowManage(false)}>Cancel</buuton>
                </div>
                
            </form>       
        </div>
        }
        </div>
    </div>
  )
}
  