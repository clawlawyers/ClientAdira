import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NODE_API_ENDPOINT } from "../utils/utils";

export const retrieveDrafterAuth = createAsyncThunk(
  "auth/retrieveAuth",
  async () => {
    const storedAuth = localStorage.getItem("drafter-auth");
    if (storedAuth) {
      const props = await fetch(`${NODE_API_ENDPOINT}/clientAdira/getuser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${parsedUser.token}`,
        },
      });
      const parsedProps = await props.json();
      console.log(parsedProps);
      return {
        user: parsedProps.data.user,
      };
    } else return null;
  }
);

const initialState = {
  user: null,
  isOtpVerified: false,
  fileBlob: false,
  status: "unfullfilled",
  userLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = "success";
      localStorage.setItem("drafter-auth", JSON.stringify(action.payload));
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
    setLoadingTrue: (state) => {
      state.userLoading = true;
    },
    setLoadingFalse: (state) => {
      state.userLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveDrafterAuth.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(retrieveDrafterAuth.fulfilled, (state, action) => {
      if (action.payload && action.payload.user) {
        state.user = action.payload.user;
      }
      state.status = "success";
    });
    builder.addCase(retrieveDrafterAuth.rejected, (state) => {
      state.status = "unfullfilled";
      state.user = null;
    });
  },
});

export const {
  setUser,
  setOtpVerified,
  resetAuth,
  setFileBlob,
  setLoadingTrue,
  setLoadingFalse,
} = authSlice.actions;

export default authSlice.reducer;
