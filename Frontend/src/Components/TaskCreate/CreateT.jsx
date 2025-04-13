import "./style.css";
import {NavLink, useNavigate} from "react-router-dom";
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
    const navigate = useNavigate();

    useEffect(() => {
        if (teamId) {
            dispatch(fetchTeamMembers(teamId));
        }
    }, [teamId, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация
        if (!taskTitle || !responsible || !deadline || !taskDesc || !teamId) {
            alert("Пожалуйста, заполните все поля.");
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
            return;
        }

        console.log("Отправляемая дата:", formattedDeadline);
        console.log("Отправляемые данные:", taskData);
        console.log("Значения состояний:", { taskTitle, taskDesc, teamId, responsible, deadline });

        try {
            await dispatch(createTaskAndFetch(taskData)).unwrap();

            // Очистка формы
            setTaskTitle("");
            setResponsible("");
            setDeadline("");
            setTaskDesc("");
        } catch (error) {
            console.error("Ошибка сервера:", error.response?.data);
            alert("Ошибка при создании задачи: " + (error.response?.data?.message || error.message));
        }
        navigate(`/tasks/${teamId}`)
    };

    return (
        <div className="container">
            <div className="tSettings">
                <div className="TSettings_btn-title">
                    <NavLink to={`/tasks/${teamId}`} className="btn back__btn task_btn"></NavLink>
                    <h1 className="page__title tSettings__title">Task Create</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <h1 className="respTitle">Задача:</h1>
                    <input
                        className="form-control"
                        type="text"
                        id="taskTitle"
                        placeholder="Введите название вашей задачи"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        required
                    />
                    <h1 className="respTitle">Ответственный:</h1>
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
                    <h1 className="respTitle">Срок выполнения:</h1>
                    <input
                        className="form-control"
                        type="date"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />
                    <h1 className="descTitle">Описание задачи:</h1>
                    <textarea
                        className="createDesc"
                        id="mesText"
                        placeholder="Введите подробности этой задачи"
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn tBtn">
                        Сохранить
                    </button>

                </form>
            </div>
        </div>
    );
}
