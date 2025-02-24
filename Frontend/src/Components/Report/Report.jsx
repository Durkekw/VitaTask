import "./style.css"
import {useState} from "react";

export default function Report({active, setActive}) {
    const [expanded, setExpanded] = useState(false);
    const [status, setStatus] = useState("В процессе")

    const handleClick = () => {
        setExpanded(!expanded)
    }

    const statusChangeProc = () => {
        setStatus("В процессе")
        setExpanded(!expanded)
    }

    const statusChangeFinish = () => {
        setStatus("Завершен")
        setExpanded(!expanded)
    }

    const content = (<div>
        <div className="status_component" onClick={statusChangeProc}>В процессе</div>
        <div className="status_component" onClick={statusChangeFinish}>Завершен</div>
    </div>)
    return (
        <div className={active ? "report active" : "report"} onClick={() => setActive(false)}>
            <section className="report__window" onClick={e => e.stopPropagation()}>
                <h2 className="rep-title">Отчет</h2>
                <h2 className="report_status">Статус</h2>
                {!expanded && <div className="status_changer" onClick={handleClick}>{status}</div>}
                {expanded && content}
                <textarea className="re__type" id="disText"
                          placeholder="Текст отчета"/>
                <button className="btn save_btn">Отправить</button>
            </section>
        </div>
    )
}
