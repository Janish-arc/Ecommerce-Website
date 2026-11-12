import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "api";

export const getCategory = createAsyncThunk("get/category", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.
        get("/api/v1/get/category", { withCredentials: true })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const addCategory = createAsyncThunk("add/category", async(categoryData, {rejectWithValue}) => {
    try{
        const {data} = await api.post("/api/v1/add/category", categoryData)
        return data
    }catch(error){
        return rejectWithValue(error.response?.data)
    }
})

export const editCategory = createAsyncThunk("edit/category", async({id, categoryData} , {rejectWithValue}) => {
    try {
        const {data} = await api.put(`/api/v1/edit/category/${id}`, categoryData)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const deleteCategory = createAsyncThunk("delete/category", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.delete(`/api/v1/delete/category/${id}`)
        return {id, data}
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const categorySlice = createSlice({
    name: "category",
    initialState: {
        loading : false,
        error : null,
        success: false,
        categories: [],
        categoryCount : 0
    },
    reducers:{
        removeErrors : (state) => {
            state.error = null;
        },
        removeSuccess : (state) => {
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCategory.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        .addCase(getCategory.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;
            state.categories = action.payload.categories;
            state.categoryCount = action.payload.productCount
        })
        .addCase(getCategory.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        builder.addCase(addCategory.pending, state => {
            state.error = null;
            state.loading = true;
        })
        .addCase(addCategory.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;
            state.categories.push(action.payload.categories)
        })
        .addCase(addCategory.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        builder.addCase(editCategory.pending, state => {
            state.error = null;
            state.loading = true;
        })
        .addCase(editCategory.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;
            const index = state.categories.findIndex((cat) => cat._id === action.payload.category._id)
            if(index !== -1){
                state.categories[index] = action.payload.category
            } 
        })
        .addCase(editCategory.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        builder.addCase(deleteCategory.pending, state => {
            state.error = null;
            state.loading = true;
        })
        .addCase(deleteCategory.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;
            state.categories = state.categories.filter(cat => cat._id !== action.payload.id)
        })
        .addCase(deleteCategory.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        
    }
}) 

export const { removeErrors, removeSuccess } = categorySlice.actions;
export default categorySlice.reducer

