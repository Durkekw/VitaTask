import "./style.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import Teammate from "../../Elements/Teammate/Teammate.jsx";
import {
    addUserToTeam,
    deleteUserFromTeam,
    fetchTeamMembers,
    fetchUnteamedUsers, leaveTeam
} from "../../../../redux/slices/teamSlice";
import AddMember from "../../AddMember/AddMember.jsx";

export default function Team() {
    const [showBtn, setShowBtn] = useState(false);
    const [addingActive, setAddingActive] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { teamId, members, loading, error } = useSelector((state) => state.team);
    const { teamId: paramTeamId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = () => {
        setShowBtn(!showBtn);
        console.log(user.user_id)
        members.map((member, index) => (
            console.log(member.user_id)
        ))
    };


    const handleActive = () => {
        setAddingActive(true);
    };

    const handleLeaveFTeam = () => {
        dispatch(leaveTeam())
            .unwrap()
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error("Ошибка при выходе из команды:", error);
            });
    };

    const handleDeleteUser = async (user) => {
        try {

            const teamId = JSON.parse(localStorage.getItem("teamId"));

            if (!teamId) {
                alert("Команда не выбрана");
                return;
            }

            console.log("Deleting user with ID:", user.user_id);
            console.log("Deleting from team with ID:", teamId);

            if (!user.user_id || !teamId) {
                console.error("userId or teamId is missing");
                return;
            }

            await dispatch(deleteUserFromTeam({ userId: user.user_id, teamId })).unwrap(); // Обновляем список

            // alert(`Пользователь ${user.name} удален из команды`);
        } catch (error) {
            console.error("Ошибка при удалении пользователя из команды:", error);
            alert("Не удалось удалить пользователя из команды.");
        }
    };

    useEffect(() => {
        console.log("User:", user);
        console.log("Team ID:", teamId);
        console.log("Members:", members);

        if (user && user.team_id) {
            dispatch(fetchTeamMembers(user.team_id))
                .unwrap()
                .then(() => {
                    console.log("Участники команды успешно загружены");
                })
                .catch((error) => {
                    console.error("Ошибка при загрузке участников команды:", error);
                });
        } else {
            console.error("teamId is missing or user is not authenticated");
        }
    }, [user, dispatch]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (!members) {
        return <div>Загрузка участников...</div>;
    }

    if (members.length === 0) {
        return <div>Нет участников в команде</div>;
    }

    return (
        <div className="container">
            <div className="team-leaving">
                {<h1 className={user.team ? "team-title active_Ttitle" : "team-title"}>Название команды: "{user.team?.team_name}"</h1>}
                <button onClick={handleLeaveFTeam} className="btn team-btn">Выйти из команды</button>
            </div>
            {user.role_id === 1 && <div className="team_btns">
                <button onClick={handleActive} className="btn team-btn">Добавить</button>
                <button onClick={handleClick} className="btn team-btn">
                    Удалить
                </button>
            </div>}
            {members.map((member, index) => (
                <Teammate
                    user_id={member.user_id} // Идентификатор участника команды
                    currentUserId={user.user_id}
                    key={member.user_id}
                    surname={member.surname}
                    name={member.name}
                    email={member.email}
                    role={member.role_id.Int64}
                    roleId={member.role_id}
                    img={"https://via.placeholder.com/50"}
                    showBtn={showBtn}
                    onDelete={ () => {handleDeleteUser(member)}}
                />
            ))}
            <AddMember active={addingActive} setActive={setAddingActive} />
        </div>
    );
}
