import "./style.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { deleteTask, updateTask } from "../../../redux/slices/taskSlice.js";
import Message from "../Elements/Message/Message.jsx";
import Report from "../Report/Report.jsx";
import send from "../../img/free-icon-send-button-60525.png";

export default function TSettingsManager() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.task.tasks);
    const { members } = useSelector((state) => state.team);
    const teamId = useSelector((state) => state.team.teamId);
    const { loading, error } = useSelector((state) => state.task);

    const taskData = tasks.find((task) => task.task_id === parseInt(taskId, 10));

    const [taskTitle, setTaskTitle] = useState(taskData?.task_title || "");
    const [taskDescription, setTaskDescription] = useState(taskData?.task_description || "");
    const [taskStatus, setTaskStatus] = useState(taskData?.task_status || "");
    const [deadline, setDeadline] = useState(
        taskData?.deadline ? new Date(taskData.deadline).toISOString().split('T')[0] : ""
    );
    const [responsible, setResponsible] = useState(taskData?.user_id || "");

    const [textValue, setTextValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [reportActive, setReportActive] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateTask({
                taskId: taskData.task_id,
                taskTitle,
                taskDescription,
                taskStatus,
                deadline,
                userID: parseInt(responsible, 10),
            })).unwrap();
            navigate(`/tasks/${teamId}`);
        } catch (error) {
            console.error("Ошибка при обновлении задачи:", error);
            alert("Ошибка при обновлении задачи");
        }
    };

    useEffect(() => {
        if (!taskData) {
            navigate(`/tasks/${teamId}`);
        }
    }, [taskData, navigate, teamId]);

    if (!taskData) {
        return (
            <div className="container">
                <div className="task-settings-container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Загрузка задачи...</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleDelete = async () => {
        if (window.confirm("Вы уверены, что хотите удалить эту задачу?")) {
            try {
                await dispatch(deleteTask(taskData.task_id)).unwrap();
                alert("Задача успешно удалена");
                navigate(`/tasks/${teamId}`);
            } catch (error) {
                console.error("Ошибка при удалении задачи:", error);
                alert("Ошибка при удалении задачи");
            }
        }
    };

    const handleTextChange = (event) => {
        setTextValue(event.target.value);
    };

    const handleButtonClick = () => {
        if (textValue.trim()) {
            setMessages([...messages, textValue]);
            setTextValue('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleButtonClick();
        }
    };

    return (
        <div className="container">
            <div className="task-settings-container">
                <div className="task-header">
                    <NavLink to={`/tasks/${teamId}`} className="back-button">
                        <div className="back-icon"></div>
                    </NavLink>
                    <h1 className="page__title">Настройки задачи</h1>
                </div>

                <div className="task-form">
                    <div className="form-section">
                        <h3 className="section-title">Основная информация</h3>
                        
                        <div className="form-group">
                            <label className="form-label">Название задачи</label>
                            <input
                                className="form-control"
                                type="text"
                                id="taskTitle"
                                placeholder="Введите название задачи"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Ответственный</label>
                            <select
                                className="form-control"
                                name="members"
                                value={responsible}
                                onChange={(e) => setResponsible(e.target.value)}
                            >
                                {members.map((member) => (
                                    <option key={member.user_id} value={member.user_id}>
                                        {member.surname} {member.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Дата создания</label>
                                <div className="info-value">
                                    {format(new Date(taskData.created_at), 'dd.MM.yyyy')}
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Срок выполнения</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    id="deadline"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Описание и статус</h3>
                        
                        <div className="form-group">
                            <label className="form-label">Описание задачи</label>
                            <textarea
                                className="form-control textarea"
                                id="taskDescription"
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                placeholder="Введите подробности задачи"
                                rows="4"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Статус</label>
                            <div className="status-display">
                                <span className="status-text">{taskStatus || "В процессе"}</span>
                                <div className="status-indicator"></div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn save-btn"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Сохранение..." : "Сохранить изменения"}
                        </button>
                        <button
                            type="button"
                            className="btn delete-btn"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? "Удаление..." : "Удалить задачу"}
                        </button>
                    </div>
                </div>

                <div className="discussion-section">
                    <h3 className="section-title">Обсуждение</h3>
                    <div className="discussion-container">
                        <div className="messages-area">
                            {messages.map((message, index) => (
                                <Message key={index} message={message} isCurrentUser={true} />
                            ))}
                        </div>
                        <div className="message-input">
                            <div className="input-container">
                                <textarea
                                    className="message-textarea"
                                    value={textValue}
                                    onChange={handleTextChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Введите ваше сообщение..."
                                    rows="1"
                                />
                                <button 
                                    className="send-button" 
                                    onClick={handleButtonClick}
                                    disabled={!textValue.trim()}
                                >
                                    <img className="send-icon" src={send} alt="Отправить" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Report setActive={setReportActive} active={reportActive} />
        </div>
    );
}