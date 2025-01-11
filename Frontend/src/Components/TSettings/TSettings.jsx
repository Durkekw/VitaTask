import "./style.css"
import {NavLink, useParams} from "react-router-dom";
import {chats} from "../../helpers/chatList.jsx";

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
        return (
            <div className="container">
                <div className="tSettings">
                    <h1 className="page__title">Task Settings</h1>
                    <h1 className="fTitle">{settings.title}</h1>
                    <h1 className="respTitle">Ответственный:</h1>
                    <h2 className="respDesc">
                        {settings.surname} {settings.name}
                    </h2>
                    <h1 className="descTitle">Описание задачи:</h1>
                    <p className="descDesc">{settings.desc}</p>
                    <NavLink to={"/tasks"} className="btn tBtn">Назад</NavLink>
                </div>
            </div>
        )
    // }
}
