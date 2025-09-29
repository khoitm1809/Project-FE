import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice";
import { authApi } from "./auth/authAction";
import { breedingApi } from "./breeding/breedingAction";
import { offSpringApi } from "./offSpring/offSpringAction";
import { warehouseApi } from "./warehouse/warehouseAction";

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: {
        ...persistedReducer,
        [authApi.reducerPath]: authApi.reducer,
        [breedingApi.reducerPath]: breedingApi.reducer,
        [offSpringApi.reducerPath]: offSpringApi.reducer,
        [warehouseApi.reducerPath]: warehouseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(authApi.middleware, breedingApi.middleware, offSpringApi.middleware, warehouseApi.middleware),
})


export const persistor = persistStore(store);
export default store;