import "./style.css";
import { NavLink, useParams } from "react-router-dom";
import ecs from "../../img/png-klev-club-bewz-p-krestik-chernii-png-28.png";
import send from "../../img/free-icon-send-button-60525.png";
import { useEffect, useState } from "react";
import Message from "../Elements/Message/Message.jsx";
import { fetchMessages, sendMessage } from "../../../redux/slices/messengerSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Messages() {
    const { id } = useParams(); // chatId из URL
    const dispatch = useDispatch();
    const { messages, loading, error } = useSelector((state) => state.messenger);
    const [textValue, setTextValue] = useState("");
    const currentUser = useSelector((state) => state.user.user);

    // Получаем информацию о пользователе, с которым ведется чат
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
        const messagesContainer = document.querySelector(".mesSpace");
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages]);

    const handleTextChange = (event) => {
        setTextValue(event.target.value);
    };

    const handleButtonClick = () => {
        console.log(receiver.user_id);
        if (textValue.trim() && currentUser && receiver.user_id) {
            console.log(textValue);
            dispatch(sendMessage({ userId: currentUser.user_id, chatId: id, content: textValue, receiverId: receiver.user_id }));
            setTextValue("");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleButtonClick();
        }
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message || "Неизвестная ошибка"}</div>;
    }

    return (
        <div className="container">
            <div className="messages">
                <div className="topMes">
                    <NavLink to={"/messenger"} className="mes__esc">
                        <img src={ecs} alt="esc" />
                    </NavLink>
                    <h2 className="mes_user">{receiver.surname} {receiver.name}</h2>
                </div>
                <div className="mesSpace">
                    {messages.map((message) => {
                        console.log("Message user_id:", message.user_id, "Current user_id:", currentUser.user_id);
                        return (
                            <Message
                                key={message.message_id}
                                message={message.content}
                                time={message.created_at}
                                isCurrentUser={message.user_id === currentUser.user_id}
                            />
                        );
                    })}
                </div>
                <div className="mesInput">
                    <textarea
                        className="mes__type"
                        value={textValue}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        id="mesText"
                        placeholder="Введите ваше сообщение"
                    />
                    <button onClick={handleButtonClick}>
                        <img className="mes__send" src={send} alt="send" />
                    </button>
                </div>
            </div>
        </div>
    );
}
