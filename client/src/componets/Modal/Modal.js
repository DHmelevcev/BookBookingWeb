import React from "react";
import "./Modal.css"

const Modal = ({id, active, setActive, style, children}) => {
    return (
        <div id={id} className={active ? "Modal active" : "Modal"} onClick={() => setActive(false)}>
            <div className={active ? "ModalContent active" : "ModalContent"}
                 onClick={e => e.stopPropagation()}
                 style={{...style}}
            >
                {children}
            </div>
        </div>
    )
}

export default Modal