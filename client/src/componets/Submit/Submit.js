import React from "react"
import "./Submit.css";

const Submit = ({question, activate, cancel}) => {
    return(
        <div className="submitWindow">
            <h3>{question}</h3>
            <button className="confirmButton" onClick={activate}>Подтвердить</button>
            <button className="cancelButton" onClick={cancel}>Отмена</button>
        </div>
    )
}

export default Submit