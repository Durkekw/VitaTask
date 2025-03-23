import "./style.css"
import logo from "../../../img/logo/Group.svg";
import remove_btn from "../../../img/png-klev-club-bewz-p-krestik-chernii-png-28.png";
import React from "react";
import adding from "../../../img/pngwing.com (18).png";
import {NavLink} from "react-router-dom";

export default React.memo(function Unteamed(props) {
    return (
        <div className="chat-container">
            <div className="teammate">
                <NavLink to={`/profile/${props.userId}`}>
                <div className="team-links">
                        <img className="chat-img" src={logo} alt="User" />
                        <p className="chat__name">{props.surname} {props.name}</p>
                </div>
                </NavLink>
                <button onClick={props.onAdd}>
                    <img src={adding} className="add_btn" alt="Add User" />
                </button>
            </div>
        </div>
    );
});
