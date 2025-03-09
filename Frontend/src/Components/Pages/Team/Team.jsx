import "./style.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Teammate from "../../Elements/Teammate/Teammate.jsx";
import { fetchTeamMembers } from "../../../../redux/slices/teamSlice";
import AddMember from "../../AddMember/AddMember.jsx";

export default function Team() {
    const [showBtn, setShowBtn] = useState(false);
    const [addingActive, setAddingActive] = useState(false)
    const { user } = useSelector((state) => state.auth);
    const { teamId, members, loading, error } = useSelector((state) => state.team);
    const { teamId: paramTeamId } = useParams();
    const dispatch = useDispatch();

    const handleClick = () => {
        setShowBtn(!showBtn);
    };

    const handleActive = () =>{
        setAddingActive(true)
    }

    useEffect(() => {
        if (paramTeamId) {
            dispatch(fetchTeamMembers(paramTeamId));
        } else {
            console.error("teamId is missing in the URL");
        }
    }, [paramTeamId, dispatch]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <div className="container">
            <div className="team_btns">
                <button onClick={handleActive} className="btn team-btn">Добавить</button>
                <button onClick={handleClick} className="btn team-btn">
                    Удалить
                </button>
            </div>
            {members.length > 0 ? (
                members.map((member, index) => (
                    <Teammate
                        key={member.user_id} // Используем уникальный user_id как ключ
                        surname={member.surname}
                        name={member.name}
                        email={member.email}
                        role={member.role_id.Int64} // Передаем role_id
                        roleId={member.role_id} // Явно передаем roleId
                        img={"https://via.placeholder.com/50"} // Пример аватара
                        showBtn={showBtn}
                    />
                ))
            ) : (
                <div>Нет участников в команде</div>
            )}
            <AddMember active={addingActive} setActive={setAddingActive} />
        </div>
    );
}
