import "./style.css";
import { NavLink } from "react-router-dom";
import { format } from 'date-fns';

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'выполнено':
        case 'completed':
        case 'done':
            return '#22c55e'; // Green
        case 'в процессе':
        case 'in progress':
        case 'progress':
            return '#f59e0b'; // Orange
        case 'ожидает':
        case 'pending':
        case 'waiting':
            return '#3b82f6'; // Blue
        case 'отменено':
        case 'cancelled':
        case 'canceled':
            return '#ef4444'; // Red
        default:
            return '#94a3b8'; // Gray
    }
};

const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
        case 'выполнено':
        case 'completed':
        case 'done':
            return '✅';
        case 'в процессе':
        case 'in progress':
        case 'progress':
            return '🔄';
        case 'ожидает':
        case 'pending':
        case 'waiting':
            return '⏳';
        case 'отменено':
        case 'cancelled':
        case 'canceled':
            return '❌';
        default:
            return '📋';
    }
};

export default function Task(props) {
    const formattedDate = props.deadline ? format(new Date(props.deadline), 'dd.MM.yyyy') : "Нет срока";
    const statusColor = getStatusColor(props.status);
    const statusIcon = getStatusIcon(props.status);
    
    return (
        <NavLink
            className="task-card"
            to={{
                pathname: `/task-settings/${props.role}/${props.taskID}`,
                state: {
                    taskID: props.taskID,
                    title: props.title,
                    surname: props.surname,
                    name: props.name,
                    deadline: props.deadline,
                    description: props.description,
                    status: props.status,
                },
            }}
        >
            <div className="task-content">
                <div className="task-header">
                    <h3 className="task-title">{props.title}</h3>
                    <div className="task-status" style={{color: statusColor}}>
                        <span className="status-icon">{statusIcon}</span>
                        <span className="status-text">{props.status || "В процессе"}</span>
                    </div>
                </div>
                
                <div className="task-body">
                    <div className="task-assignee">
                        <span className="assignee-label">Ответственный:</span>
                        <span className="assignee-name">{props.surname} {props.name}</span>
                    </div>
                    
                    <div className="task-deadline">
                        <span className="deadline-label">Срок:</span>
                        <span className="deadline-date">{formattedDate}</span>
                    </div>
                </div>
                
                <div className="task-footer">
                    <div className="task-priority">
                        <div className="priority-bar" style={{backgroundColor: statusColor}}></div>
                    </div>
                </div>
            </div>
        </NavLink>
    );
}