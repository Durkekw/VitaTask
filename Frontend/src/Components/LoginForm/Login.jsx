import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/slices/authSlice.js";
import "./style.css";
import close from "../../img/png-klev-club-bewz-p-krestik-chernii-png-28.png";

export default function LoginForm({ active, setActive }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }))
            .unwrap()
            .then(() => {
                setActive(false); // Закрыть модальное окно после успешного входа
            })
            .catch((err) => {
                console.error("Login failed:", err);
            });
    };

    return (
        <div className={active ? "form active" : "form"} onClick={() => setActive(false)}>
            <section className="form__window" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <button className="close" onClick={() => setActive(false)}>
                        <img className="close__img" src={close} />
                    </button>
                    <h1>Вход</h1>
                    {error && <p className="error">{error}</p>}
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            required
                        />
                    </div>
                    <div className="form-group btn">
                        <button className="create-account" type="submit" disabled={loading}>
                            {loading ? "Загрузка..." : "Вход в аккаунт"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
