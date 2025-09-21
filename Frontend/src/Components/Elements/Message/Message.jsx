import "./style.css";

export default function Message({ message, isCurrentUser, time }) {
    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        
        try {
            // Если timestamp уже в правильном формате
            if (typeof timestamp === 'string' && timestamp.includes('T')) {
                const date = new Date(timestamp);
                return date.toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
            
            // Если это просто строка времени
            if (typeof timestamp === 'string' && timestamp.includes(':')) {
                return timestamp;
            }
            
            // Если это число (Unix timestamp)
            if (typeof timestamp === 'number') {
                const date = new Date(timestamp * 1000);
                return date.toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
            
            return "";
        } catch (error) {
            console.error("Error formatting time:", error, timestamp);
            return "";
        }
    };

    return (
        <div className={`message ${isCurrentUser ? "message-current-user" : "message-other-user"}`}>
            <div className="message-content">
                <p className="message-text">{message}</p>
                <p className="message-time">{formatTime(time)}</p>
            </div>
        </div>
    );
}