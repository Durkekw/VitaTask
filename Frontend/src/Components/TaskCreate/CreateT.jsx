import "./style.css"
import {NavLink} from "react-router-dom";

export default function CreateT() {
    return (
        <div className="container">
            <div className="tSettings">
                <h1 className="page__title">Task Change</h1>
                <form>
                    <h1 className="respTitle">Задача:</h1>
                    <input className="form-control" type="text" id="taskTitle"
                           placeholder="Введите название вашей задачи" required/>
                    <h1 className="respTitle">Ответственный:</h1>
                    <input className="form-control" type="text" id="taskTitle"
                           placeholder="Введите ФИО ответственного человека"/>
                    <h1 className="descTitle">Описание задачи:</h1>
                    <textarea className="createDesc" id="mesText"
                              placeholder="Введите подробности этой задачи"/>
                    <button type="submit" className="btn tBtn">Сохранить</button>
                    <NavLink to={"/tasks"} className="btn tBtn">Назад</NavLink>
                </form>
            </div>
        </div>
    )
}
