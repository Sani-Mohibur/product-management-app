import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { productsApi } from "./services/productsService";
import { categoriesApi } from "./services/categoriesService"; // 1. Import the new API

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [productsApi.reducerPath]: productsApi.reducer,
      [categoriesApi.reducerPath]: categoriesApi.reducer, // 2. Add its reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(productsApi.middleware)
        .concat(categoriesApi.middleware), // 3. Add its middleware
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
