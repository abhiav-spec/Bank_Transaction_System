import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  successMessage: null,
  isAdmin: false,
  adminChecked: false,
};

export const hydrateAuthFromStorage = createAsyncThunk('auth/hydrate', async () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
});

export const registerUser = createAsyncThunk('auth/register', async (payload) => {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
});

export const loginUser = createAsyncThunk('auth/login', async (payload) => {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/api/auth/logout');
  return true;
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (payload) => {
  const { data } = await api.post('/api/auth/forgot-password', payload);
  return data;
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload) => {
  const { data } = await api.post('/api/auth/reset-password', payload);
  return data;
});

export const setTransactionPassword = createAsyncThunk('auth/setTransactionPassword', async (payload) => {
  const { data } = await api.post('/api/auth/transaction-password/set', payload);
  return data;
});

export const updateTransactionPassword = createAsyncThunk('auth/updateTransactionPassword', async (payload) => {
  const { data } = await api.post('/api/auth/transaction-password/update', payload);
  return data;
});

export const checkAdminAccess = createAsyncThunk('auth/checkAdmin', async (_, { rejectWithValue }) => {
  try {
    await api.get('/api/accounts/system/all');
    return true;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuthFromStorage.fulfilled, (state, action) => {
        state.token = action.payload.token || null;
        state.user = action.payload.user || null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.data.id,
          name: action.payload.data.name,
          email: action.payload.data.email,
          role: action.payload.data.role || null,
        };
        state.token = action.payload.data.token;
        state.successMessage = action.payload.message;
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAdmin = false;
        state.adminChecked = true;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAdmin = false;
        state.adminChecked = true;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(setTransactionPassword.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.error = null;
      })
      .addCase(setTransactionPassword.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateTransactionPassword.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.error = null;
      })
      .addCase(updateTransactionPassword.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(checkAdminAccess.pending, (state) => {
        state.adminChecked = false;
      })
      .addCase(checkAdminAccess.fulfilled, (state) => {
        state.isAdmin = true;
        state.adminChecked = true;
        if (state.user) {
          state.user = { ...state.user, role: 'system' };
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(checkAdminAccess.rejected, (state) => {
        state.isAdmin = false;
        state.adminChecked = true;
        if (state.user && !state.user.role) {
          state.user = { ...state.user, role: 'user' };
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      });
  },
});

export const { clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
