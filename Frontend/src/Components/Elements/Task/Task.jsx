import "./style.css"
import {NavLink} from "react-router-dom";

export default function Task(props) {
    return (
        <NavLink className="task__card" to={`/task-settings/${props.index}`}>
            <li className="task__item">
                <h1 className="task__title">{props.title}</h1>
                <h3 className="task_responsible">{props.surname} {props.name}</h3>
                <p className="task__deadline">Срок до {props.deadline}</p>
                <div className="statusbar task-status">
                    <p className="statusbar__info">В процессе</p>
                    <div className="statusbar-yellow status-col"></div>
                </div>
            </li>
        </NavLink>
    )
}
