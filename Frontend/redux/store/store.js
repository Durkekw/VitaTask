import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/userSlice.js";
import teamReducer from "../slices/teamSlice.js";


export const store = configureStore({
    reducer: {
        user: authReducer,
        team: teamReducer,
    },
});

