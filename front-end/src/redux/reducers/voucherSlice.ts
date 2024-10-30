import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Voucher {
  id: number;
  code: string;
  name: string;
  discount_val: number;
  discount_perc: number;
  min_order_val: number;
  desc: string;
  stock: number;
  is_active: boolean;
  type: "discount" | "freeship";
}

interface VoucherState {
  availableVouchers: Voucher[];
  selectedDiscountVoucherId: number | null;
  selectedFreeshipVoucherId: number | null;
  viewedVoucherId: number | null;
}

const initialState: VoucherState = {
  availableVouchers: [],
  selectedDiscountVoucherId: null,
  selectedFreeshipVoucherId: null,
  viewedVoucherId: null,
};

const voucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    setAvailableVouchers(state, action: PayloadAction<Voucher[]>) {
      state.availableVouchers = action.payload;
    },
    applyVoucher(state, action: PayloadAction<{ id: number; type: 'discount' | 'freeship' }>) {
      const { id, type } = action.payload;
      if (type === 'discount') {
        state.selectedDiscountVoucherId = id;
      } else if (type === 'freeship') {
        state.selectedFreeshipVoucherId = id;
      }
    },
    deselectVoucher(state, action: PayloadAction<'discount' | 'freeship'>) {
      const type = action.payload;
      if (type === 'discount') {
        state.selectedDiscountVoucherId = null;
      } else if (type === 'freeship') {
        state.selectedFreeshipVoucherId = null;
      }
    },
    viewVoucherDetail(state, action: PayloadAction<number>) {
      state.viewedVoucherId = action.payload;
    },
    clearViewedVoucher(state) {
      state.viewedVoucherId = null;
    },
  },
});

export const { setAvailableVouchers, applyVoucher, deselectVoucher, viewVoucherDetail, clearViewedVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;
