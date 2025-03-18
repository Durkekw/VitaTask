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
import {useState} from "react";
import {useSelector} from "react-redux";

export default function Main(){
    const [RegActive, setRegActive] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.user);


    return (
        <section className="mainMen">
            <div className="container">
                <h1 className="mainTitle">
                    Добро пожаловать в VitaTask
                </h1>
                <div className="mainMen__welcome">
                    <p className="welcome__text">Мы рады видеть вас на платформе, созданной для упрощения взаимодействия
                        между менеджерами и сотрудниками. <br/> Здесь вы сможете легко управлять задачами, общаться с
                        командой и отслеживать прогресс проектов<br/> в одном удобном месте.</p>
                    <img className="welcome__image" src={welcome}/>
                    <div className="welcome__images">
                        <img src={welcome1}/>
                        <img src={welcome2}/>
                    </div>
                </div>
                <h1 className="func__title">Основные функции:</h1>
                <div className="main__func">
                    <ul className="func__list">
                        <li className="func__item">
                            <img className="func__img" src={func1}/>
                            <p>Простое назначение задач</p>
                        </li>
                        <li className="func__item">
                            <img className="func__img" src={func2}/>
                            <p>Командное общение</p>
                        </li>
                        <li className="func__item">
                            <img className="func__img" src={func3}/>
                            <p>Отслеживание прогресса</p>
                        </li>
                        <li className="func__item">
                            <img className="func__img" src={func4}/>
                            <p>Уведомления и напоминания</p>
                        </li>
                        <li className="func__item">
                            <img className="func__img" src={func5}/>
                            <p>Интуитивно понятный интерфейс</p>
                        </li>

                    </ul>
                    {!isAuthenticated && <button onClick={() => setRegActive(true)} className="btn func__btn"><a>Начать!</a></button>}
                </div>
                <h1 className="main__join">Начните работать с нами сегодня!</h1>
                <img className="start__img" src={start}/>
                <p className="join__text">Присоединяйтесь к VitaTask и сделайте управление задачами более эффективным и организованным. <br/>Зарегистрируйтесь сейчас и откройте для себя новый уровень командной работы!</p>
                {!isAuthenticated && <button className="jb"><a className="btn join__btn"
                                           onClick={() => setRegActive(true)}>Зарегистрироваться</a></button>}
            </div>
            <Registration active={RegActive} setActive={setRegActive} />
        </section>
    )
}
