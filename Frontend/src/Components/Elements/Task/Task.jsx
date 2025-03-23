import "./style.css";
import { NavLink } from "react-router-dom";
import { format } from 'date-fns';

export default function Task(props) {
    const formattedDate = props.deadline ? format(new Date(props.deadline), 'dd.MM.yyyy') : "Нет срока";
    return (
        <NavLink
            className="task__card"
            to={{
                pathname: `/task-settings/${props.role}/${props.taskID}`,
                state: {
                    taskID: props.taskID, // ID задачи
                    title: props.title,
                    surname: props.surname,
                    name: props.name,
                    deadline: props.deadline,
                    description: props.description, // Описание задачи
                    status: props.status, // Статус задачи
                },
            }}
        >
            <li className="task__item">
                <h1 className="task__title">{props.title}</h1>
                <h3 className="task_responsible">{props.surname} {props.name}</h3>
                <p className="task__deadline">Срок до {formattedDate}</p>
                <div className="statusbar task-status">
                    <p className="statusbar__info">{props.status || "В процессе"}</p>
                    <div className="statusbar-yellow status-col"></div>
                </div>
            </li>
        </NavLink>
    );
}
