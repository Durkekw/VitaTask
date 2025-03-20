import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {createTeam, fetchTeamMembers} from "./teamSlice.js";

export const createTask = createAsyncThunk(
    "task/createTask",
    async ({taskTitle, taskDesc, taskStatus, deadline, teamID, userID}, {rejectWithValue, dispatch}) => {
        try{
            const response = await axios.post("http://localhost:8080/create-task", {
                taskTitle,
                taskDesc,
                taskStatus,
                deadline,
                teamID,
                userID
            });
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)

export const fetchTasks = createAsyncThunk(
    "task/fetchTasks",
    async (_, { rejectWithValue }) => {
        try{
            const response = await axios.get("http://localhost:8080/tasks");
            console.log("Server response:", response.data);
            return response.data;
        }
        catch(error){
            console.error("Error fetching tasks:", error);
            return rejectWithValue(error.response.data);
        }
    }
)

const taskSlice = createSlice({
    name: "task",
    initialState: {
        task: null,
        tasks: [],
        loading: false,
        error: null,
    },
    reducers: {
        setTask: (state, action) => {
            state.task = action.payload;
        }
    },
    extraReducers: (builder) => {
    builder
        .addCase(createTask.pending, (state) => {
            state.loading = true;
            state.error = null;
    })
        .addCase(createTask.fulfilled, (state, action) => {
            state.loading = true;
            state.error = null;

        })
        .addCase(createTask.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchTasks.pending, (state) => {
            state.loading = true;
            state.error = null;
            console.log("Fetching tasks...");
        })
        .addCase(fetchTasks.fulfilled, (state, action) => {
            state.loading = false;
            state.tasks = action.payload;
            console.log("Tasks fetched:", action.payload);
        })
        .addCase(fetchTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            console.error("Error fetching team members:", action.payload);
        })
    }
})
