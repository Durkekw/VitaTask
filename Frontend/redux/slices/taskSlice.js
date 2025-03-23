import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Асинхронное действие для создания задачи и загрузки обновленного списка задач
export const createTaskAndFetch = createAsyncThunk(
    "task/createTaskAndFetch",
    async ({ taskTitle, taskDesc, taskStatus, deadline, teamID, userID }, { dispatch, rejectWithValue }) => {
        try {
            const createResponse = await axios.post(
                "http://localhost:8080/create-task",
                {
                    taskTitle,
                    taskDesc,
                    taskStatus,
                    deadline,
                    teamID,
                    userID,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Задача успешно создана:", createResponse.data);

            // После создания задачи загружаем обновленный список задач
            await dispatch(fetchTasks(teamID));

            return createResponse.data;
        } catch (error) {
            console.error("Ошибка при создании задачи:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Асинхронное действие для загрузки задач по teamId
export const fetchTasks = createAsyncThunk(
    "task/fetchTasksByTeam",
    async (teamId, { rejectWithValue }) => {
        try {
            console.log("Fetching tasks for team ID:", teamId);
            const response = await axios.get(`http://localhost:8080/tasks/${teamId}`);
            console.log("Задачи для команды успешно загружены:", response.data);
            return response.data || [];
        } catch (error) {
            console.error("Ошибка при загрузке задач для команды:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteTask = createAsyncThunk(
    "task/deleteTask",
    async (taskId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`http://localhost:8080/tasks/${taskId}`);
            return response.data; // Ожидаем, что бэкенд возвращает ID удаленной задачи
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Асинхронное действие для обновления задачи
export const updateTask = createAsyncThunk(
    "task/updateTask",
    async ({ taskId, taskTitle, taskDescription, taskStatus, deadline, userID }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:8080/tasks/${taskId}`, {
                taskTitle,
                taskDescription,
                taskStatus,
                deadline,
                userID: parseInt(userID, 10), // Убедитесь, что userID передается как число
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при обновлении задачи:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Слайс для управления состоянием задач
const taskSlice = createSlice({
    name: "task",
    initialState: {
        tasks: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Здесь можно добавить дополнительные редьюсеры, если нужно
    },
    extraReducers: (builder) => {
        builder
            // Обработка createTaskAndFetch
            .addCase(createTaskAndFetch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTaskAndFetch.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
                console.log("Задача успешно создана:", action.payload);
            })
            .addCase(createTaskAndFetch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Ошибка при создании задачи:", action.payload);
            })

            // Обработка fetchTasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
                console.log("Задачи успешно загружены:", action.payload);
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Ошибка при загрузке задач:", action.payload);
            })

            // Обработка updateTask
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                // Обновляем задачу в списке задач
                const updatedTask = action.payload;
                state.tasks = state.tasks.map(task =>
                    task.task_id === updatedTask.task_id ? updatedTask : task
                );
                console.log("Задача успешно обновлена:", updatedTask);
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Ошибка при обновлении задачи:", action.payload);
            })

            // Обработка deleteTask
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                // Удаляем задачу из списка задач
                const deletedTaskId = action.payload.taskId;
                state.tasks = state.tasks.filter(task => task.task_id !== deletedTaskId);
                console.log("Задача успешно удалена:", deletedTaskId);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Ошибка при удалении задачи:", action.payload);
            });
    },
});

export default taskSlice.reducer;
