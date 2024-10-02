// src/redux/slices/authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    firstName: "",
    lastName: "",
    number: "",
  },
  isOtpVerified: false,
  fileBlob: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...action.payload };
    },
    setOtpVerified: (state, action) => {
      state.isOtpVerified = action.payload;
    },
    resetAuth: (state) => {
      return initialState;
    },
    setFileBlob: (state, action) => {
      
      state.fileBlob = action.payload;
    },
  },
});

export const { setFormData, setOtpVerified, resetAuth, setFileBlob } =
  authSlice.actions;

export default authSlice.reducer;
