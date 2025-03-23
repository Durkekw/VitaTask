import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/userSlice.js";
import teamReducer from "../slices/teamSlice.js";
import taskReducer from "../slices/taskSlice.js";
import messengerSlice from "../slices/messengerSlice.js";


export const store = configureStore({
    reducer: {
        user: authReducer,
        team: teamReducer,
        task: taskReducer,
        messenger: messengerSlice,
    },
});

