import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NewOrderState {
  orderId: number | null;
}

const initialState: NewOrderState = {
  orderId: null,
};

const newOrderSlice = createSlice({
  name: 'newOrder',
  initialState,
  reducers: {
    setOrderId: (state, action: PayloadAction<number>) => {
      state.orderId=action.payload;
    },
    clearOrderId: (state) => {
      state.orderId = null;
    },
  },
});

export const { setOrderId, clearOrderId } = newOrderSlice.actions;
export default newOrderSlice.reducer;
