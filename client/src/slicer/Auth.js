import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestHandler from "../slicer/requestHandler";

const API_URL = "users";
export const gettate = () => {
  try {
    const user = localStorage.getItem("user");
    if (user === null) return undefined;
    return JSON.parse(user);
  } catch (error) {
    return undefined;
  }
};

const initialState = {
  user: gettate(),
  status: "idle",
  message: "",
};

// Register user
export const register = createAsyncThunk(
  "user/register",
  async (credentials, { rejectWithValue }) => {
    try {
      return await requestHandler.axioPost(`${API_URL}/`, credentials);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "user/login",
  async (signupData, { rejectWithValue }) => {
    try {
      return await requestHandler.axioPost('login', signupData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

// Login user
export const resetLink = createAsyncThunk(
  "user/reset_link",
  async (resetInfo, { rejectWithValue }) => {
    try {
      return await requestHandler.axioPost(`${API_URL}/reset_link`, resetInfo);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);
// reset_password
export const resetPassword = createAsyncThunk(
  "user/reset",
  async (resetInfo, { rejectWithValue }) => {
    try {
      const {token, id, password}  = resetInfo 
      return await requestHandler.axioPost(`${API_URL}/reset_password/${id}/${token}`, {password});
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);


export const logout = createAsyncThunk("auth/logout", async (_, ThunkAPI) => {
  try {
    return await requestHandler.axioGet(`${API_URL}/logout`);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return ThunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogout: (state, action) => {
      localStorage.clear();
      state.user = null;
    },
    reseter: (state) => {
      state.status = "";
      state.message = "";
    },
  },
  extraReducers: {
    [register.pending]: (state) => {
      state.status = "loading";
    },
    [register.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.message =
        payload.status === 201
          ? ` ${payload?.data?.username} register successfully`
          : "Something went wrong";
    },
    [register.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.message = payload;
      state.user = null;
    },

    [login.pending]: (state) => {
      state.status = "loading";
    },
    [login.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      console.warn(payload)
      localStorage.setItem("user", JSON.stringify(payload.data));
      state.user = payload.data;
    },
    [login.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.message = payload;
      state.user = null;
    },
    [logout.fulfilled]: (state) => {
      state.user = null;
    },
    // resetPassword
    [resetPassword.pending]: (state) => {
      state.status = "loading";
    },
    [resetPassword.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.message = payload?.data?.message;;
    },
    [resetPassword.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.message = payload;
    },
    // resetLink
    [resetLink.pending]: (state) => {
      state.status = "loading";
    },
    [resetLink.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.message = payload?.data?.message;
    },
    [resetLink.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.message = payload;
    },


 
  },
});
export const getUser = (state) => state?.auth;
export const getCurrentUser = (state) => state?.auth?.user;
export const { setLogout, reseter } = authSlice.actions;
export default authSlice.reducer;