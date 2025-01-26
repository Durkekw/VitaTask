import "./style.css"
import {NavLink, useParams} from "react-router-dom";
import {chats} from "../../helpers/chatList.jsx";
import ecs from "../../img/png-klev-club-bewz-p-krestik-chernii-png-28.png"
import send from "../../img/free-icon-send-button-60525.png"
import {useState} from "react";
import Message from "../Elements/Message/Message.jsx";

export default function Messages() {

    const {id} = useParams();
    const message = chats[id];
    const [textValue, setTextValue] = useState('');
    const [messages, setMessages] = useState([]);


    const handleTextChange = (event) => {
        setTextValue(event.target.value);
    };

    const handleButtonClick = () => {
        if (textValue.trim()) {
            setMessages([...messages, textValue]);
            setTextValue('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleButtonClick();
        }
    };

    return (

        <div className="container">
            <div className="messages">
                <div className="topMes">
                    <NavLink to={"/messenger"} className="mes__esc"><img src={ecs}/></NavLink>
                    <img className="mes__img" src={message.img} alt=""/>
                    <p className="mes__name">{message.surname} {message.name}</p>
                </div>
                <div className="mesSpace">
                    {messages.map((message, index) => (
                        <Message key={index} message={message} />
                    ))}
                </div>
                <div className="mesInput">
                    <textarea className="mes__type" value={textValue}
                              onChange={handleTextChange} onKeyDown={handleKeyDown} id="mesText"
                           placeholder="Введите ваше сообщение"/>
                           <button onClick={handleButtonClick}><img className="mes__send" src={send} alt=""/></button>
                </div>
            </div>
        </div>
    )
}
