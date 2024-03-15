import React from "react";
import { Link } from "react-router-dom";
import "./GridBook.css";

const GridBook = ({ img, name, id}) => {
    return (
        <Link to={"/book/" + id} className="Book">
            <img src={img} alt="" onError={(e)=> {
                e.target.src = "../../read-book-icon.svg";
            }}/>
            <p>{name}</p>
        </Link>
    )
}

export default GridBook