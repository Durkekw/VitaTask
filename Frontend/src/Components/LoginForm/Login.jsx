import "./style.css"
import close from "../../img/png-klev-club-bewz-p-krestik-chernii-png-28.png";


export default function LoginForm({active, setActive}) {
    return (
        <div className={active ? "form active" : "form"}  onClick={() => setActive(false)}>
            <section className="form__window" onClick={e => e.stopPropagation()}>
                <form>
                    <button className="close" onClick={() => setActive(false)}><img className="close__img" src={close}/>
                    </button>
                    <h1>Вход</h1>
                    <div className="form-group">
                        <input className="form-control" type="text" name="username" maxLength="15" minLength="4"
                               pattern="^[a-zA-Z0-9_.-]*$" id="username" placeholder="Логин" required/>
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="password" name="Пароль" minLength="6" id="password"
                               placeholder="Пароль" required/>
                    </div>
                    <div className="form-group btn">
                        <button className="create-account" type="submit">Вход в аккаунт</button>
                    </div>
                </form>
            </section>
        </div>
    )
}
