import "./style.css"
import {NavLink, useParams} from "react-router-dom";
import {chats} from "../../helpers/chatList.jsx";
import send from "../../img/free-icon-send-button-60525.png";
import {useState} from "react";
import Message from "../Elements/Message/Message.jsx";
import Report from "../Report/Report.jsx";

export default function TSettings() {
    const {id} = useParams();
    const settings = chats[id];
    // if (settings.role==="manager") {
    //     return (
    //         <div className="container">
    //             <div className="fasfasfa">fsafas</div>
    //         </div>
    //     )
    // }else{
    const [textValue, setTextValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [reportActive, setReportActive] = useState(false);


        const handleTextChange = (event) => {
            setTextValue(event.target.value);
        };

        const handlePopupClick = () =>{
            setReportActive(true);
        }

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
                <div className="tSettings">
                    <h1 className="page__title">Task Settings</h1>
                    <h1 className="fTitle">{settings.title}</h1>
                    <h1 className="respTitle">Ответственный:</h1>
                    <h2 className="respDesc">
                        {settings.surname} {settings.name}
                    </h2>
                    <h2 className="create_date_title">Дата создания:</h2>
                    <h3 className="create_date_content">{settings.created_at}</h3>
                    <h2 className="deadline_title">Сроки:</h2>
                    <h3 className="deadline_content">{settings.deadline}</h3>
                    <h1 className="descTitle">Описание задачи:</h1>
                    <p className="descDesc">{settings.desc}</p>
                    <NavLink to={"/tasks"} className="btn back__btn"></NavLink>
                    <button onClick={handlePopupClick} className="btn task-rep-btn">Отправить отчет</button>
                    <h1 className="descTitle">Статус</h1>
                    <div className="statusbar tStatus">
                        <p className="statusbar__info">В процессе</p>
                        <div className="statusbar-yellow tset-statusbar-col"></div>
                    </div>
                    <h1 className="disc-title">Обсуждение</h1>
                    <div className="discussion">
                        <div className="disSpace">
                            {messages.map((message, index) => (
                                <Message key={index} message={message}/>
                            ))}
                        </div>
                        <div className="add-disc">
                            <div method="post" className="disInput">
                            <textarea className="dis__type" value={textValue}
                                      onChange={handleTextChange} onKeyDown={handleKeyDown}
                                      id="disText"
                                      placeholder="Введите ваше сообщение"/>
                                <button onClick={handleButtonClick}><img className="dis__send" src={send} alt=""/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Report setActive={setReportActive} active={reportActive}/>
            </div>
        )
    // }
}
