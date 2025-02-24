import "./style.css"
import {chats} from "../../../helpers/chatList.jsx";
import Teammate from "../../Elements/Teammate/Teammate.jsx";
import {useState} from "react";

export default function Team() {
    const [showBtn, setShowBtn] = useState(false)

    const handleClick = () =>{
        setShowBtn(!showBtn)
    }

    return (
        <div className="container">
            <div className="team_btns">
                <button className="btn team-btn">Добавить</button>
                <button onClick={handleClick} className="btn team-btn">Удалить</button>
            </div>
            {chats.map((chat, index) => {
                return <Teammate surname={chat.surname} name={chat.name} img={chat.img} key={index} index={index} showBtn={showBtn}/>
            })}
        </div>
    )
}
