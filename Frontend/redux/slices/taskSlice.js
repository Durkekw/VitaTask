import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

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
    }
})
