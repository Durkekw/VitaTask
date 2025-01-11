import "./style.css"
import {NavLink} from "react-router-dom";

export default function Task(props) {
    return (
        <NavLink to={`/task-settings/${props.index}`}>
            <li className="task__item">
            <h1 className="task__title">{props.title}</h1>
            <h3 className="task_responsible">{props.surname} {props.name}</h3>
            <p className="task__desc">{props.desc}</p>
        </li>
        </NavLink>
    )
}
