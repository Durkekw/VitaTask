import "./style.css";
import logo from "../../img/logo/Group.svg";
import { useState } from "react";
import LoginForm from "../LoginForm/Login.jsx";
import Registration from "../LoginForm/Registration.jsx";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice.js";

export default function Nav() {
    const [LoginActive, setLoginActive] = useState(false);
    const [RegActive, setRegActive] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const activeLink = "nav-list__link nav-list__link--active";
    const normalLink = "nav-list__link";

    const handleLogout = () => {
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
                            <button className="nav__btn" onClick={handleLogout}>
                                Выйти
                            </button>
                        </li>
                    )}
                </ul>
            </div>
            <div className="side_nav">
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
                    <div className="side__btn">
                        <NavLink
                            className={({ isActive }) => (isActive ? activeLink : normalLink)}
                            to="/groups"
                        >
                            Ваша Команда
                        </NavLink>
                    </div>
                    <div className="side__btn">
                        <NavLink
                            className={({ isActive }) => (isActive ? activeLink : normalLink)}
                            to="/settings"
                        >
                            Настройки
                        </NavLink>
                    </div>
                </div>
            </div>
            <LoginForm active={LoginActive} setActive={setLoginActive} />
            <Registration active={RegActive} setActive={setRegActive} />
        </nav>
    );
}
