import "./style.css";
import { NavLink } from "react-router-dom";
import logo from "../../../img/logo/Group.svg";

export default function Chat({ chatId, receiverId, receiverName, receiverSurname, lastMessage, lastMessageTime }) {
    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        
        try {
            if (typeof timestamp === 'string' && timestamp.includes('T')) {
                const date = new Date(timestamp);
                return date.toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
            
            if (typeof timestamp === 'string' && timestamp.includes(':')) {
                return timestamp;
            }
            
            if (typeof timestamp === 'number') {
                const date = new Date(timestamp * 1000);
                return date.toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
            
            return "";
        } catch (error) {
            return "";
        }
    };

    return (
        <NavLink to={`/im/${chatId}`} className="chat-link">
            <div className="chat-container">
                <div className="chat-avatar">
                    <img className="chat-img" src={logo} alt="profile" />
                </div>
                
                <div className="chat-content">
                    <div className="chat-header">
                        <h3 className="chat-name">
                            {receiverSurname || "Фамилия не указана"} {receiverName || "Имя не указано"}
                        </h3>
                        {lastMessageTime && (
                            <span className="chat-time">{formatTime(lastMessageTime)}</span>
                        )}
                    </div>
                    
                    {lastMessage && (
                        <p className="chat-last-message">{lastMessage}</p>
                    )}
                </div>
            </div>
        </NavLink>
    );
}