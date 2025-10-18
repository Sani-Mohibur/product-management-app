import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

// Initial state is ALWAYS logged out on first load for server/client consistency
const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", token);
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
      }
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
