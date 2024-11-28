import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  title: string;
  price: number;
  salePrice?: number;
  stars: number;
  image: string;
  quantity: number;
  stock: number;
  age?: string;
  publisher?: string;
  checked: boolean;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number, quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    toggleCheck: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.checked = !item.checked;
      }
    },
    toggleSelectAll: (state, action: PayloadAction<boolean>) => {
      state.items.forEach(item => item.checked = action.payload);
    },
    calculateTotal: (state) => {
      state.total = state.items.reduce((total, item) => {
        if (item.checked) {
          return total + (item.salePrice || item.price) * item.quantity;
        }
        return total;
      }, 0);
    },
    removeItemsByIds: (state, action: PayloadAction<number[]>) => {
      state.items = state.items.filter(item => !action.payload.includes(item.id));
    },
  },
});

export const { setItems, addItem, removeItem, updateQuantity, toggleCheck, toggleSelectAll, calculateTotal, removeItemsByIds } = cartSlice.actions;

export default cartSlice.reducer;
