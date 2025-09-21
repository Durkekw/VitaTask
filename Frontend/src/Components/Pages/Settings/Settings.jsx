import "./style.css"
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateUser} from "../../../../redux/slices/userSlice.js";

export default function Settings(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [err, setErr] = useState('')
    const [success, setSuccess] = useState('')
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);
    const user = useSelector((state) => state.user.user);
    const userID = user.user_id

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUser({ email, password, name, surname, userID }))
        .unwrap()
        .then(() => {
            setEmail("");
            setPassword("");
            setName("");
            setSurname("");
            setSuccess("Данные успешно обновлены!");
            setErr('');
            setTimeout(() => setSuccess(''), 3000);
        })
            .catch((err) => {
                console.error("Update failed:", err);
                setErr(err);
                setSuccess('');
            });
    }

    return (
        <div className="container">
            <div className="settings-container">
                <div className="settings-header">
                    <h1 className="page__title">Настройки профиля</h1>
                    <p className="settings-subtitle">Обновите информацию о вашем аккаунте</p>
                </div>
                
                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="form-section">
                        <h3 className="section-title">Личная информация</h3>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Фамилия</label>
                                <input 
                                    className="form-control" 
                                    type="text" 
                                    name="Фамилия" 
                                    maxLength="30" 
                                    minLength="2"
                                    id="surname" 
                                    placeholder={user.surname}
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Имя</label>
                                <input 
                                    className="form-control" 
                                    type="text" 
                                    name="Имя" 
                                    maxLength="30" 
                                    minLength="2"
                                    id="name" 
                                    placeholder={user.name}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Контактная информация</h3>
                        
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input 
                                className="form-control" 
                                type="email" 
                                name="Почта" 
                                maxLength="50" 
                                minLength="5"
                                id="email" 
                                placeholder={user.email}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Безопасность</h3>
                        
                        <div className="form-group">
                            <label className="form-label">Новый пароль</label>
                            <input 
                                className="form-control" 
                                type="password" 
                                name="Пароль" 
                                minLength="6" 
                                id="password"
                                placeholder="Введите новый пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <p className="form-hint">Оставьте поле пустым, если не хотите менять пароль</p>
                        </div>
                    </div>

                    {err && (
                        <div className="error-message">
                            <p className="error">{err.error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="success-message">
                            <p className="success">{success}</p>
                        </div>
                    )}

                    <div className="form-actions">
                        <button 
                            className="btn save-btn" 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? "Сохранение..." : "Сохранить изменения"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
