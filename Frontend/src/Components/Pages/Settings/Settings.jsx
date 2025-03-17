import "./style.css"
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateUser} from "../../../../redux/slices/settingsSlice.js";


export default function Settings(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [err, setErr] = useState('')
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const user = useSelector((state) => state.auth.user);
    const userID = user.user_id

    const handleSubmit = (e) => {
        console.log(err)
        e.preventDefault();
        dispatch(updateUser({ email, password, name, surname, userID }))
        .unwrap()
        .then(() => {
            setEmail("");
            setPassword("");
            setName("");
            setSurname("");
        })
            .catch((err) => {
                e.preventDefault();
                console.error("Update failed:", err);
                setErr(err);
            });
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="settings">
                <h1 className="page__title">Settings</h1>
                <div className="sett-group">
                    <p>Фамилия</p>
                    <input className="form-control item" type="text" name="Фамилия" maxLength="15" minLength="4"
                           id="surname" placeholder={user.surname}
                           value={surname}
                           onChange={(e) => setSurname(e.target.value)}/>
                </div>
                <div className="sett-group">
                    <p>Имя</p>
                    <input className="form-control item" type="text" name="Имя" maxLength="15" minLength="4"
                           id="name" placeholder={user.name}
                           value={name}
                           onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="sett-group">
                    <p>Email</p>
                    <input className="form-control item" type="email" name="Почта" maxLength="15" minLength="4"
                           id="email" placeholder={user.email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="sett-group">
                    <p>Пароль</p>
                    <input className="form-control item" type="password" name="Пароль" minLength="3" id="password"
                           placeholder="Пароль"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                {err && <p className="error">{err.error}</p>}
                <button className="fixed-btn  btn" type="submit" disabled={loading}>{loading ? "Загрузка..." : "Сохранить изменения"}</button>
            </form>
        </div>
    )
}
