import "./style.css";

export default function Message({ message, isCurrentUser, time }) {
    return (
        <div className={`message ${isCurrentUser ? "message-current-user" : "message-ny"}`}>
            <p className={`${isCurrentUser ? "" : "mes_reverse"}`}>{message}</p>
            <p className="mes_time">{time}</p>
        </div>
    );
}
