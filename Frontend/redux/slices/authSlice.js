import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Асинхронные действия (thunks)
export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/login", {
                email,
                password,
            });
            return response.data; // Ожидаем, что бэкенд возвращает данные пользователя
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async ({ email, password, name, surname, team_id }, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/register", {
                email,
                password,
                name,
                surname,
                team_id,
            });
            return response.data; // Ожидаем, что бэкенд возвращает данные пользователя
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Слайс
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        isAuthenticated: !!JSON.parse(localStorage.getItem("user")),
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
        },
        loadUser: (state) => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                state.user = user;
                state.isAuthenticated = true;
            }
        },
        updateUserTeamId: (state, action) => {
            if (state.user) {
                state.user.team_id = action.payload; // Обновляем team_id у пользователя
                localStorage.setItem("user", JSON.stringify(state.user)); // Сохраняем обновленные данные пользователя
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload; // Сохраняем данные пользователя
                localStorage.setItem("user", JSON.stringify(action.payload)); // Сохраняем в localStorage
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload; // Сохраняем данные пользователя
                localStorage.setItem("user", JSON.stringify(action.payload)); // Сохраняем в localStorage
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, loadUser, updateUserTeamId } = authSlice.actions;
export default authSlice.reducer;
