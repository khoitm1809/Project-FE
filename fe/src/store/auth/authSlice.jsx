import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: null,
    success: false,
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    }
})

export const { } = authSlice.actions;
export default authSlice.reducer;
