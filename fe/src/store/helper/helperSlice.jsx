import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    modalType: 'add',
    selectedData: null,
}
const helperSlice = createSlice({
    name: 'helper',
    initialState,
    reducers: {
        openAddModal: (state) => {
            state.isOpen = true;
            state.modalType = 'add';
            state.selectedData = null;
        },
        openEditModal: (state, action) => {
            state.isOpen = true;
            state.modalType = 'edit';
            state.selectedData = action.payload; // Item được truyền vào khi bấm nút sửa
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.selectedData = null;
        },
    },
})

export const { openAddModal, openEditModal, closeModal } = helperSlice.actions;
export default helperSlice.reducer;
