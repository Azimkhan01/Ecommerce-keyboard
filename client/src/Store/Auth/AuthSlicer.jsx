import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to check auth
export const CheckAuth = createAsyncThunk("auth/check", async () => {
  try {
    const res = await axios.get("/auth/isAuth"); // Make sure backend route matches
    return res.data; // e.g., { status: true, email: "...", username: "..." }
  } catch (err) {
    throw err.response?.data?.message || "Something went wrong";
  }
});

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    status: false,
    error: "",
    isError: false,
    loading: false,
    username: "",
    email: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CheckAuth.pending, (state) => {
        state.loading = true;
        state.status = false;
        state.isError = false;
        state.error = "";
      })
      .addCase(CheckAuth.rejected, (state, action) => {
        state.loading = false;
        state.status = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(CheckAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.isError = false;
        state.error = "";
      });
  },
});

export default AuthSlice.reducer;
