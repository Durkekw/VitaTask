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
            dispatch(fetchTasks(user.team_id));
        }
    }, [user, dispatch]);

    if (loading) {
        return (
            <div className="container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Загрузка задач...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="error-container">
                    <h2>Ошибка загрузки</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="tasks-container">
                <div className="tasks-header">
                    <h1 className="page__title">Задачи команды</h1>
                    <p className="tasks-subtitle">
                        {user.role_id === 1 
                            ? "Управляйте задачами вашей команды" 
                            : "Ваши назначенные задачи"
                        }
                    </p>
                </div>

                <div className="tasks-content">
                    {tasks && tasks.length > 0 ? (
                        <div className="tasks-grid">
                            {tasks.map((task) => (
                                <Task
                                    key={task.task_id}
                                    taskID={task.task_id}
                                    title={task.task_title}
                                    surname={task.surname}
                                    name={task.name}
                                    deadline={task.deadline}
                                    description={task.task_description}
                                    status={task.task_status}
                                    role={user.role_id === 1 ? "manager" : "employee"}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-tasks">
                            <div className="empty-icon">📋</div>
                            <h3>Нет задач</h3>
                            <p>
                                {user.role_id === 1 
                                    ? "Создайте первую задачу для вашей команды" 
                                    : "Вам пока не назначены задачи"
                                }
                            </p>
                            {user.role_id === 1 && (
                                <NavLink to="/task-change" className="create-task-btn">
                                    Создать задачу
                                </NavLink>
                            )}
                        </div>
                    )}
                </div>

                {user.role_id === 1 && tasks && tasks.length > 0 && (
                    <div className="add-task-section">
                        <NavLink to="/task-change" className="btn add-task-btn">
                            <span className="btn-icon">+</span>
                            <span className="btn-text">Добавить задачу</span>
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    );
}