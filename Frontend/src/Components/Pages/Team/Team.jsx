import "./style.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Teammate from "../../Elements/Teammate/Teammate.jsx";

export default function Team() {
    const [showBtn, setShowBtn] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { team } = useSelector((state) => state.team);

    const handleClick = () => {
        setShowBtn(!showBtn);
    };

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
