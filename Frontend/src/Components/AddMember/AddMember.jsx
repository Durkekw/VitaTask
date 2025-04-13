import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserToTeam, fetchUnteamedUsers } from "../../../redux/slices/teamSlice.js";
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
    }, [active, dispatch, isDataLoaded]); // Зависимости: active, dispatch, isDataLoaded

    const handleAddUser = async (user) => {
        try {
            const teamId = JSON.parse(localStorage.getItem("teamId"));

            if (!teamId) {
                alert("Команда не выбрана");
                return;
            }

            await dispatch(addUserToTeam({ userId: user.user_id, teamId })).unwrap();
            dispatch(fetchUnteamedUsers()); // Обновляем список

        } catch (error) {
            console.error("Ошибка при добавлении пользователя в команду:", error);
            alert("Не удалось добавить пользователя в команду.");
        }
    };

    return (
        <div className={active ? "add-form active" : "add-form"} onClick={() => setActive(false)}>
            <section className="form__window add__window" onClick={(e) => e.stopPropagation()}>
                {loading && <p>Загрузка...</p>}
                {!loading && unteamedUsers && unteamedUsers.length > 0 ? (
                    unteamedUsers.map((user) => (
                        <Unteamed
                            key={user.user_id}
                            userId={user.user_id}
                            name={user.name}
                            surname={user.surname}
                            onAdd={() => handleAddUser(user)} // Передаем функцию добавления
                        />
                    ))
                ) : (
                    <p>Нет пользователей, которые не состоят в команде.</p>
                )}
            </section>
        </div>
    );
});

export default AddMember;
