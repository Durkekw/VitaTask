import "./style.css";
import logo from "../../img/logo/Group.svg";
import {useEffect, useState} from "react";
import LoginForm from "../LoginForm/Login.jsx";
import Registration from "../LoginForm/Registration.jsx";
import {NavLink, useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice.js";
import { createTeam } from "../../../redux/slices/teamSlice.js";
import {store} from "../../../redux/store/store.js";

export default function Nav() {
    const [LoginActive, setLoginActive] = useState(false);
    const [RegActive, setRegActive] = useState(false);
    const { isAuthenticated} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const teamId = useSelector((state) => state.team.teamId);
    const activeLink = "nav-list__link nav-list__link--active";
    const normalLink = "nav-list__link";
    const { team } = useSelector((state) => state.team);
    const isUserInTeam = () => {
        console.log("User from Redux:", user);
        console.log("User team_id:", user.team_id);
        console.log("TeamId from Redux:", teamId);
        console.log("Redux state:", store.getState());
    }

    const handleLogout = () => {
        navigate('/');
        dispatch(logout());
    };


    return (
        <nav className="nav">
            <div className="top_nav">
                <ul className="top-nav__list">
                    <li className="top-nav__item nav_logo">
                        <div>
                            <img className="logo" src={logo} alt="logo" />
                        </div>
                        <div>
                            <h1 className="hh">
                                Vita<span>Task</span>
                            </h1>
                        </div>
                    </li>
                    {!isAuthenticated ? (
                        <li className="top-nav__item">
                            <button className="nav__btn">
                                <a onClick={() => setLoginActive(true)}>Войти</a>
                            </button>
                            <button className="nav__btn">
                                <a onClick={() => setRegActive(true)}>Регистрация</a>
                            </button>
                        </li>
                    ) : (
                        <li className="top-nav__item">
                            <button className="nav__btn" >
                                <a onClick={handleLogout}>Выйти</a>
                            </button>
                        </li>
                    )}
                </ul>
            </div>
            <div className="side_nav">
                {isAuthenticated && (
                    <div className="nav_btns">
                        <div className="side__btn">
                            <NavLink
                                className={({ isActive }) => (isActive ? activeLink : normalLink)}
                                to="/"
                            >
                                Главная
                            </NavLink>
                        </div>
                        <div className="side__btn">
                            <NavLink
                                className={({ isActive }) => (isActive ? activeLink : normalLink)}
                                to="/messenger"
                            >
                                Мессенджер
                            </NavLink>
                        </div>
                        <div className="side__btn">
                            <NavLink
                                className={({ isActive }) => (isActive ? activeLink : normalLink)}
                                to="/tasks"
                            >
                                Задачи
                            </NavLink>
                        </div>
                        {user.team_id ? ( // Если team_id существует и Valid = true
                            <div className="side__btn">
                                <NavLink
                                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                                    to={`/team/${teamId}`} // Ссылка на страницу команды
                                >
                                    Ваша команда
                                </NavLink>
                            </div>
                        ) : ( // Если team_id не существует или Valid = false
                            <div className="side__btn">
                                <NavLink
                                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                                    to="/teamcr"
                                >
                                    Создать команду
                                </NavLink>
                            </div>
                        )}
                        <button onClick={isUserInTeam}>проверка</button>
                        <div className="side__btn">
                            <NavLink
                                className={({ isActive }) => (isActive ? activeLink : normalLink)}
                                to="/settings"
                            >
                                Настройки
                            </NavLink>
                        </div>
                    </div>
                )}
            </div>
            <LoginForm active={LoginActive} setActive={setLoginActive} />
            <Registration active={RegActive} setActive={setRegActive} />
        </nav>
    );
}
