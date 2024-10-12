// store/voucherSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Voucher {
  id: number;
  title: string;
  desc: string;
  type: "discount" | "freeship";
}

interface VoucherState {
  availableVouchers: Voucher[];
  selectedDiscountVoucherId: number | null;
  selectedFreeshipVoucherId: number | null;
  viewedVoucherId: number | null;
}

const initialState: VoucherState = {
  availableVouchers: [
    { id: 1, title: 'MÃ GIẢM GIÁ 30K - ĐƠN HÀNG TỪ 200K - ĐƠN HÀNG TỪ 200K - ĐƠN HÀNG TỪ 200K', desc: 'Áp dụng cho tất cả các loại sách- ĐƠN HÀNG TỪ 200K', type: "discount" },
    { id: 3, title: 'MÃ GIẢM GIÁ 50K - ĐƠN HÀNG TỪ 300K', desc: 'Áp dụng cho sách tiếng Anh, tiếng Trung, tiếng Đức, tiếng Việt', type: "discount" },
    { id: 5, title: 'MÃ GIẢM GIÁ 50K - ĐƠN HÀNG TỪ 300K', desc: 'Áp dụng cho sách tiếng Anh- ĐƠN HÀNG TỪ 200K', type: "discount" },
    { id: 6, title: 'MÃ GIẢM GIÁ 50K - ĐƠN HÀNG TỪ 300K', desc: 'Áp dụng cho sách tiếng Anh- ĐƠN HÀNG TỪ 200K', type: "discount" },
    { id: 7, title: 'MÃ GIẢM GIÁ 50K - ĐƠN HÀNG TỪ 300K', desc: 'Áp dụng cho sách tiếng Anh- ĐƠN HÀNG TỪ 200K', type: "discount" },
    { id: 2, title: 'MÃ FREESHIP 30K - ĐƠN HÀNG TỪ 200K', desc: 'Áp dụng cho tất cả các loại sách- ĐƠN HÀNG TỪ 200K', type: "freeship" },
    { id: 4, title: 'MÃ FREESHIP 30K - ĐƠN HÀNG TỪ 200K', desc: 'Áp dụng cho tất cả các loại sách- ĐƠN HÀNG TỪ 200K', type: "freeship" },
    { id: 8, title: 'MÃ FREESHIP 30K - ĐƠN HÀNG TỪ 200K', desc: 'Áp dụng cho tất cả các loại sách- ĐƠN HÀNG TỪ 200K', type: "freeship" },
    { id: 9, title: 'MÃ FREESHIP 30K - ĐƠN HÀNG TỪ 200K', desc: 'Áp dụng cho tất cả các loại sách- ĐƠN HÀNG TỪ 200K', type: "freeship" },
    { id: 10, title: 'MÃ FREESHIP 30K - ĐƠN HÀNG TỪ 200K', desc: 'Áp dụng cho tất cả các loại sách- ĐƠN HÀNG TỪ 200K', type: "freeship" },
  ],
  selectedDiscountVoucherId: null,
  selectedFreeshipVoucherId: null,
  viewedVoucherId: null,
};

const voucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
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

export const { applyVoucher, deselectVoucher, viewVoucherDetail, clearViewedVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;
