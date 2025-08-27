import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: null,
    success: false
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

    }
})

export default authSlice.reducer;

export const { } = authSlice.actions;