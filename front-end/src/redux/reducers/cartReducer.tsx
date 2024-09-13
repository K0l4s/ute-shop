import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: number;
}

interface CartState {
  cart: CartItem[];
  total: number;
  totalItems: number;
}

const initialState: CartState = {
  cart: [],
  total: 0,
  totalItems: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.cart.push(action.payload);
      state.totalItems += 1;
      state.total += action.payload.price;
    },
    removeFromCart: (state, action: PayloadAction<{ id: number; price: number }>) => {
      state.cart = state.cart.filter(item => item.id !== action.payload.id);
      state.totalItems -= 1;
      state.total -= action.payload.price;
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalItems = 0;
      state.total = 0;
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
