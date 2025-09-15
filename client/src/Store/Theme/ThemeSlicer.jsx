// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// export const detectTheme = createAsyncThunk("theme/detect", async () => {
//   if (typeof window !== "undefined") {
//     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     return prefersDark ? "dark" : "light";
//   }
//   return "dark"; // fallback (SSR)
// });

// const themeSlice = createSlice({
//   name: "theme",
//   initialState: { theme: "dark" },
//   reducers: {
//     setTheme: (state, action) => {
//       state.theme = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(detectTheme.fulfilled, (state, action) => {
//       state.theme = action.payload;
//     });
//   },
// });

// export const { setTheme } = themeSlice.actions;
// export default themeSlice.reducer;
