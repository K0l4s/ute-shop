// redux store
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import cartReducer from './reducers/cartSlice';
import voucherReducer from './reducers/voucherSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    voucher: voucherReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
