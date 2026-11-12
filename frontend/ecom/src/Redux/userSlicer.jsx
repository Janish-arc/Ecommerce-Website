import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "api"

export const register = createAsyncThunk("user/register", async(userData, {rejectWithValue}) => {
    try {
        const config=  {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        }
        const {data} = await api.post("/api/v1/register", userData, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Registration failed. Please fill out the required fields")
    }
})


export const updateProfile = createAsyncThunk("update/profile", async(userData, {rejectWithValue}) => {
    try {
        const config=  {
            headers: {
                "Content-Type" : "application/json"
            }
        }
        const {data} = await api.put("/api/v1/profile/update", userData, config)
        return data
    } catch (error) {
       console.log("ERROR:", error.response)
    return rejectWithValue(error.response?.data?.message || error.message)
    }
})

export const login = createAsyncThunk("user/login", async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }
      const { data } = await api.post("/api/v1/login", userData, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data|| "Login failed")
    }
  }
)

export const profile = createAsyncThunk("user/profile", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/profile")
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data|| "Login Failed. Please try again later")
    }
})

export const neworder = createAsyncThunk("user/order", async(orderdata, {rejectWithValue}) => {
    try {
        const {data} = await api.post("/api/v1/new/order", orderdata, {
            withCredentials: true
        })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const myorders = createAsyncThunk("my/order", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.get(`/api/v1/orders/user/${id}`, {
            withCredentials: true
        })
            // console.log("USER ID:", id);
            // console.log("API RESPONSE:", data);
        return data
   
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
    
})

const storedUser = localStorage.getItem("user")
const storedAuth = localStorage.getItem("isAuthenticated")
let parsedUser = null
try {
  parsedUser = storedUser ? JSON.parse(storedUser) : null
} catch {
  parsedUser = null
}

const userSLice = createSlice({
    name: "user",
    initialState: {
        user: parsedUser,
        loading: false,
        error: null,
        isAuthenticated: Boolean(parsedUser),
        success: false,
        message: null,
        order : [],
        orders: []
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null
        },
        removeSuccess: (state) => {
            state.success = false
        },
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.success = false

            localStorage.removeItem("user")
            localStorage.removeItem("isAuthenticated")
}
    },
    extraReducers:(builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload.success
            state.user = action.payload?.user || null
            state.isAuthenticated = Boolean(action.payload?.user)
            localStorage.setItem("user", JSON.stringify(state.user))
            localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated))
        })    
        .addCase(register.rejected, (state, action) => {
            state.loading= false
            state.error = action.payload?.message || "Registration failed. Please fill out all the required fields"
            state.isAuthenticated = false
            state.user = null
        })
        builder
        .addCase(login.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload.success
            state.user = action.payload?.user || null
            state.isAuthenticated = Boolean(action.payload?.user)
            localStorage.setItem("user", JSON.stringify(state.user))
            localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated))
        })    
        .addCase(login.rejected, (state, action) => {
            state.loading= false
            state.error = action.payload?.message || "Login failed. Please try again later"
            state.isAuthenticated = false
            state.user = null
            localStorage.removeItem("user")
            localStorage.removeItem("isAuthenticated")
        })
        builder
        .addCase(profile.pending, (state) => {
            state.loading = true
            state.error = null
        }) 
        .addCase(profile.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.isAuthenticated = true
            state.user = action.payload.user
            state.success = false
            localStorage.setItem("user", JSON.stringify(state.user))
            localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated))
        })
        .addCase(profile.rejected, (state, action) => {
            state.loading= false
            state.error = action.payload?.message || "Login failed. Please try again later"
            state.isAuthenticated = false
            state.user = null
            localStorage.removeItem("user")
            localStorage.removeItem("isAuthenticated")
        })
        builder
        .addCase(updateProfile.pending, (state) => {
            state.loading = true
            state.error = null
        }) 
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.isAuthenticated = true
            state.user = action.payload.user
            state.success = true
            localStorage.setItem("user", JSON.stringify(state.user))
            localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated))
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.loading= false
            state.error = action.payload?.message || "Profile cannot be updated, Please try again later"
        })


        builder.addCase(neworder.pending, state => {
            state.error = null;
            state.loading = true;
        })
        .addCase(neworder.fulfilled, (state,action) => {
            state.error = null;
            state.loading = false;
            state.order = action.payload.order;
            state.success = true;
        })
        .addCase(neworder.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false
        })

        builder.addCase(myorders.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        .addCase(myorders.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;
            state.orders = action.payload.orders
        })
        .addCase(myorders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const {removeErrors, removeSuccess, logout} = userSLice.actions
export default userSLice.reducer