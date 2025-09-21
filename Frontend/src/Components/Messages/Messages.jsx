import "./style.css";
import { NavLink, useParams } from "react-router-dom";
import ecs from "../../img/png-klev-club-bewz-p-krestik-chernii-png-28.png";
import send from "../../img/free-icon-send-button-60525.png";
import { useEffect, useState } from "react";
import Message from "../Elements/Message/Message.jsx";
import { fetchMessages, sendMessage } from "../../../redux/slices/messengerSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Messages() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { messages, loading, error } = useSelector((state) => state.messenger);
    const [textValue, setTextValue] = useState("");
    const currentUser = useSelector((state) => state.user.user);

    const receiver = useSelector((state) => {
        const chat = state.messenger.chats.find(chat => chat.chat_id === parseInt(id));
        return chat ? chat: null;
    });

    useEffect(() => {
        if (!id) {
            console.error("Invalid chat ID:", id);
            return;
        }

        console.log("Fetching messages for chat ID:", id);
        dispatch(fetchMessages(id));
    }, [dispatch, id]);

    useEffect(() => {
        const messagesContainer = document.querySelector(".messages-container");
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages]);

    const handleTextChange = (event) => {
        setTextValue(event.target.value);
    };

    const handleButtonClick = () => {
        if (textValue.trim() && currentUser && receiver?.user_id) {
            dispatch(sendMessage({ 
                userId: currentUser.user_id, 
                chatId: id, 
                content: textValue.trim(), 
                receiverId: receiver.user_id 
            }));
            setTextValue("");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleButtonClick();
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="messages-container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Загрузка сообщений...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="messages-container">
                    <div className="error-container">
                        <h2>Ошибка загрузки</h2>
                        <p>{error.message || "Неизвестная ошибка"}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!receiver) {
        return (
            <div className="container">
                <div className="messages-container">
                    <div className="error-container">
                        <h2>Чат не найден</h2>
                        <p>Пользователь не найден или чат недоступен</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="messages-container">
                <div className="chat-header">
                    <NavLink to={"/messenger"} className="back-button">
                        <div className="back-icon"></div>
                    </NavLink>
                    <div className="user-info">
                        <h2 className="user-name">{receiver.surname} {receiver.name}</h2>
                        <p className="user-status">В сети</p>
                    </div>
                </div>
                
                <div className="messages-area">
                    {messages && messages.length > 0 ? (
                        messages.map((message) => (
                            <Message
                                key={message.message_id}
                                message={message.content}
                                time={message.created_at}
                                isCurrentUser={message.user_id === currentUser.user_id}
                            />
                        ))
                    ) : (
                        <div className="empty-messages">
                            <div className="empty-icon">💬</div>
                            <p>Начните общение!</p>
                        </div>
                    )}
                </div>
                
                <div className="message-input">
                    <div className="input-container">
                        <textarea
                            className="message-textarea"
                            value={textValue}
                            onChange={handleTextChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Введите ваше сообщение..."
                            rows="1"
                        />
                        <button 
                            className="send-button" 
                            onClick={handleButtonClick}
                            disabled={!textValue.trim()}
                        >
                            <img className="send-icon" src={send} alt="Отправить" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}