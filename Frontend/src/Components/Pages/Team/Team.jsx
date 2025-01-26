import "./style.css"
import {chats} from "../../../helpers/chatList.jsx";
import Teammate from "../../Elements/Teammate/Teammate.jsx";

export default function Team() {
    return (
        <div className="container">
            {chats.map((chat, index) =>{
                return <Teammate surname={chat.surname} name={chat.name} img={chat.img} key={index} index={index} />
            })}
        </div>
    )
}
