import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice";
import { authApi } from "./auth/authAction";
import { pigApi } from "./pig/pigAction";
import { typePig } from "./typePig/typePigAction";

const persistConfig = {
    key: "auth",
    storage,
    whitelist: ["auth"],
};

const rootReducer = combineReducers({
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [pigApi.reducerPath]: pigApi.reducer,
    [typePig.reducerPath]: typePig.reducer
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
            typePig.middleware

        ),
});

export const persistor = persistStore(store);
export default store;