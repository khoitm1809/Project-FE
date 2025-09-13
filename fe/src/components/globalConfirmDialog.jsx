// src/services/confirmDialogService.js
let openDialogFn = null;

export const setOpenDialogFn = (fn) => {
    openDialogFn = fn;
};

export const getOpenDialogFn = () => openDialogFn;
