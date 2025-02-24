import "./style.css"
import {NavLink} from "react-router-dom";

export default function Teammate(props) {
    return (
        <div className="chat-container">
            <div className="teammate">
                <div className="team-links">
                    <NavLink to={`/profile/${props.index}`}><img className="chat-img" src={props.img}/>        </NavLink>
                    <NavLink to={`/profile/${props.index}`}><p className="chat__name">{props.surname} {props.name}</p>
                    </NavLink>
                </div>
                {props.showBtn && <button className="btn delete-btn">Удалить</button>}
            </div>

        </div>
    )
}
