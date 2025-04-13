import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Task from "../../Elements/Task/Task.jsx";
import { NavLink } from "react-router-dom";
import "./style.css";
import { fetchTeamMembers } from "../../../../redux/slices/teamSlice.js";
import { fetchTasks } from "../../../../redux/slices/taskSlice.js";

export default function Tasks() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const tasks = useSelector((state) => state.task.tasks);
    const loading = useSelector((state) => state.task.loading);
    const error = useSelector((state) => state.task.error);

    useEffect(() => {
        if (user && user.team_id) {
            dispatch(fetchTeamMembers(user.team_id));
            dispatch(fetchTasks(user.team_id)); // Загружаем задачи для команды
        }
    }, [user, dispatch]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="container">
            <div className="tasks">
                <ul className="task__list">
                    {tasks && tasks.length > 0 ? (
                        tasks.map((task) => (
                            <Task
                                key={task.task_id}
                                taskID={task.task_id}
                                title={task.task_title}
                                surname={task.surname}
                                name={task.name}
                                deadline={task.deadline}
                                description={task.task_description} // Передаем описание задачи
                                status={task.task_status} // Передаем статус задачи
                                role={user.role_id === 1 ? "manager" : "employee"}
                            />
                        ))
                    ) : (
                        <div>Нет задач для отображения</div>
                    )}
                </ul>
                {user.role_id === 1 && <NavLink to="/task-change">
                    <button className="fixed-btn btn btn-primary">Добавить задачу</button>
                </NavLink>}
            </div>
        </div>
    );
}
