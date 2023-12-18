import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../slicer/Auth"
import predictionReducer from "../slicer/Prediction"
import userReducer from "../slicer/UserSlice"

export const store = configureStore({
  reducer: {
    auth:authReducer,
    prediction: predictionReducer,
    users: userReducer,
  },
})