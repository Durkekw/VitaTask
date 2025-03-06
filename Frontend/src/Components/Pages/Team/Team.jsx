import "./style.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // Добавляем useParams для получения teamId из URL
import Teammate from "../../Elements/Teammate/Teammate.jsx";

export default function Team() {
    const [showBtn, setShowBtn] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { team } = useSelector((state) => state.team);
    const { teamId } = useParams(); // Получаем teamId из URL

    const handleClick = () => {
        setShowBtn(!showBtn);
    };

    // Загрузка данных команды по teamId (если нужно)
    useEffect(() => {
        if (teamId) {
            // Здесь можно добавить запрос к API для загрузки данных команды
            console.log("Загружаем данные команды с ID:", teamId);
        }
    }, [teamId]);

    return (
        <div className="container">
            <div className="team_btns">
                <button className="btn team-btn">Добавить</button>
                <button onClick={handleClick} className="btn team-btn">
                    Удалить
                </button>
            </div>
            {team && team.members.map((member, index) => (
                <Teammate
                    key={index}
                    surname={member.surname}
                    name={member.name}
                    index={index}
                    showBtn={showBtn}
                />
            ))}
        </div>
    );
}
