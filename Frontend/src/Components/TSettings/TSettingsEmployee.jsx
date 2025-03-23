import "./style.css"
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {chats} from "../../helpers/chatList.jsx";
import send from "../../img/free-icon-send-button-60525.png";
import {useEffect, useState} from "react";
import Message from "../Elements/Message/Message.jsx";
import Report from "../Report/Report.jsx";
import { useSelector } from "react-redux";
import {format} from "date-fns"; // Импортируем useSelector

export default function TSettingsEmployee() {
    const { taskId } = useParams(); // Получаем taskId из URL
    const navigate = useNavigate();
    const tasks = useSelector((state) => state.task.tasks);
    const taskData = tasks.find((task) => task.task_id === parseInt(taskId, 10));

    const [textValue, setTextValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [reportActive, setReportActive] = useState(false);
    const teamId = useSelector((state) => state.team.teamId);
    const { members } = useSelector((state) => state.team);

    // Если задача не найдена, перенаправляем на страницу задач
    useEffect(() => {
        if (!taskData) {
            navigate(`/tasks/${teamId}`);
        }
    }, [taskData, navigate, teamId]);

    // Если taskData отсутствует, возвращаем null (чтобы избежать рендеринга до завершения навигации)
    if (!taskData) {
        return null;
    }

    return (
        <div className="container">
            <div className="tSettings">
                <div className="TSettings_btn-title">
                    <NavLink to={`/tasks/${teamId}`} className="btn back__btn task_btn"></NavLink>
                    <h1 className="page__title tSettings__title">Task Info</h1>
                </div>

                <h1 className="fTitle">Название задачи: <br/> {taskData.task_title}</h1> {/* Используем taskData */}
                <h1 className="respTitle">Ответственный:</h1>
                <h2 className="respDesc">
                    {taskData.surname} {taskData.name} {/* Используем taskData */}
                </h2>
                <h2 className="create_date_title">Дата создания:</h2>
                <h3 className="create_date_content"> {format(new Date(taskData.created_at), 'dd.MM.yyyy')}</h3>
                <h2 className="deadline_title">Сроки:</h2>
                <h3>{format(new Date(taskData.deadline), 'dd.MM.yyyy')}</h3>
                <h1 className="descTitle">Описание задачи:</h1>
                <div className="descSpace">
                    {taskData.task_description}
                </div>
                <h1 className="descTitle">Статус</h1>
                <div className="statusbar tStatus">
                    <p className="statusbar__info">{taskData.task_status || "В процессе"}</p> {/* Используем taskData */}
                    <div className="statusbar-yellow tset-statusbar-col"></div>
                </div>
                <button onClick={() => setReportActive(true)} className="btn task-rep-btn">Отправить отчет</button>
                <h1 className="disc-title">Обсуждение</h1>
                <div className="discussion">
                    <div className="disSpace">
                        {messages.map((message, index) => (
                            <Message key={index} message={message}/>
                        ))}
                    </div>
                    <div className="add-disc">
                        <div method="post" className="disInput">
                            <textarea
                                className="dis__type"
                                value={textValue}
                                onChange={(e) => setTextValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        setMessages([...messages, textValue]);
                                        setTextValue('');
                                    }
                                }}
                                id="disText"
                                placeholder="Введите ваше сообщение"
                            />
                            <button onClick={() => {
                                if (textValue.trim()) {
                                    setMessages([...messages, textValue]);
                                    setTextValue('');
                                }
                            }}>
                                <img className="dis__send" src={send} alt=""/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Report setActive={setReportActive} active={reportActive}/>
        </div>
    );
}
