import "./style.css"
import Task from "../../Elements/Task/Task.jsx";
import {NavLink} from "react-router-dom";

export default function Tasks(){
    return (
        <div className="container">
            <div className="tasks">
                <ul className="task__list">
                    <Task index={0} title={"Lol"} surname={"gagaga"} name={"Ivan"} deadline={"22.02.25"}/>
                    <Task index={1} title={"Lol"} surname={"gagaga"} name={"Ivan"} deadline={"22.02.25"}/>
                </ul>
                <NavLink to={"/task-change"}><button className="fixed-btn btn">Добавить задачу</button></NavLink>
            </div>
        </div>
    )
}
