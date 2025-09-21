import "./style.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats } from "../../../../redux/slices/messengerSlice";
import Chat from "../../Elements/Chat/Chat.jsx";

export default function Messenger() {
    const dispatch = useDispatch();
    const { chats, loading, error } = useSelector((state) => state.messenger);
    const userId = useSelector((state) => state.user.user?.user_id);

    useEffect(() => {
        if (!userId) {
            console.error("User ID is not available. Please log in.");
            return;
        }
        dispatch(fetchChats(userId));
    }, [dispatch, userId]);

    if (loading) {
        return (
            <div className="container">
                <div className="messenger-container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Загрузка чатов...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="messenger-container">
                    <div className="error-container">
                        <h2>Ошибка загрузки</h2>
                        <p>{error.message || "Неизвестная ошибка"}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!Array.isArray(chats) || chats.length === 0) {
        return (
            <div className="container">
                <div className="messenger-container">
                    <div className="empty-chats">
                        <div className="empty-icon">💬</div>
                        <p>Нет активных чатов</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="messenger-container">
                <div className="chats-list">
                    {chats.map((chat) => (
                        <Chat
                            key={chat.chat_id}
                            chatId={chat.chat_id}
                            receiverId={chat.user_id}
                            receiverName={chat.name}
                            receiverSurname={chat.surname}
                            lastMessage={chat.last_message}
                            lastMessageTime={chat.last_message_time}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}