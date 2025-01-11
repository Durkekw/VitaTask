import "./style.css"
import {chats} from "../../../helpers/chatList.jsx";
import Chat from "../../Chat/Chat.jsx";

export default function Messenger() {
    return (
        <div className="messenger">
            <div className="container">
                {chats.map((chat, index) =>{
                    return <Chat surname={chat.surname} name={chat.name} img={chat.img} key={index} index={index} />
                })}
            </div>
        </div>
    )
}
