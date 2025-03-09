import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { updateUserTeamId } from "../slices/authSlice.js";

// Асинхронные действия (thunks)
export const createTeam = createAsyncThunk(
    "team/createTeam",
    async ({ teamName, userId }, { rejectWithValue, dispatch }) => {
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
                user_id: userId,
                team_id: teamId,
            });
            return response.data; // Ожидаем, что бэкенд возвращает данные о добавлении
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUnteamedUsers = createAsyncThunk(
    "team/fetchUnteamedUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8080/unteamed-users");
            console.log("Server response:", response.data); // Логируем ответ сервера
            return response.data; // Ожидаем массив пользователей
        } catch (error) {
            console.error("Error fetching unteamed users:", error); // Логируем ошибку
            return rejectWithValue(error.response.data);
        }
    }
);

// Новое действие для загрузки участников команды
export const fetchTeamMembers = createAsyncThunk(
    "team/fetchTeamMembers",
    async (teamId, { rejectWithValue }) => {
        if (!teamId) {
            return rejectWithValue("teamId is required");
        }
        try {
            const response = await axios.get(`http://localhost:8080/team/${teamId}/members`);
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
        team: null, // Текущая команда
        teamId: JSON.parse(localStorage.getItem("teamId")) || null, // Загружаем teamId из localStorage
        members: [], // Участники команды
        unteamedUsers: [],
        loading: false,
        error: null,
        isDataLoaded: false, // Флаг для загрузки
    },
    reducers: {
        setTeam: (state, action) => {
            state.team = action.payload;
        },
        clearTeam: (state) => {
            state.team = null;
            state.teamId = null;
            localStorage.removeItem("teamId");
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
            })
            .addCase(fetchTeamMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload; // Сохраняем список участников
            })
            .addCase(fetchTeamMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUnteamedUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
                console.log("Fetching unteamed users...");
            })
            .addCase(fetchUnteamedUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.unteamedUsers = action.payload; // Обновляем данные
                state.isDataLoaded = true;
                console.log("Updated unteamedUsers in Redux:", state.unteamedUsers);
            })
            .addCase(fetchUnteamedUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Error fetching unteamed users:", action.payload);
            });
    },
});

export const { setTeam, clearTeam } = teamSlice.actions;
export default teamSlice.reducer;
