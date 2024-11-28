import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWallet } from '../../apis/wallet';

interface WalletState {
  balance: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WalletState = {
  balance: 0,
  status: 'idle',
  error: null,
};

export const fetchWallet = createAsyncThunk('wallet/fetchWallet', async () => {
  const response = await getWallet();
  return response.data;
});

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.balance = action.payload.coins;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch wallet';
      });
  },
});

export default walletSlice.reducer;