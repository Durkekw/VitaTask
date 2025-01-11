import "./style.css"

export default function Message(props) {
    return (
        <div className="message">
            <div className="message-header"></div>
            <p>{props.message}</p>
        </div>
    )
}
