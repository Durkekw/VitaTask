import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice.js";
import teamReducer from "../slices/teamSlice.js";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        team: teamReducer,
    },
});

