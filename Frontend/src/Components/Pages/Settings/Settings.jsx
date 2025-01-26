import "./style.css"

export default function Settings(props) {
    return (
        <div className="container">
            <form className="settings">
                <h1 className="page__title">Settings</h1>
                <div className="sett-group">
                    <p>Фамилия</p>
                    <input className="form-control item" type="text" name="Фамилия" maxLength="15" minLength="4"
                           id="login" placeholder={props.login}/>
                </div>
                <div className="sett-group">
                    <p>Имя</p>
                    <input className="form-control item" type="text" name="Имя" maxLength="15" minLength="4"
                           id="login" placeholder={props.login}/>
                </div>
                <div className="sett-group">
                    <p>Логин</p>
                    <input className="form-control item" type="text" name="Логин" maxLength="15" minLength="4"
                           id="login" placeholder={props.login}/>
                </div>
                <div className="sett-group">
                    <p>Пароль</p>
                    <input className="form-control item" type="password" name="Пароль" minLength="6" id="password"
                           placeholder="Пароль"/>
                </div>
                <button className="fixed-btn  btn" type="submit">Сохранить изменения</button>
            </form>
        </div>
    )
}
