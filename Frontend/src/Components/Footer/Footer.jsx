import "./style.css"
import gerb from "../../img/Рисунок02.png"

export default function Footer() {
    return (
        <footer className="footer">
            <img src={gerb}/>
            <h1>Выполнил студент группы ИСП-322<br/>Косован Андрей</h1>
        </footer>
    )
}
