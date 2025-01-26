import "./style.css"
import {NavLink} from "react-router-dom";

export default function Chat(props) {
    return (
        <div className="chat-container">
            <div className="chatter">
                <NavLink to={`/profile/${props.index}`}>
                <img className="chat-img" src={props.img}/>
                </NavLink>
                <NavLink to={`/im/${props.index}`}>
                <p className="chat__name">{props.surname} {props.name}</p>
                </NavLink>
            </div>
        </div>
    )
}
