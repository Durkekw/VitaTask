import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Асинхронные действия
export const sendMessage = createAsyncThunk(
    "messenger/sendMessage",
    async ({ userId, chatId, content, receiverId }, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/send-message", {
                user_id: userId,
                receiver_id: receiverId,
                chat_id: chatId,
                content: content,
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Неизвестная ошибка при отправке сообщения");
        }
    }
);

export const fetchMessages = createAsyncThunk(
    "messenger/fetchMessages",
    async (chatId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:8080/messages/${chatId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Неизвестная ошибка при загрузке сообщений");
        }
    }
);

export const fetchChats = createAsyncThunk(
    "messenger/fetchChats",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:8080/users-with-chats/${userId}`);
            console.log("Fetched chats:", response.data); // Логируем полученные данные
            return response.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || "Неизвестная ошибка при загрузке чатов");
        }
    }
);

export const fetchUserById = createAsyncThunk(
    "messenger/fetchUserById",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:8080/messenger/user/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Неизвестная ошибка при загрузке пользователя");
        }
    }
);

// Слайс
const messengerSlice = createSlice({
    name: "messenger",
    initialState: {
        chats: JSON.parse(localStorage.getItem("chats")) || [], // Загружаем чаты из localStorage
        messages: [],
        currentChatUser: JSON.parse(localStorage.getItem("currentChatUser")) || null,
        loading: false,
        error: null,
    },
    reducers: {
        // Очищаем данные о текущем пользователе чата
        clearCurrentChatUser: (state) => {
            state.currentChatUser = null;
            localStorage.removeItem("currentChatUser"); // Удаляем данные из localStorage
        },
        // Устанавливаем данные о текущем пользователе чата
        setCurrentChatUser: (state, action) => {
            state.currentChatUser = action.payload;
            localStorage.setItem("currentChatUser", JSON.stringify(action.payload)); // Сохраняем данные в localStorage
        },
    },
    extraReducers: (builder) => {
        builder
            // Отправка сообщения
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;

                // Используем данные из ответа сервера
                const newMessage = {
                    message_id: action.payload.message_id,
                    content: action.payload.content,
                    user_id: action.payload.user_id,
                    chat_id: action.payload.chat_id,
                    created_at: action.payload.created_at,
                };

                console.log("New message added to Redux:", newMessage);
                state.messages = [...state.messages, newMessage]; // Добавляем сообщение в массив
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Загрузка сообщений
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload; // Устанавливаем сообщения
                console.log("Messages in state:", state.messages);
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Загрузка чатов
            .addCase(fetchChats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload || []; // Устанавливаем чаты
                localStorage.setItem("chats", JSON.stringify(action.payload)); // Сохраняем чаты в localStorage
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Загрузка данных пользователя
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentChatUser = action.payload; // Устанавливаем данные пользователя
                localStorage.setItem("currentChatUser", JSON.stringify(action.payload)); // Сохраняем в localStorage
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Экспортируем actions
export const { clearCurrentChatUser, setCurrentChatUser } = messengerSlice.actions;

export default messengerSlice.reducer;
