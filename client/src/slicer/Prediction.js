import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestHandler from "./requestHandler";


const initialState = {
  prediction: [],
  status: "idle",
  message: "",
};

export const createPrediction = createAsyncThunk(
  "predictions/create",
  async (credentials, ThunkAPI) => {
    try {
      const token =
      ThunkAPI.getState().auth.user.token?.access_token ??
      JSON.parse(localStorage.getItem("user")).token.access_token;
      const res = await requestHandler.axioPostHeader(
        "predict",
        credentials,
        token
      );
      return res?.data;
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

export const getPrediction = createAsyncThunk(
  "predictions/get_all",
  async (_, ThunkAPI) => {
    try {
      const token =
      ThunkAPI.getState().auth.user.token?.access_token ??
      JSON.parse(localStorage.getItem("user")).token.access_token;
      const res = await requestHandler.axioGetHeader("predictions", token );
      return res?.data;
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


export const deletePrediction = createAsyncThunk(
  "predictions/delete",
  async (credentials, ThunkAPI) => {
    try {
      const token =
        ThunkAPI.getState().auth.user.token ??
        JSON.parse(localStorage.getItem("user")).token;
      const res = await requestHandler.axioDeleteHeader(
        `predictions/${credentials._id}`,
        token
      );
      return res?.data;
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

const predictionSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    reseter: (state) => {
      state.status = "idle";
      state.message = "";
    },
  },
  extraReducers: {
    [createPrediction.pending]: (state) => {
      state.status = "loading";
    },
    [createPrediction.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.prediction.push(payload?.db_prediction);
      
    },
    [createPrediction.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.message = payload;
    },
    [getPrediction.pending]: (state) => {
      state.status = "loading";
    },
    [getPrediction.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.status = "idle";
      state.prediction = payload;
    },
    [getPrediction.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.message = payload;
      state.status = "idle";
    },
    //deletecase
    [deletePrediction.pending]: (state) => {
      state.status = "loading";
    },
    [deletePrediction.rejected]: (state, { payload }) => {
      state.status = "failed";
      state.message = payload;
    },
    [deletePrediction.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      const { _id } = payload.data;
      state.prediction = state.prediction.filter((p) => p._id !== _id);
    },
  },
});

const { reducer, actions } = predictionSlice;
export const selectAllPrediction = (state) => state?.prediction?.prediction;
export const getPredictionStatus = (state) => state?.prediction?.status;
export const getPredictionError = (state) => state?.prediction?.message;
export const getPredictionById = (state, id) =>
  state.prediction.prediction.find((pre) => pre._id === id);

export const { reseter } = actions;
export default reducer;