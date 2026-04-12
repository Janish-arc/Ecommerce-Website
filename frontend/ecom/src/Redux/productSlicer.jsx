import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'

export const getProduct = createAsyncThunk("products/getProduct", async ({keyword, page = 1, category, sort}, {rejectWithValue}) => {
    try {
        // const link = `/api/v1/products?keyword=${encodeURIComponent(keyword)}&page=${page}` || `/api/v1/products?page=${page}`
        let link = `/api/v1/products?page=${page}`
        if(keyword){
            link += `&keyword=${keyword}`
        }
        if(category){
            link += `&category=${category}`
        }
        if(sort){
            link += `&sort=${sort}`
        }
        const {data} = await axios.get(link)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong..!")
    }
}) 

export const latestProduct = createAsyncThunk("products/latest", async (_, {rejectWithValue}) => {
    try{
        const link = '/api/v1/latest/products'
        const {data} = await axios.get(link)
        return data
    }catch(error){
        return rejectWithValue(error.response?.data || "Something went wrong")
    }
})

export const getProductDetails = createAsyncThunk("products/getProductDetails", async (id, {rejectWithValue}) => {
    try {
        const link = `/api/v1/product/${id}`
        const {data} = await axios.get(link)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong..!")
    }
}) 

export const adminProducts = createAsyncThunk("admin/products", async({keyword, page = 1, }, {rejectWithValue}) => {
    try {
        let link = `/api/v1/admin/products?page=${page}`
        if(keyword){
            link += `&keyword=${keyword}`
        }
        const {data} = await axios.get(link)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const deleteProducts = createAsyncThunk("admin/deleteproduct", async(id, {rejectWithValue}) => {
    try { 
        const {data} = await axios.delete(`/api/v1/admin/product/${id}`)
        return {id, data}
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const review = createAsyncThunk("user/review", async(reviewData, {rejectWithValue}) => {
    try {
        const {data} = await axios.put("/api/v1/review", reviewData, {
            withCredentials: true
        })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const productSlice = createSlice({
    name : "product",
    initialState : {
        products : [],
        productsCount : 0,
        error : null,
        loading : false,
        product : null,
        productsPerPage : 8,
        totalPages : 0,
        review: []
    },
    reducers : {
        removeErrors : (state) => {
            state.error = null
        }
    },
    extraReducers : (builder) => {
        builder.addCase(getProduct.pending, (state) => {
            state.loading = true;
            state.error = null
        }).addCase(getProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.products = action.payload.Products;
            state.productsCount = action.payload.productCount;  
            state.productsPerPage = action.payload.productsPerPage;
            state.totalPages = action.payload.totalPages;
        }).addCase(getProduct.rejected, (state, action) => {
            state. loading = false;
            state. error = action.payload || "Semething went wrong..!";
        })

        builder.addCase(getProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null
        }).addCase(getProductDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.product = action.payload.product;
        }).addCase(getProductDetails.rejected, (state, action) => {
            state. loading = false;
            state. error = action.payload || "Semething went wrong..!";
        })

        builder.addCase(latestProduct.pending, (state) => {
            state.loading = true;
            state.error = null
        }).addCase(latestProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.products = action.payload.products;
            state.productsCount = action.payload.productCount;
            state.productsPerPage = action.payload.productsPerPage;
            state.totalPages = action.payload.totalPages;
        }).addCase(latestProduct.rejected, (state, action) => {
            state. loading = false;
            state. error = action.payload || "Semething went wrong..!";
        })

        builder.addCase(adminProducts.pending, (state) => {
            state.error = null;
            state.loading = true
        })
        .addCase(adminProducts.fulfilled, (state, action, payload) => {
            state.loading = false;
            state.error = null;
            state.products = action.payload.products
            state.productsCount = action.payload.productsCount;
            state.productsPerPage = action.payload.productsPerPage;
            state.totalPages = action.payload.totalPages;
        })
        .addCase(adminProducts.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false
        })

        builder.addCase(deleteProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteProducts.fulfilled, (state,action,payload) => {
            state.error = null;
            state.loading = false;
            state.products = state.products.filter(product => product._id !== action.payload.id) 
        })
        .addCase(deleteProducts.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false
        })

        builder.addCase(review.pending, state => {
            state.loading = true;
            state.error = false;
        })
        .addCase(review.fulfilled, (state, action) => {
            state.loading = false;
            state.error = false;
            state.review = action.payload.product;
        })
        .addCase(review.rejected, (state,action) => {
            state.error = action.payload;
            state.loading = false
        })
    }
})

export const {removeErrors} = productSlice.actions
export default productSlice.reducer