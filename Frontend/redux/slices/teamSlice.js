import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { updateUserTeamId } from "../slices/authSlice.js";

// Асинхронные действия (thunks)
export const createTeam = createAsyncThunk(
    "team/createTeam",
    async ({ teamName, userId }, { rejectWithValue, dispatch }) => { // Добавляем dispatch
        try {
            const response = await axios.post("http://localhost:8080/create-team", {
                teamName,
                userId,
            });

            // После успешного создания команды, обновляем team_id у пользователя
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                user.team_id = response.data.teamId; // Обновляем team_id у пользователя
                localStorage.setItem("user", JSON.stringify(user)); // Сохраняем обновленные данные пользователя

                // Вызываем действие для обновления team_id в authSlice
                dispatch(updateUserTeamId(response.data.teamId));
            }

            return response.data; // Возвращаем данные команды
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
            return response.data; // Ожидаем, что бэкенд возвращает данные о добавлении
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Слайс
const teamSlice = createSlice({
    name: "team",
    initialState: {
        team: null, // Текущая команда
        teamId: JSON.parse(localStorage.getItem("teamId")) || null, // Загружаем teamId из localStorage
        loading: false,
        error: null,
    },
    reducers: {
        setTeam: (state, action) => {
            state.team = action.payload; // Устанавливаем команду вручную
        },
        clearTeam: (state) => {
            state.team = null;
            state.teamId = null;
            localStorage.removeItem("teamId"); // Очищаем teamId из localStorage
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
                state.teamId = action.payload.teamId; // Сохраняем teamId
                localStorage.setItem("teamId", JSON.stringify(action.payload.teamId)); // Сохраняем teamId в localStorage

                // Обновляем данные пользователя в localStorage
                const user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                    user.team_id = action.payload.teamId; // Обновляем team_id у пользователя
                    localStorage.setItem("user", JSON.stringify(user)); // Сохраняем обновленные данные пользователя
                }
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
                // Обновляем команду, если нужно
            })
            .addCase(addUserToTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setTeam, clearTeam } = teamSlice.actions;
export default teamSlice.reducer;
