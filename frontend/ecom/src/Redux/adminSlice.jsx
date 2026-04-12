import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getDashboardDetails = createAsyncThunk("admin/dashboard", async(_, {rejectWithValue}) => {
    try {
        const {data} = await axios.get("/api/v1/admin/dashboard", {
            withCredentials: true
        })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong")
    }
})

export const orderDetails = createAsyncThunk("admin/orders", async(_, {rejectWithValue}) => {
    try {
        const {data} = await axios.get("/api/v1/admin/orders", {
            withCredentials: true
        })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const addProduct = createAsyncThunk("add/product", async(productData, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                "Content-Type" : "application/json"
            }
        }
    const {data} = await axios.post("/api/v1/products/add", productData, config)
    return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const getUsers = createAsyncThunk("admin/users", async({keyword, page = 1}, {rejectWithValue}) => {
    try {
        let link = `/api/v1/admin/users?&page=${page}`
        if(keyword){
            link += `&keyword=${keyword}`
        }
        const {data} = await axios.get(link, {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const updateRole = createAsyncThunk("/user/role", async({id, role}, {rejectWithValue}) => {
    try {
        const {data} = await axios.put(`/api/v1/admin/user/role/${id}`,{role}, {
            withCredentials: true
        })    
        return data    
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const deleteUsers = createAsyncThunk("admin/deleteuser", async(id, {rejectWithValue}) => {
    try { 
        const {data} = await axios.delete(`/api/v1/admin/user/delete/${id}`, {
            withCredentials: true
        })
        return {id, data}
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const deleteOrders = createAsyncThunk("delete/orders", async(id, {rejectWithValue}) => {
    try {
        const {data} = await axios.delete(`/api/v1/admin/order/${id}`, {
            withCredentials : true
        })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const getSingleOrder = createAsyncThunk("admin/order", async(id, {rejectWithValue}) => {
    try {
        const {data} = await axios.get(`/api/v1/order/${id}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const userOrders = createAsyncThunk("user/order", async(id, {rejectWithValue}) => {
    try {
        const {data} = await axios.get(`/api/v1/orders/user/${id}`, {
        withCredentials : true
    })
    return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
    
})

export const updateOrder = createAsyncThunk("update/order", async({id, status}, {rejectWithValue}) => {
    try {
        const {data} = await axios.put(`/api/v1/admin/order/${id}`, {status}, {
            withCredentials: true
        })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const editProduct = createAsyncThunk("edit/product", async({id, editProductData}, {rejectWithValue}) => {
    try {
        const config = {
            headers : {
                "Content-Type" : "application/json"
            }
        }
        const {data} = await axios.put(`/api/v1/admin/product/${id}`, editProductData, config)
        return data        
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        Products: [],
        productCount : 0,
        orderCount : 0,
        userCount : 0,
        loading : false,
        error : null,
        success: false,
        orders: [],
        totalAmount: 0, 
        product : "",
        users: [],
        UsersPerPage : 0,
        totalPages : 0,
        singleOrder: null, 
        userOrderCount : 0,
        userOrderAmount : 0

    },
    reducers: {
        removeErrors : (state) => {
            state.error = null
        },
        removeSuccess : (state) => {
            state.success = null
        },
        resetProductState : (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.product = ""
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(getDashboardDetails.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(getDashboardDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.productCount = action.payload.productCount
            state.userCount = action.payload.userCount
            state.orderCount = action.payload.orderCount
        })
        .addCase(getDashboardDetails.rejected, (state, action) => {
            state. loading = false;
            state. error = action.payload || "Semething went wrong..!";
        })

        builder
        .addCase(orderDetails.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(orderDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload.orders;
            state.totalAmount = action.payload.totalAmount;
        })
        .addCase(orderDetails.rejected, (state, action) => {
            state. loading = false;
            state. error = action.payload || "Semething went wrong..!";
        })

        builder
        .addCase(addProduct.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        .addCase(addProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload.product;
            state.success = true;
    })
        .addCase(addProduct.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        builder.addCase(getUsers.pending, state => {
            state.error = null;
            state.loading = true;
        })
        .addCase(getUsers.fulfilled, (state,action) => {
            state.loading = false;
            state.error = null;
            state.users = action.payload.Users
            state.totalPages = action.payload.totalPages
            state.UsersPerPage = action.payload.UsersPerPage
            state.userCount = action.payload.userCount
        })
        .addCase(getUsers.rejected, (state,action) => {
            state.error = action.payload;
            state.loading = false;
        })

        builder.addCase(updateRole.pending, state => {
            state.error = null;
            state.loading = true;
        })
        .addCase(updateRole.fulfilled, (state,action) => {
            state.success = true;
            state.loading = false;
            state.users = state.users.map(user => user._id === action.payload.user._id ? action.payload.user : user)
        })
        .addCase(updateRole.rejected, (state,action) => {
            state.error = action.payload;
            state.loading = false
        })

        builder.addCase(deleteUsers.pending, state => {
            state.error = null;
            state.loading = true
        })
        .addCase(deleteUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.users = state.users.filter(user => user._id !== action.payload.id)
        })
        .addCase(deleteUsers.rejected, (state,action) => {
            state.error = action.payload;
            state.loading = false
        })

        builder.addCase(deleteOrders.pending, state => {
            state.error = null;
            state.loading = true
        })
        .addCase(deleteOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.orders = state.orders.filter(order => order._id !== action.payload.id)
        })
        .addCase(deleteOrders.rejected, (state,action) => {
            state.error = action.payload;
            state.loading = false
        })

        builder.addCase(getSingleOrder.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(getSingleOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.singleOrder = action.payload.order;
        })
        .addCase(getSingleOrder.rejected, (state, action) => {
            state. loading = false;
            state. error = action.payload;
        })

        builder
        .addCase(userOrders.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(userOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.userOrderCount = action.payload.count;
            state.userOrderAmount = action.payload.totalAmount;
        })
        .addCase(userOrders.rejected, (state, action) => {
            state. loading = false;
            state. error = action.payload;
        })

        builder.addCase(updateOrder.pending, state => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateOrder.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;
            state.singleOrder = action.payload.order;
            state.orders = state.orders.map((order) => 
            order._id === action.payload.order._id ? action.payload.order : order)
        })
        .addCase(updateOrder.rejected, (state, action) => {
            state. loading = false;
            state. error = action.payload;
        })

        builder.addCase(editProduct.pending, state => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editProduct.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;
            state.Products = state.Products.map((product) => 
            product._id === action.payload.product._id ? action.payload.product : product)
            state.success = true
        })
        .addCase(editProduct.rejected, (state, action) => {
            state. loading = false;
            state. error = action.payload;
        })
    }
})

export const {removeErrors, resetProductState, removeSuccess} = adminSlice.actions
export default adminSlice.reducer

