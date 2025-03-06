import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Асинхронные действия (thunks)
export const createTeam = createAsyncThunk(
    "team/createTeam",
    async ({ teamName, userId }, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/create-team", {
                teamName,
                userId,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addUserToTeam = createAsyncThunk(
    "team/addUserToTeam",
    async ({ userId, teamId }, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/add-user-to-team", {
                userId,
                teamId,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Слайс
const teamSlice = createSlice({
    name: "team",
    initialState: {
        team: null,
        loading: false,
        error: null,
    },
    reducers: {
        setTeam: (state, action) => {
            state.team = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.team = action.payload;
            })
            .addCase(createTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addUserToTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUserToTeam.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addUserToTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setTeam } = teamSlice.actions;
export default teamSlice.reducer;
