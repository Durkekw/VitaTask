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
    const { taskId } = useParams(); // Получаем taskId из URL
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.task.tasks);
    const { members } = useSelector((state) => state.team);
    const teamId = useSelector((state) => state.team.teamId);
    const { loading, error } = useSelector((state) => state.task);

    // Находим задачу по taskId
    const taskData = tasks.find((task) => task.task_id === parseInt(taskId, 10));

    // Состояния для полей задачи
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

    // Обработчик сохранения изменений задачи
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateTask({
                taskId: taskData.task_id,
                taskTitle,
                taskDescription,
                taskStatus,
                deadline,
                userID: parseInt(responsible, 10), // Преобразуем строку в число
            })).unwrap();
            alert("Задача успешно обновлена");
            navigate(`/tasks/${teamId}`);
        } catch (error) {
            console.error("Ошибка при обновлении задачи:", error);
            alert("Ошибка при обновлении задачи");
        }
    };

    // Перенаправляем, если задача не найдена
    useEffect(() => {
        if (!taskData) {
            navigate(`/tasks/${teamId}`);
        }
    }, [taskData, navigate, teamId]);

    // Если задача не найдена, возвращаем null
    if (!taskData) {
        return <div>Загрузка...</div>; // Или перенаправление
    }

    const handleDelete = async () => {
        try {
            await dispatch(deleteTask(taskData.task_id)).unwrap();
            alert("Задача успешно удалена");
            navigate(`/tasks/${teamId}`);
        } catch (error) {
            console.error("Ошибка при удалении задачи:", error);
            alert("Ошибка при удалении задачи");
        }
    };

    const handleTextChange = (event) => {
        setTextValue(event.target.value);
    };

    const handlePopupClick = () => {
        setReportActive(true);
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
            <div className="tSettings">
                <div className="TSettings_btn-title">
                    <NavLink to={`/tasks/${teamId}`} className="btn back__btn task_btn"></NavLink>
                    <h1 className="page__title tSettings__title">Task Settings</h1>
                </div>

                <h1 className="fTitle">Название задачи: <br />
                    <input
                        className="form-control"
                        type="text"
                        id="taskTitle"
                        placeholder="Введите название задачи"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                    />
                </h1>
                <h1 className="respTitle">Ответственный:</h1>
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
                <h2 className="create_date_title">Дата создания:</h2>
                <h3 className="create_date_content"> {format(new Date(taskData.created_at), 'dd.MM.yyyy')}</h3>
                <h2 className="deadline_title">Сроки:</h2>
                <input
                    className="form-control"
                    type="date"
                    id="taskTitle"
                    placeholder="Введите срок выполнения"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />
                <h1 className="descTitle">Описание задачи:</h1>
                <textarea
                    className="createDesc"
                    id="mesText"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Введите подробности этой задачи"
                />
                <h1 className="descTitle">Статус</h1>
                <div className="statusbar tStatus">
                    <p className="statusbar__info">В процессе</p>
                    <div className="statusbar-yellow tset-statusbar-col"></div>
                </div>
                <div className="sett_btns">
                    <button
                        type="submit"
                        className="btn task-rep-btn"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Загрузка..." : "Сохранить изменения"}
                    </button>
                    <button
                        type="submit"
                        className="btn task-rep-btn"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Загрузка..." : "Удалить"}
                    </button>
                </div>

                <h1 className="disc-title">Обсуждение</h1>
                <div className="discussion">
                    <div className="disSpace">
                        {messages.map((message, index) => (
                            <Message key={index} message={message} />
                        ))}
                    </div>
                    <div className="add-disc">
                        <div method="post" className="disInput">
                            <textarea
                                className="dis__type"
                                value={textValue}
                                onChange={handleTextChange}
                                onKeyDown={handleKeyDown}
                                id="disText"
                                placeholder="Введите ваше сообщение"
                            />
                            <button onClick={handleButtonClick}><img className="dis__send" src={send} alt="" /></button>
                        </div>
                    </div>
                </div>
            </div>
            <Report setActive={setReportActive} active={reportActive} />
        </div>
    );
}
