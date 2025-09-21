import "./style.css"

import welcome from "../../../img/istockphoto-1350649344-612x612.jpg"
import welcome1 from "../../../img/8dd38cb4579aef38413a54af375cfbb9.jpg"
import welcome2 from "../../../img/istockphoto-1448479624-612x612.jpg"
import func1 from "../../../img/logo/Main/pngwing.com-_13_.svg"
import func2 from "../../../img/logo/Main/pngwing.com-_14_.svg"
import func3 from "../../../img/logo/Main/pngwing.com-_15_.svg"
import func4 from "../../../img/logo/Main/pngwing.com-_16_.svg"
import func5 from "../../../img/logo/Main/pngwing.com-_17_.svg"
import start from "../../../img/2148308631.jpg"
import Registration from "../../LoginForm/Registration.jsx";
import LoginForm from "../../LoginForm/Login.jsx";
import {useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

export default function Main(){
    const [RegActive, setRegActive] = useState(false);
    const [LoginActive, setLoginActive] = useState(false);
            const { isAuthenticated, user } = useSelector((state) => state.user);

    return (
        <section className="mainMen">
            <div className="container">
                {/* Hero Section */}
                <div className="hero-section">
                    <h1 className="mainTitle">
                        Добро пожаловать в <span className="gradient-text">VitaTask</span>
                    </h1>
                    <p className="hero-subtitle">
                        Современная платформа для эффективного управления задачами и командной работы
                    </p>
                    
                    {/* Navigation Buttons */}
                    <div className="hero-navigation">
                        {!isAuthenticated ? (
                            <div className="auth-buttons">
                                <button onClick={() => setLoginActive(true)} className="btn hero-btn login-btn">
                                    Войти
                                </button>
                                <button onClick={() => setRegActive(true)} className="btn hero-btn register-btn">
                                    Зарегистрироваться
                                </button>
                            </div>
                        ) : (
                            <div className="app-navigation">
                                <Link to="/messenger" className="btn hero-btn nav-btn">
                                    Мессенджер
                                </Link>
                                <Link to="/settings" className="btn hero-btn nav-btn">
                                    Настройки
                                </Link>
                                {!isAuthenticated || !user?.team_id ? (
                                    <Link to="/teamcr" className="btn hero-btn nav-btn">
                                        Создать команду
                                    </Link>
                                ) : (
                                    <Link to={`/team/${user.team_id}`} className="btn hero-btn nav-btn">
                                        Моя команда
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="mainMen__welcome">
                    <div className="welcome__content">
                        <div className="welcome__text-container">
                            <h2 className="welcome__title">Упростите работу вашей команды</h2>
                            <p className="welcome__text">
                                Мы рады видеть вас на платформе, созданной для упрощения взаимодействия
                                между менеджерами и сотрудниками. Здесь вы сможете легко управлять задачами, 
                                общаться с командой и отслеживать прогресс проектов в одном удобном месте.
                            </p>
                        </div>
                        <div className="welcome__images-container">
                            <img className="welcome__image main-image" src={welcome} alt="Team collaboration"/>
                            <div className="welcome__images">
                                <img src={welcome1} alt="Task management"/>
                                <img src={welcome2} alt="Team communication"/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="features-section">
                    <h2 className="func__title">Основные функции</h2>
                    <div className="main__func">
                        <div className="func__grid">
                            <div className="func__item">
                                <div className="func__icon">
                                    <img className="func__img" src={func1} alt="Task assignment"/>
                                </div>
                                <h3 className="func__item-title">Простое назначение задач</h3>
                                <p className="func__item-desc">Создавайте и назначайте задачи одним кликом</p>
                            </div>
                            <div className="func__item">
                                <div className="func__icon">
                                    <img className="func__img" src={func2} alt="Team communication"/>
                                </div>
                                <h3 className="func__item-title">Командное общение</h3>
                                <p className="func__item-desc">Встроенный мессенджер для быстрой связи</p>
                            </div>
                            <div className="func__item">
                                <div className="func__icon">
                                    <img className="func__img" src={func3} alt="Progress tracking"/>
                                </div>
                                <h3 className="func__item-title">Отслеживание прогресса</h3>
                                <p className="func__item-desc">Мониторинг выполнения задач в реальном времени</p>
                            </div>
                            <div className="func__item">
                                <div className="func__icon">
                                    <img className="func__img" src={func4} alt="Notifications"/>
                                </div>
                                <h3 className="func__item-title">Уведомления и напоминания</h3>
                                <p className="func__item-desc">Никогда не пропустите важные обновления</p>
                            </div>
                            <div className="func__item">
                                <div className="func__icon">
                                    <img className="func__img" src={func5} alt="Intuitive interface"/>
                                </div>
                                <h3 className="func__item-title">Интуитивный интерфейс</h3>
                                <p className="func__item-desc">Простота использования для всех уровней</p>
                            </div>
                        </div>
                        {!isAuthenticated && (
                            <button onClick={() => setRegActive(true)} className="btn func__btn">
                                Начать работу
                            </button>
                        )}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="cta-section">
                    <h2 className="main__join">Начните работать с нами сегодня!</h2>
                    <div className="cta-content">
                        <img className="start__img" src={start} alt="Get started"/>
                        <div className="cta-text">
                            <p className="join__text">
                                Присоединяйтесь к VitaTask и сделайте управление задачами более эффективным 
                                и организованным. Зарегистрируйтесь сейчас и откройте для себя новый уровень 
                                командной работы!
                            </p>
                            {!isAuthenticated && (
                                <button className="btn join__btn" onClick={() => setRegActive(true)}>
                                    Зарегистрироваться
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Registration active={RegActive} setActive={setRegActive} />
            <LoginForm active={LoginActive} setActive={setLoginActive} />
        </section>
    )
}
