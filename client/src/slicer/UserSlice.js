import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestHandler from "./requestHandler";
const API_URL = "users";

const initialState = {
  users: [],
  status: "idle",
  message: "",
};

export const getUsers = createAsyncThunk(
  "users/get_all",
  async (_, ThunkAPI) => {
    try {

      const token =
        ThunkAPI.getState().auth.user.token?.access_token ??
        JSON.parse(localStorage.getItem("user")).token.access_token;
      return await requestHandler.axioGetHeader(`${API_URL}`, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message.toString() ||
        error.toString();
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (credentials, ThunkAPI) => {
    try {
      const { _id, ...rest } = credentials;
      const token =
      ThunkAPI.getState().auth.user.token?.access_token ??
      JSON.parse(localStorage.getItem("user")).token.access_token;
      return requestHandler.axioPatchHeader(`${API_URL}/${_id}`, rest, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message.toString() ||
        error.toString();
      return ThunkAPI.rejectWithValue(message);
    }
  }
);
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (credentials, ThunkAPI) => {
    try {
      const token =
        ThunkAPI.getState().auth.user.token ??
        JSON.parse(localStorage.getItem("user")).token;
      return requestHandler.axioDeleteHeader(
        `${API_URL}/${credentials._id}`,
        token
      );
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message.toString() ||
        error.toString();
      return ThunkAPI.rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reseter: (state) => {
      state.status = "";
      state.message = "";
    },
  },
  extraReducers: {
    [getUsers.pending]: (state) => {
      state.status = "loading";
    },
    [getUsers.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.users = payload.data;
      state.status = "idle";
    },
    [getUsers.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.message = payload;
      state.status = "idle";
    },
    //update case
    [updateUser.pending]: (state) => {
      state.status = "loading";
    },
    [updateUser.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.mesage = payload;
    },
    [updateUser.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.users.map((s) => (payload.data._id === s._id ? payload.data : s));
    },
    //deletecase
    [deleteUser.pending]: (state) => {
      state.status = "loading";
    },
    [deleteUser.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.message = payload;
    },
    [deleteUser.fulfilled]: (state, { payload }) => {
      state.status = "suceeded";
      state.users.filter((us) => us._id !== payload.data._id);
    },
  },
});
export const fetchUsers = (state) => state?.users?.users;
export const getUsersById = (state, id) =>
  state.users.users.find((c) => c.id === id);
export const { reseter } = userSlice.actions;
export default userSlice.reducer;