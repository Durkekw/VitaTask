import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
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
                    console.log("User loaded:", user);
                })
                .catch((error) => {
                    console.error("Error loading user:", error);
                });
            dispatch(fetchChats(currentUser.user_id));
        }
    }, [dispatch, userId, currentUser.user_id]);

    if (loading) {
        return (
            <div className="container">
                <div className="profile-container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Загрузка профиля...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="profile-container">
                    <div className="error-container">
                        <h2>Ошибка загрузки</h2>
                        <p>{error.message || "Неизвестная ошибка"}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedUser) {
        return (
            <div className="container">
                <div className="profile-container">
                    <div className="error-container">
                        <h2>Пользователь не найден</h2>
                        <p>Профиль пользователя недоступен</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleSendMessage = async () => {
        if (isSending) {
            return;
        }

        setIsSending(true);

        try {
            const existingChat = chats.find(chat => chat.user_id === parseInt(userId));

            if (existingChat) {
                window.location.href = `/im/${existingChat.chat_id}`;
            } else {
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
                window.location.href = `/im/${data.chat_id}`;
            }
        } catch (error) {
            console.error("Ошибка при создании чата:", error);
        } finally {
            setIsSending(false);
        }
    };

    const isOwnProfile = currentUser?.user_id === parseInt(userId);

    return (
        <div className="container">
            <div className="profile-container">
                <div className="profile-header">
                    <h1 className="page__title">Профиль пользователя</h1>
                </div>

                <div className="profile-card">
                    <div className="profile-avatar">
                        <img className="profile-pic" src={logo} alt="profile" />
                    </div>
                    
                    <div className="profile-info">
                        <div className="profile-name-section">
                            <h2 className="profile-name">{selectedUser.name}</h2>
                            <h2 className="profile-surname">{selectedUser.surname}</h2>
                        </div>
                        
                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{selectedUser.email}</span>
                            </div>
                            
                            <div className="detail-item">
                                <span className="detail-label">Роль:</span>
                                <span className={`detail-value role-${selectedUser.role_id}`}>
                                    {selectedUser.role_id === 1 ? "Менеджер" : "Сотрудник"}
                                </span>
                            </div>
                            
                            {selectedUser.team && (
                                <div className="detail-item">
                                    <span className="detail-label">Команда:</span>
                                    <span className="detail-value">{selectedUser.team.team_name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {!isOwnProfile && (
                    <div className="profile-actions">
                        <button 
                            onClick={handleSendMessage} 
                            disabled={isSending} 
                            className="btn message-btn"
                        >
                            {isSending ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    <span>Создание чата...</span>
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">💬</span>
                                    <span>Отправить сообщение</span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {isOwnProfile && (
                    <div className="own-profile-notice">
                        <div className="notice-icon">👤</div>
                        <p>Это ваш профиль</p>
                    </div>
                )}
            </div>
        </div>
    );
}