import "./style.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createTaskAndFetch } from "../../../redux/slices/taskSlice.js";
import { useEffect, useState } from "react";
import { fetchTeamMembers } from "../../../redux/slices/teamSlice.js";
import { format } from "date-fns";

export default function CreateT() {
    const { members } = useSelector((state) => state.team);
    const teamId = useSelector((state) => state.team.teamId);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [taskTitle, setTaskTitle] = useState("");
    const [responsible, setResponsible] = useState("");
    const [deadline, setDeadline] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (teamId) {
            dispatch(fetchTeamMembers(teamId));
        }
    }, [teamId, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Валидация
        if (!taskTitle || !responsible || !deadline || !teamId) {
            alert("Пожалуйста, заполните все обязательные поля.");
            setLoading(false);
            return;
        }

        const formattedDeadline = format(new Date(deadline), "dd.MM.yyyy");
        const taskData = {
            taskTitle: taskTitle,
            taskDesc: taskDesc,
            taskStatus: "В процессе",
            deadline: formattedDeadline,
            teamID: parseInt(teamId, 10),
            userID: parseInt(responsible, 10),
        };

        // Проверка, что user_id и teamID не пустые
        if (isNaN(taskData.teamID) || isNaN(taskData.userID)) {
            alert("Некорректные данные для teamID или userID.");
            setLoading(false);
            return;
        }

        try {
            await dispatch(createTaskAndFetch(taskData)).unwrap();

            // Очистка формы
            setTaskTitle("");
            setResponsible("");
            setDeadline("");
            setTaskDesc("");
            
            // Перенаправление на страницу задач
            navigate(`/tasks/${teamId}`);
        } catch (error) {
            console.error("Ошибка сервера:", error.response?.data);
            alert("Ошибка при создании задачи: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="task-create-container">
                <div className="task-header">
                    <NavLink to={`/tasks/${teamId}`} className="back-button">
                        <div className="back-icon"></div>
                    </NavLink>
                    <h1 className="page__title">Создание задачи</h1>
                </div>

                <div className="task-form-container">
                    <form onSubmit={handleSubmit} className="task-form">
                        <div className="form-section">
                            <h3 className="section-title">Основная информация</h3>
                            
                            <div className="form-group">
                                <label className="form-label">
                                    Название задачи <span className="required">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="taskTitle"
                                    placeholder="Введите название задачи"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Ответственный <span className="required">*</span>
                                </label>
                                <select
                                    className="form-control"
                                    name="members"
                                    value={responsible}
                                    onChange={(e) => setResponsible(e.target.value)}
                                    required
                                >
                                    <option value="">Выберите ответственного</option>
                                    {members.map((member) => (
                                        <option key={member.user_id} value={member.user_id}>
                                            {member.surname} {member.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Срок выполнения <span className="required">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    type="date"
                                    id="deadline"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">Дополнительная информация</h3>
                            
                            <div className="form-group">
                                <label className="form-label">Описание задачи</label>
                                <textarea
                                    className="form-control textarea"
                                    id="taskDescription"
                                    placeholder="Введите подробности задачи (необязательно)"
                                    value={taskDesc}
                                    onChange={(e) => setTaskDesc(e.target.value)}
                                    rows="4"
                                />
                                <p className="form-hint">Опишите детали задачи, требования и дополнительные инструкции</p>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn create-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="btn-spinner"></div>
                                        Создание...
                                    </>
                                ) : (
                                    <>
                                        <span className="btn-icon">✓</span>
                                        Создать задачу
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}