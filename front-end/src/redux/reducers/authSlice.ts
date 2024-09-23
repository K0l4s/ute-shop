import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: string | null;
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
    },
    checkAuthStatus(state, action) {
      state.isAuthenticated = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { login, logout, checkAuthStatus, setUser } = authSlice.actions;
export default authSlice.reducer;
