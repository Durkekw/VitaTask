import logo from '../../../img/logo/Group.svg'
import "./style.css"
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";

const getRoleName = (roleId) => {
    if (roleId === null || roleId === undefined) {
        return "Unknown Role";
    }
    switch (roleId) {
        case 1:
            return "Manager";
        case 2:
            return "Employee";
        default:
            return "Unknown Role";
    }
};

const getRoleColor = (roleId) => {
    switch (roleId) {
        case 1:
            return "#f59e0b"; // Orange for Manager
        case 2:
            return "#3b82f6"; // Blue for Employee
        default:
            return "#94a3b8"; // Gray for Unknown
    }
};

export default function Teammate(props) {
    const currentUser = useSelector((state) => state.user.user);
    
    return (
        <div className="teammate-card">
            <div className="user-info">
                {currentUser.user_id !== props.user_id ? (
                    <NavLink to={`/profile/${props.user_id}`} className="user-link">
                        <div className="user-avatar">
                            <img className="avatar-img" src={logo} alt="User"/>
                        </div>
                        <div className="user-details">
                            <h3 className="user-name">{props.surname} {props.name}</h3>
                            <p className="user-email">{props.email}</p>
                            <div className="user-role" style={{color: getRoleColor(props.role)}}>
                                {getRoleName(props.role)}
                            </div>
                        </div>
                    </NavLink>
                ) : (
                    <div className="user-link current-user">
                        <div className="user-avatar current-user-avatar">
                            <img className="avatar-img" src={logo} alt="User"/>
                        </div>
                        <div className="user-details">
                            <h3 className="user-name">{props.surname} {props.name}</h3>
                            <p className="user-email">{props.email}</p>
                            <div className="user-role current-user-role" style={{color: getRoleColor(props.role)}}>
                                {getRoleName(props.role)} (Вы)
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {props.currentUserId !== props.user_id && (
                <button
                    onClick={() => props.onDelete(props)}
                    className={`delete-btn ${props.showBtn ? "delete-btn-visible" : "delete-btn-hidden"}`}
                >
                    <span className="delete-icon">🗑️</span>
                    <span className="delete-text">Удалить</span>
                </button>
            )}
        </div>
    );
}