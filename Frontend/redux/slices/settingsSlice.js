import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

export const updateUser = createAsyncThunk(
    'settings/updateUser',
    async ({email, password, name, surname, userID}, { rejectWithValue }) => {
        try {
            const response = await axios.post(`http://localhost:8080/settings/${userID}`, {
                email,
                password,
                name,
                surname,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        loading: false,
        error: null,
    },
    reducers: {
            resetSettings: (state) => {
                state.user = null;
                state.loading = false;
                state.error = null;
            },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
               // window.location = 'http://localhost:5173/settings';
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
