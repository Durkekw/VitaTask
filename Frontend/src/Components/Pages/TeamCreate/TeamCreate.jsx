import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../../../../redux/slices/teamSlice.js";
import "./style.css";

export default function TeamCreate() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const { teamId, loading, error } = useSelector((state) => state.team);
    const [teamName, setTeamName] = useState("");
    const [formError, setFormError] = useState("");

    // Проверяем, есть ли у пользователя уже команда
    useEffect(() => {
        if (user && user.team_id) {
            // Если у пользователя уже есть команда, перенаправляем на страницу команды
            navigate(`/team/${user.team_id}`);
        }
    }, [user, navigate]);

    const handleCreateTeam = (evt) => {
        evt.preventDefault();
        setFormError("");

        if (!user || !user.user_id) {
            setFormError("Ошибка: пользователь не авторизован.");
            return;
        }

        if (!teamName.trim()) {
            setFormError("Пожалуйста, введите название команды.");
            return;
        }

        dispatch(createTeam({ teamName: teamName.trim(), userId: user.user_id }))
            .unwrap()
            .then((response) => {
                navigate(`/team/${response.teamId}`);
            })
            .catch((error) => {
                console.error("Ошибка при создании команды:", error);
                setFormError(error.message || "Ошибка при создании команды");
            });
    };

    // Если у пользователя уже есть команда, показываем сообщение
    if (user && user.team_id) {
        return (
            <div className="container">
                <div className="team-create-container">
                    <div className="already-has-team">
                        <div className="team-icon">👥</div>
                        <h2>У вас уже есть команда</h2>
                        <p>Вы уже состоите в команде. Перейдите на страницу вашей команды для управления участниками.</p>
                        <button 
                            className="btn go-to-team-btn" 
                            onClick={() => navigate(`/team/${user.team_id}`)}
                        >
                            Перейти к команде
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="team-create-container">
                <div className="team-create-header">
                    <h1 className="page__title">Создать команду</h1>
                    <p className="team-create-subtitle">
                        Создайте новую команду для совместной работы над проектами
                    </p>
                </div>

                <div className="team-create-form-container">
                    <form onSubmit={handleCreateTeam} className="team-create-form">
                        <div className="form-group">
                            <label htmlFor="teamName" className="form-label">
                                Название команды
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                id="teamName"
                                placeholder="Введите название вашей команды"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                                maxLength="50"
                            />
                            <p className="form-hint">
                                Максимум 50 символов
                            </p>
                        </div>

                        {formError && (
                            <div className="error-message">
                                <p className="error">{formError}</p>
                            </div>
                        )}

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn create-team-btn"
                                disabled={loading}
                            >
                                {loading ? "Создание..." : "Создать команду"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="team-create-info">
                    <h3>Что дает создание команды?</h3>
                    <ul className="benefits-list">
                        <li>📋 Управление задачами для всей команды</li>
                        <li>💬 Встроенный мессенджер для общения</li>
                        <li>👥 Добавление и удаление участников</li>
                        <li>📊 Отслеживание прогресса проектов</li>
                        <li>🔔 Уведомления о важных событиях</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}