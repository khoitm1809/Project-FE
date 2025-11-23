import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice";
import helperReducer from "./helper/helperSlice";
import { authApi } from "./auth/authAction";
import { pigApi } from "./pig/pigAction";
import { typePigApi } from "./typePig/typePigAction";
import { areaApi } from "./area/areaAction";
import { warehouseApi } from "./warehouse/warehouseAction";
import { warehouseItemApi } from "./warehouse/warehouseItemAction";

const persistConfig = {
    key: "auth",
    storage,
    whitelist: ["auth"],
};

const rootReducer = combineReducers({
    auth: authReducer,
    helper: helperReducer,
    [authApi.reducerPath]: authApi.reducer,
    [pigApi.reducerPath]: pigApi.reducer,
    [typePigApi.reducerPath]: typePigApi.reducer,
    [areaApi.reducerPath]: areaApi.reducer,
    [warehouseApi.reducerPath]: warehouseApi.reducer,
    [warehouseItemApi.reducerPath]: warehouseItemApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            authApi.middleware,
            pigApi.middleware,
            typePigApi.middleware,
            areaApi.middleware,
            warehouseApi.middleware,
            warehouseItemApi.middleware,
        ),
});

export const persistor = persistStore(store);
export default store;