import {NavLink} from "react-router-dom";
import {createTeam} from "../../../../redux/slices/teamSlice.js";
import {useDispatch, useSelector} from "react-redux";

export default function TeamCreate() {
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.user);

    const handleCreateTeam = (evt) => {
        evt.preventDefault();
        dispatch(createTeam({ teamName: "New Team", userId: user.userId }))
            .unwrap()
            .then(() => {
                alert("Команда успешно создана!");
            })
            .catch((error) => {
                console.error("Ошибка при создании команды:", error);
            });
    };

    return (
        <div className="container">
            <div className="tSettings">
                <h1 className="page__title">Create Team</h1>
                <form onSubmit={handleCreateTeam}>
                    <h1 className="respTitle">Название вашей команды:</h1>
                    <input className="form-control" type="text" id="taskTitle"
                           placeholder="Введите название вашей команды" required/>
                    <button type="submit" className="btn tBtn">Создать</button>
                </form>
            </div>
        </div>
    )
}
