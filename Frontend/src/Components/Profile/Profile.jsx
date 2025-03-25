import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import {useEffect, useState} from "react";
import { NavLink, useParams } from "react-router-dom";
import logo from '../../img/logo/Group.svg';
import { clearSelectedUser, fetchUserById } from "../../../redux/slices/userSlice";
import { fetchChats, sendMessage } from "../../../redux/slices/messengerSlice.js";

export default function Profile() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const { selectedUser, loading, error } = useSelector((state) => state.user);
    const { chats } = useSelector((state) => state.messenger);
    const currentUser = useSelector((state) => state.user.user);
    const [isSending, setIsSending] = useState(false);


    console.log("User ID from URL:", userId); // Логируем userId

    useEffect(() => {
        return () => {
            dispatch(clearSelectedUser());
        };
    }, [dispatch]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserById(userId))
                .unwrap()
                .then((user) => {
                    console.log("User loaded:", user); // Логируем загруженного пользователя
                })
                .catch((error) => {
                    console.error("Error loading user:", error); // Логируем ошибку
                });
            dispatch(fetchChats(currentUser.user_id));
        }
    }, [dispatch, userId, currentUser.user_id]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message || "Неизвестная ошибка"}</div>;
    }

    if (!selectedUser) {
        return <div>Пользователь не найден</div>;
    }




    const handleSendMessage = async () => {
        console.log("handleSendMessage called"); // Логируем вызов функции

        if (isSending) {
            console.log("Already sending a message...");
            return;
        }

        setIsSending(true); // Устанавливаем флаг перед отправкой запроса

        try {
            // Проверяем, существует ли уже чат между текущим пользователем и выбранным пользователем
            const existingChat = chats.find(chat => chat.user_id === parseInt(userId));

            if (existingChat) {
                // Если чат уже существует, перенаправляем пользователя в этот чат
                window.location.href = `/im/${existingChat.chat_id}`;
            } else {
                // Если чата нет, создаем новый чат и отправляем сообщение
                console.log("Sending request to server..."); // Логируем отправку запроса
                const response = await fetch("http://localhost:8080/send-message", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: currentUser.user_id,
                        receiver_id: parseInt(userId),
                        content: "Новый чат",
                    }),
                });

                if (!response.ok) {
                    throw new Error("Ошибка при создании чата");
                }



                const data = await response.json();
                dispatch(fetchChats(currentUser.user_id));
                console.log("Response from server:", data); // Логируем ответ от сервера
                window.location.href = `/im/${data.chat_id}`;
            }
        } catch (error) {
            console.error("Ошибка при создании чата:", error);
        } finally {
            setIsSending(false); // Сбрасываем флаг после завершения
        }
    };

    return (
        <div className="container">
            <div className="profile">
                <img className="profile-pic" src={logo} alt="profile" />
                <div className="profile-text">
                    <h2 className="profile-surname">{selectedUser.surname}</h2>
                    <h2 className="profile-name">{selectedUser.name}</h2>
                </div>
                <button onClick={handleSendMessage}  disabled={isSending} className="btn profile-btn">
                    Отправить сообщение
                </button>
            </div>
        </div>
    );
}
