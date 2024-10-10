import { createSlice } from '@reduxjs/toolkit';

interface User {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  gender: boolean;
  birthday: Date;
  avatar_url: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null; // Clear user info on logout
    },
    checkAuthStatus(state, action) {
      state.isAuthenticated = action.payload;
    },
    setUser(state, action) {
      // state.user = action.payload;
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { login, logout, checkAuthStatus, setUser } = authSlice.actions;
export default authSlice.reducer;
