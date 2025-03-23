import "./style.css";
import { NavLink } from "react-router-dom";
import logo from "../../../img/logo/Group.svg";

export default function Chat({ chatId, receiverId, receiverName, receiverSurname }) {
    return (
        <div className="chat-container">
            <div className="chatter">
                <NavLink to={`/profile/${receiverId}`}>
                    <img className="chat-img" src={logo} alt="profile" />
                </NavLink>
                <NavLink to={`/im/${chatId}`}>
                    <p className="chat__name">
                        {receiverSurname || "Фамилия не указана"} {receiverName || "Имя не указано"}
                    </p>
                </NavLink>
            </div>
        </div>
    );
}
