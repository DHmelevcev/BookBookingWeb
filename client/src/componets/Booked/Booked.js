import React from "react";
import "./Booked.css";

const Booked = ({ booked }) => {
    return (
        <div className="BookedContainer">
            <h3>Ваши забронированные книги</h3>
            {booked.length ?
                [booked]
                :
                <p>Вы ещё ничего не забронировали</p>
            }
        </div>
    )
}

export default Booked