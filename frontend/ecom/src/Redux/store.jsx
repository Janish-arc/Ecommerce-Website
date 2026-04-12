import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlicer"
import userSlice from "./userSlicer"
import adminSlice from "./adminSlice"
import categorySlice from "./categorySLice"

export const store = configureStore({
    reducer: {
        product: productReducer,
        user: userSlice,
        admin: adminSlice,
        category: categorySlice
    }
})