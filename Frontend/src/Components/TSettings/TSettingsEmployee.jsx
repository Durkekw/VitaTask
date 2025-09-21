import "./style.css"
import { NavLink, useNavigate, useParams } from "react-router-dom";
import send from "../../img/free-icon-send-button-60525.png";
import { useEffect, useState } from "react";
import Message from "../Elements/Message/Message.jsx";
import Report from "../Report/Report.jsx";
import { useSelector } from "react-redux";
import { format } from "date-fns";

export default function TSettingsEmployee() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const tasks = useSelector((state) => state.task.tasks);
    const taskData = tasks.find((task) => task.task_id === parseInt(taskId, 10));

    const [textValue, setTextValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [reportActive, setReportActive] = useState(false);
    const teamId = useSelector((state) => state.team.teamId);

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
                    <h1 className="page__title">Информация о задаче</h1>
                </div>

                <div className="task-info">
                    <div className="info-section">
                        <h3 className="section-title">Основная информация</h3>
                        
                        <div className="info-card">
                            <div className="info-item">
                                <span className="info-label">Название задачи</span>
                                <span className="info-value">{taskData.task_title}</span>
                            </div>
                            
                            <div className="info-item">
                                <span className="info-label">Ответственный</span>
                                <span className="info-value">{taskData.surname} {taskData.name}</span>
                            </div>
                            
                            <div className="info-row">
                                <div className="info-item">
                                    <span className="info-label">Дата создания</span>
                                    <span className="info-value">
                                        {format(new Date(taskData.created_at), 'dd.MM.yyyy')}
                                    </span>
                                </div>
                                
                                <div className="info-item">
                                    <span className="info-label">Срок выполнения</span>
                                    <span className="info-value">
                                        {format(new Date(taskData.deadline), 'dd.MM.yyyy')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3 className="section-title">Описание и статус</h3>
                        
                        <div className="info-card">
                            <div className="info-item">
                                <span className="info-label">Описание задачи</span>
                                <div className="info-description">
                                    {taskData.task_description || "Описание не указано"}
                                </div>
                            </div>
                            
                            <div className="info-item">
                                <span className="info-label">Статус</span>
                                <div className="status-display">
                                    <span className="status-text">{taskData.task_status || "В процессе"}</span>
                                    <div className="status-indicator"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="action-section">
                        <button 
                            onClick={() => setReportActive(true)} 
                            className="btn report-btn"
                        >
                            <span className="btn-icon">📊</span>
                            <span>Отправить отчет</span>
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