import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  list: [],
  balances: {},
  adminAccounts: [],
  selectedPaymentAccountId: typeof window !== 'undefined' ? localStorage.getItem('selectedPaymentAccountId') || '' : '',
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', async () => {
  const { data } = await api.get('/api/accounts');
  return data.data;
});

export const createAccount = createAsyncThunk('accounts/createAccount', async (payload) => {
  const { data } = await api.post('/api/accounts', payload);
  return data;
});

export const fetchAccountBalance = createAsyncThunk('accounts/fetchBalance', async (accountId) => {
  const { data } = await api.get(`/api/accounts/balance/${accountId}`);
  return { accountId, balance: data.data.balance };
});

export const fetchAllAccountsAdmin = createAsyncThunk('accounts/fetchAllAdmin', async () => {
  const { data } = await api.get('/api/accounts/system/all');
  return data.data;
});

export const updateAccountStatusAdmin = createAsyncThunk('accounts/updateStatusAdmin', async ({ accountId, status }) => {
  const { data } = await api.patch(`/api/accounts/system/${accountId}/status`, { status });
  return data.data;
});

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearAccountMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setSelectedPaymentAccount: (state, action) => {
      state.selectedPaymentAccountId = action.payload || '';
      if (typeof window !== 'undefined') {
        if (action.payload) localStorage.setItem('selectedPaymentAccountId', action.payload);
        else localStorage.removeItem('selectedPaymentAccountId');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        if (
          state.selectedPaymentAccountId
          && !action.payload.some((account) => account._id === state.selectedPaymentAccountId)
        ) {
          state.selectedPaymentAccountId = '';
          if (typeof window !== 'undefined') {
            localStorage.removeItem('selectedPaymentAccountId');
          }
        }
        state.error = null;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload.data);
        state.successMessage = action.payload.message;
        state.error = null;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAccountBalance.fulfilled, (state, action) => {
        state.balances[action.payload.accountId] = action.payload.balance;
      })
      .addCase(fetchAllAccountsAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAccountsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminAccounts = action.payload;
        state.error = null;
      })
      .addCase(fetchAllAccountsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateAccountStatusAdmin.fulfilled, (state, action) => {
        state.successMessage = 'Status updated';
        state.error = null;
        state.adminAccounts = state.adminAccounts.map((account) =>
          account._id === action.payload._id ? action.payload : account,
        );
      })
      .addCase(updateAccountStatusAdmin.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearAccountMessages, setSelectedPaymentAccount } = accountsSlice.actions;
export default accountsSlice.reducer;
