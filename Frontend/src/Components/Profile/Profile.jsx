import "./style.css"
import {useParams} from "react-router-dom";
import {chats} from "../../helpers/chatList.jsx";

export default function Profile() {
    const {id} = useParams();
    const profile = chats[id];

    return (
        <div className="container">
            <div className="profile">
                <img className="profile-pic" src={profile.img} alt="profile"/>
                <div className="profile-text">
                    <h2 className="profile-surname">{profile.surname}</h2>
                    <h2 className="profile-name">{profile.name}</h2>
                </div>
            </div>
        </div>
    )
}
