import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  list: [],
  adminList: [],
  loading: false,
  adminLoading: false,
  error: null,
  adminError: null,
  successMessage: null,
};

export const fetchTransactions = createAsyncThunk('transactions/fetch', async () => {
  const { data } = await api.get('/api/transactions');
  return data.data;
});

export const createTransaction = createAsyncThunk('transactions/create', async (payload) => {
  const { data } = await api.post('/api/transactions', payload);
  return data;
});

export const createSystemInitialFunding = createAsyncThunk('transactions/createSystemFunding', async (payload) => {
  const { data } = await api.post('/api/transactions/system/initial-funds', payload);
  return data;
});

export const fetchSystemTransactions = createAsyncThunk(
  'transactions/fetchSystemAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/transactions');
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSystemTransactions.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(fetchSystemTransactions.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminList = action.payload;
      })
      .addCase(fetchSystemTransactions.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload || action.error.message;
      })
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload.transaction);
        state.successMessage = action.payload.message;
        state.error = null;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSystemInitialFunding.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSystemInitialFunding.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.error = null;
      })
      .addCase(createSystemInitialFunding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearTransactionMessages } = transactionsSlice.actions;
export default transactionsSlice.reducer;
