import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookPage.css";
import BookedItem from "../BookedItem/BookedItem"
import Modal from "../Modal/Modal";
import Submit from "../Submit/Submit";
import axios from "../../api/axios";

const BookPage = ({ userId, admin, setLoginActive, booked, setBooked, setBookedActive, handleSearch}) => {
    const id= useParams().id

    const navigate = useNavigate()

    const [book, setBook] = useState({})
    const [thisBooked, setThisBooked] = useState(false)

    const [deleteBookedActive, setDeleteBookedActive] = useState(false)
    const [writeOffBookActive, setWriteOffBookActive] = useState(false)

    useEffect(() => {
        const updateBook = async () => {
            try {
                const book = (await axios.get('/book/' + id,
                    {
                        headers: {'Content-Type': 'application/json'},
                        withCredentials: true
                    }
                )).data

                setBook(book)

                if (userId) {
                    setThisBooked(!!booked.find(nextBook => { return nextBook.props.bookId === id }))
                }
            }
            catch (err) {
                setBook({})
            }
        }

        updateBook()
    }, [id])

    useEffect(() => {
        if (userId) {
            setThisBooked(!!booked.find(nextBook => { return nextBook.props.bookId === id }))
        }
    }, [booked])

    const handleNewBooked = async () => {
        if (userId) {
            if (!!booked.find(nextBook => { return nextBook.bookId === book.id }))
            {
                //Уже забронированно, такого не должно произойти
                setThisBooked(true)
                return
            }

            try {
                const newBooked = (await axios.post('/booked', {
                        bookId: id, userId: userId
                },
                    {
                        headers: {'Content-Type': 'application/json'},
                        withCredentials: true
                    }
                )).data

                const date = new Date(newBooked.date)
                setBooked([...booked, <BookedItem key={newBooked.id}
                                                  date={`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}
                                                  bookId={newBooked.bookId}
                                                  bookImg={book.img}
                                                  bookName={book.name}
                />])

                setBookedActive(true)
                setThisBooked(true)
            }
            catch (err) {}
        }
        else {
            setLoginActive(true)
        }
    }

    const handleDeleteBooked = async () => {
        const emptierBooked = booked.filter(item => {
            return item.props.bookId !== id
        })
        const itemInBookedToDelete = booked.find(item => {
            return item.props.bookId === id
        })
        setDeleteBookedActive(false)

        try {
            if (itemInBookedToDelete) {
                await axios.delete('/booked',
                    {
                        data: {id: itemInBookedToDelete.key},
                        headers: {'Content-Type': 'application/json'},
                        withCredentials: true
                    })
            }

            setBooked(emptierBooked)
            setThisBooked(false)
        }
        catch (err) {}
    }

    const handleWriteOff = async () => {
        const emptierBooked = booked.filter(item => { return item.props.bookId !== id })
        setWriteOffBookActive(false)

        try {
            await axios.delete('/book',
                {
                    data: {id: book.id},
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                })

            try {
                await axios.delete('/booked',
                    {
                        data: {bookId: book.id},
                        headers: {'Content-Type': 'application/json'},
                        withCredentials: true
                    })
            }
            catch (err) {}

            setBooked(emptierBooked)
            setThisBooked(false)

            navigate("/")
            handleSearch()
        }
        catch (err) {}
    }

    return (
        <div className="BookPage">
            { book.id ?
                <>
                    <div className="BookPageImgActions">
                        <img className="BookPageImg" src={book.img} alt=""  onError={(e)=> {
                            e.target.src = "../../read-book-icon.svg";
                        }}/>
                        <div className="BookPageActions">
                            {!userId || !thisBooked ?
                                <button className="BookingButton" onClick={handleNewBooked}>Забронировать</button>
                                :
                                <>
                                    <button className="BookingButton" onClick={() => setDeleteBookedActive(true)}>Отменить бронь</button>
                                    <Modal id="modalDeleteBooked" active={deleteBookedActive} setActive={setDeleteBookedActive} style={{height: "auto", left: "45%", top: "45%"}}>
                                        <Submit question={"Вы действительно хотите отменить бронь?"} activate={handleDeleteBooked} cancel={() => setDeleteBookedActive(false)}/>
                                    </Modal>
                                </>
                            }
                            {admin ?
                                <>
                                    <button className="WriteOffButton" onClick={() => setWriteOffBookActive(true)}>Списать</button>
                                    <Modal id="modalSubmitWriteOff" active={writeOffBookActive} setActive={setWriteOffBookActive} style={{height: "auto", left: "45%", top: "50%"}}>
                                        <Submit question={"Списать книгу? Это действие невозможно отменить!"} activate={handleWriteOff} cancel={() => setWriteOffBookActive(false)}/>
                                    </Modal>
                                </>
                                : null
                            }
                        </div>
                    </div>
                    <div className="BookPageContent">
                        <h2>{book.name}</h2>
                        <h4>{book.author}</h4>
                        <h6>{book.tags.join(" ")}</h6>
                        <p >{book.description}</p>
                    </div>
                </>
                :
                <h1>Книга не найдена</h1>
            }
        </div>
    )
}

export default BookPage