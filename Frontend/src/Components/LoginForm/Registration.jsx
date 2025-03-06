import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/slices/authSlice.js";
import "./style.css";
import close from "../../img/png-klev-club-bewz-p-krestik-chernii-png-28.png";

export default function Registration({ active, setActive }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({ email, password, name, surname }))
            .unwrap()
            .then(() => {
                setActive(false);
                setEmail("");
                setPassword("");
                setName("");
                setSurname("");
            })
            .catch((err) => {
                console.error("Registration failed:", err);
            });
    };

    return (
        <div className={active ? "form active" : "form"} onClick={() => setActive(false)}>
            <section className="form__window" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <button className="close" onClick={() => setActive(false)}>
                        <img className="close__img" src={close} />
                    </button>
                    <h1>Регистрация</h1>
                    {error && <p className="error">{error}</p>}
                    <div className="form-group">
                        <input
                            className="form-control item"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control item"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control item"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Имя"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control item"
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="Фамилия"
                            required
                        />
                    </div>
                    <div className="form-group btn">
                        <button className="create-account" type="submit" disabled={loading}>
                            {loading ? "Загрузка..." : "Зарегистрироваться"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
