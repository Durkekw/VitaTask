import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserToTeam, fetchUnteamedUsers, fetchTeamMembers } from "../../../redux/slices/teamSlice.js";
import "./style.css";
import close from "../../img/png-klev-club-bewz-p-krestik-chernii-png-28.png";
import Unteamed from "../Elements/Unteamed/Unteamed.jsx";

const AddMember = React.memo(({ active, setActive }) => {
    const dispatch = useDispatch();
    const { unteamedUsers, loading, isDataLoaded } = useSelector((state) => state.team);

    useEffect(() => {
        if (active && !isDataLoaded) {
            dispatch(fetchUnteamedUsers());
        }
    }, [active, dispatch, isDataLoaded]);

    useEffect(() => {
        if (active) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [active]);

    const handleAddUser = async (user) => {
        try {
            const teamId = JSON.parse(localStorage.getItem("teamId"));

            if (!teamId) {
                alert("Команда не выбрана");
                return;
            }

            await dispatch(addUserToTeam({ userId: user.user_id, teamId })).unwrap();
            
            // Обновляем список незарегистрированных пользователей
            dispatch(fetchUnteamedUsers());
            
            // Обновляем список участников команды
            dispatch(fetchTeamMembers(teamId));
            
            // Закрываем модальное окно после успешного добавления
            setActive(false);

        } catch (error) {
            console.error("Ошибка при добавлении пользователя в команду:", error);
            alert("Не удалось добавить пользователя в команду.");
        }
    };

    return (
        <div className={active ? "form active" : "form"} onClick={() => setActive(false)}>
            <section className="form__window" onClick={(e) => e.stopPropagation()}>
                <button className="close" onClick={() => setActive(false)}>
                    <img className="close__img" src={close} alt="Close"/>
                </button>
                <h1>Добавить участника</h1>
                
                <div className="modal-content">
                    {loading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Загрузка пользователей...</p>
                        </div>
                    )}
                    
                    {!loading && unteamedUsers && unteamedUsers.length > 0 ? (
                        <div className="users-list">
                            {unteamedUsers.map((user) => (
                                <Unteamed
                                    key={user.user_id}
                                    userId={user.user_id}
                                    name={user.name}
                                    surname={user.surname}
                                    email={user.email}
                                    onAdd={() => handleAddUser(user)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Нет пользователей, которые не состоят в команде.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
});

export default AddMember;