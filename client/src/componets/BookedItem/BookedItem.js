import React, { useState, useEffect } from "react"
import { CSSTransition } from 'react-transition-group';
import { Link } from "react-router-dom";
import "./BookedItem.css";

const transitions = {
    entered: {
        opacity: 1,
        transition: "0.9s opacity",
    },
}

const BookedItem = ({ date, bookId, bookImg, bookName }) => {
    const [transitionState, setTransitionState] = useState(false)

    useEffect(() => {
        setTransitionState(true)
    }, []);

    return (
        <CSSTransition in={transitionState} timeout={100}>
            {state => (
                <Link to={"/book/" + bookId} className="BookedItem" style={{
                        opacity: 0,
                        ...transitions[state]
                }}>
                    <div className="BookedItemContent">
                        <div className="BookedItemImg">
                            <img src={bookImg} alt=""  onError={(e)=> {
                                e.target.src = "../../read-book-icon.svg";
                            }}/>
                        </div>
                        <p>{bookName}</p>
                    </div>
                    <p>
                        до {date}
                    </p>
                </Link>
            )}
        </CSSTransition>
    )
}

export default BookedItem