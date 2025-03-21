import logo from '../../../img/logo/Group.svg'
import "./style.css"
import remove_btn from '../../../img/png-klev-club-bewz-p-krestik-chernii-png-28.png'

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
    return (
        <div className="chat-container">
            <div className="teammate">
                <div className="team-links">
                    <img className="chat-img" src={logo} alt="User"/>
                    <p className="chat__name">{props.surname} {props.name}</p>
                </div>
                <p>Email: {props.email}</p>
                <p>Role: {getRoleName(props.role)}</p> {/* Преобразуем role_id в название роли */}
                {props.currentUserId !== props.user_id ?  (<button
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
