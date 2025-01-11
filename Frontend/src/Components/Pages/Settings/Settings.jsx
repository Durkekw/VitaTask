import "./style.css"

export default function Settings(props) {
    return (
        <div className="container">
            <form className="settings">
                <h1 className="page__title">Task Change</h1>
                <div className="sett-group">
                    <p>Логин</p>
                    <input className="form-control item" type="text" name="Логин" maxLength="15" minLength="4"
                           id="login" placeholder={props.login}/>
                </div>
                <div className="sett-group">
                    <p>Пароль</p>
                    <input className="form-control item" type="password" name="Пароль" minLength="6" id="password"
                           placeholder="Пароль" required/>
                </div>
                <button className="change__sett btn" type="submit">Сохранить изменения</button>
            </form>
        </div>
    )
}
