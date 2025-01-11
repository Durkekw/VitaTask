import "./style.css"
import {NavLink} from "react-router-dom";

export default function Chat(props) {
    return (
        <NavLink to={`/im/${props.index}`} className="chat-container">
            <div className="chatter">
                <img className="chat-img" src={props.img}/>
                <p className="chat__name">{props.surname} {props.name}</p>
            </div>
        </NavLink>
    // <a href="#" className="chat-container">
    //     <div className="chatter">
    //         <img className="chat-img" src={props.img}/>
    //         <p className="chat__name">{props.surname} {props.name}</p>
    //         </div>
    //     </a>
    )
}
