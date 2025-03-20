import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Добавляем useNavigate для перенаправления
import { createTeam } from "../../../../redux/slices/teamSlice.js";

export default function TeamCreate() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Хук для навигации
    const { user } = useSelector((state) => state.user); // Получаем данные пользователя из authSlice
    const [teamName, setTeamName] = useState("");
    const { teamId } = useSelector((state) => state.team); // Получаем teamId из состояния

    const handleCreateTeam = (evt) => {
        evt.preventDefault();

        if (!user || !user.user_id) {
            alert("Ошибка: пользователь не авторизован.");
            return;
        }

        dispatch(createTeam({ teamName, userId: user.user_id }))
            .unwrap()
            .then((response) => {
                alert("Команда успешно создана!");
                navigate(`/team/${response.teamId}`);
            })
            .catch((error) => {
                console.error("Ошибка при создании команды:", error);
                alert("Ошибка при создании команды: " + error.message);
            });
    };

    return (
        <div className="container">
            <div className="tSettings">
                <h1 className="page__title">Create Team</h1>
                <form onSubmit={handleCreateTeam}>
                    <h1 className="respTitle">Название вашей команды:</h1>
                    <input
                        className="form-control"
                        type="text"
                        id="taskTitle"
                        placeholder="Введите название вашей команды"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn tBtn">
                        Создать
                    </button>
                </form>
            </div>
        </div>
    );
}
