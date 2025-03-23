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
        return <div>Загрузка чатов...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message || "Неизвестная ошибка"}</div>;
    }

    if (!Array.isArray(chats) || chats.length === 0) {
        return <div>Чаты не найдены</div>;
    }

    return (
        <div className="messenger">
            <div className="container">
                {chats.map((chat) => (
                    <Chat
                        key={chat.chat_id}
                        chatId={chat.chat_id}
                        receiverId={chat.user_id}
                        receiverName={chat.name}
                        receiverSurname={chat.surname}
                    />
                ))}
            </div>
        </div>
    );
}
