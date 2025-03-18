import "./style.css"
import {NavLink} from "react-router-dom";
import Teammate from "../Elements/Teammate/Teammate.jsx";
import {useSelector} from "react-redux";



export default function CreateT() {
    const { members } = useSelector((state) => state.team);
    const teamId = useSelector((state) => state.team.teamId);
    return (
        <div className="container">
            <div className="tSettings">
                <h1 className="page__title">Task Change</h1>
                <form>
                    <h1 className="respTitle">Задача:</h1>
                    <input className="form-control" type="text" id="taskTitle"
                           placeholder="Введите название вашей задачи" required/>
                    <h1 className="respTitle">Ответственный:</h1>
                    <select className="form-control" name="colors">
                        {members.map((member) => (
                            <option key={member.user_id} value={member.user_id}>
                                {member.surname} {member.name}
                            </option>
                        ))}
                    </select>
                    <h1 className="respTitle">Срок выполнения:</h1>
                    <input className="form-control" type="date" id="taskTitle"
                           placeholder="Введите срок выполнения"/>
                    <h1 className="descTitle">Описание задачи:</h1>
                    <textarea className="createDesc" id="mesText"
                              placeholder="Введите подробности этой задачи"/>
                    <button type="submit" className="btn tBtn">Сохранить</button>
                    <NavLink to={`/tasks/${teamId}`} className="btn back__btn"></NavLink>
                </form>
            </div>
        </div>
    )
}
