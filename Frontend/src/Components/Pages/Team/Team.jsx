import "./style.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Teammate from "../../Elements/Teammate/Teammate.jsx";
import { fetchTeamMembers } from "../../../../redux/slices/teamSlice";
import AddMember from "../../AddMember/AddMember.jsx";

export default function Team() {
    const [showBtn, setShowBtn] = useState(false);
    const [addingActive, setAddingActive] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { teamId, members, loading, error } = useSelector((state) => state.team);
    const { teamId: paramTeamId } = useParams();
    const dispatch = useDispatch();

    const handleClick = () => {
        setShowBtn(!showBtn);
    };

    const handleActive = () => {
        setAddingActive(true);
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
            <div className="team_btns">
                <button onClick={handleActive} className="btn team-btn">Добавить</button>
                <button onClick={handleClick} className="btn team-btn">
                    Удалить
                </button>
            </div>
            {members.map((member, index) => (
                <Teammate
                    key={member.user_id}
                    surname={member.surname}
                    name={member.name}
                    email={member.email}
                    role={member.role_id.Int64}
                    roleId={member.role_id}
                    img={"https://via.placeholder.com/50"}
                    showBtn={showBtn}
                />
            ))}
            <AddMember active={addingActive} setActive={setAddingActive} />
        </div>
    );
}
