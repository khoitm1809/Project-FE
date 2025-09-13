import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: null,
    success: false,
    role: null
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.role = action.payload;
        }
    }
})

export const { setRole } = authSlice.actions;
export default authSlice.reducer;
