import logo from '../../../img/logo/Group.svg'
import "./style.css"
import remove_btn from '../../../img/png-klev-club-bewz-p-krestik-chernii-png-28.png'
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

export default function Teammate(props) {
    const currentUser = useSelector((state) => state.user.user);
    return (
        <div className="chat-container">
            <div className="teammate">
                {currentUser.user_id !== props.user_id ? <NavLink to={`/profile/${props.user_id}`}>
                    <div className="team-links">
                        <img className="chat-img" src={logo} alt="User"/>
                        <p className="chat__name">{props.surname} {props.name}</p>
                    </div>
                </NavLink> :
                <div className="team-links">
                    <img className="chat-img" src={logo} alt="User"/>
                    <p className="chat__name">{props.surname} {props.name}</p>
                </div>}
                <p>Email: {props.email}</p>
                <p>Role: {getRoleName(props.role)}</p> {/* Преобразуем role_id в название роли */}
                {props.currentUserId !== props.user_id ? (<button
                    onClick={() => props.onDelete(props)} // Передаем весь объект props (включая user_id)
                    className={props.showBtn ? "btn_delete_member" : "btn_delete_member btn_delete_member-invisible"}
                >
                    <img src={remove_btn}/>
                </button>) : (
                        <div className="btn_delete_member"></div>
                    )}
            </div>
        </div>
    );
}
