import "./style.css"
import logo from "../../../img/logo/Group.svg";
import React from "react";
import {NavLink} from "react-router-dom";

export default React.memo(function Unteamed(props) {
    return (
        <div className="unteamed-card">
            <div className="user-info">
                <NavLink to={`/profile/${props.userId}`} className="user-link">
                    <div className="user-avatar">
                        <img className="avatar-img" src={logo} alt="User" />
                    </div>
                    <div className="user-details">
                        <h3 className="user-name">{props.surname} {props.name}</h3>
                        {props.email && <p className="user-email">{props.email}</p>}
                    </div>
                </NavLink>
            </div>
            <button className="add-user-btn" onClick={props.onAdd}>
                <span className="add-icon">+</span>
                <span className="add-text">Добавить</span>
            </button>
        </div>
    );
});