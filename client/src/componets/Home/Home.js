import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./Home.css";
import Modal from "../Modal/Modal"
import LoginForm from "../LoginForm/LoginForm"
import Booked from "../Booked/Booked"
import GridBook from "../GridBook/GridBook"
import BookPage from "../BookPage/BookPage"
import BookedItem from "../BookedItem/BookedItem";
import NewBookForm from "../NewBookForm/NewBookForm";
import Submit from "../Submit/Submit";
import OpenedBookIcon from "../../read-book-icon.svg";
import UserIcon from "../../usericon.svg";
import SearchIcon from "../../search-2907.svg";

const Home = ({ login, bookOpen, userId, setUserId, userName, setUserName, password, setPassword, admin, setAdmin }) => {
    const navigate = useNavigate()

    //modals
    const [loginActive, setLoginActive] = useState(login)
    const [bookedActive, setBookedActive] = useState(false)
    const [newBookActive, setNewBookActive] = useState(false)
    const [submitExitActive, setSubmitExitActive] = useState(false)

    //search
    const [searchString, setSearchString] = useState("")
    const [catalogHeader, setCatalogHeader] = useState("Все книги")

    //catalog
    const [books, setBooks] = useState([])

    //booked
    const [booked, setBooked] = useState([])

    const handleSearch = async (e) => {
        e?.preventDefault()

        if (bookOpen) {
            navigate("/")
        }

        setCatalogHeader("Результаты поиска:")

        if (!searchString) {
            await resetFilters()
            return
        }

        let words = searchString.split(/\s+/)
        words = words.filter(word => { return word !== '' })
        if (!words.length) {
            await resetFilters()
            return
        }

        try {
            const dbBooks = (await axios.get('/book',
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            )).data

            let filter1 = dbBooks.filter(book => {
                const lcName = book.name.toLowerCase()
                for (const word of words) {
                    const lcWord = word.toLowerCase()
                    if (lcName.includes(lcWord)) {
                        return true
                    }
                }
                return false
            })

            let filter2 = dbBooks.filter(book => {
                const lcAuthor = book.author.toLowerCase()
                for (const word of words) {
                    const lcWord = word.toLowerCase()
                    if (lcAuthor.includes(lcWord)) {
                        return true
                    }
                }
                return false
            })

            let filter3 = dbBooks.filter(book => {
                for (const word of words) {
                    const lcWord = word.toLowerCase()
                    for (const tag of book.tags) {
                        const lcTag = tag.toLowerCase()
                        if (lcTag.includes(lcWord)) {
                            return true
                        }
                    }
                }
                return false
            })

            let filter4 = dbBooks.filter(book => {
                const pattern = ".,!?()"
                const lcDescription = book.description.toLowerCase().replace(new RegExp(pattern, "g"), '')
                for (const word of words) {
                    const lcWord = word.toLowerCase()
                    if (lcDescription.includes(lcWord)) {
                        return true
                    }
                }
                return false
            })

            setBooks(Array.from([...filter1, ...filter2, ...filter3, ...filter4]
                .reduce((m, o) => m.set(o.id, o), new Map)
                .values()).map(item => {
                return ( <GridBook key={item.id} img={item.img} name={item.name} id={item.id}/> )
            }))
        }
        catch (err) {
            if (!err?.response) {
                setCatalogHeader("Сервер не отвечает. Попробуйте позже.")
            }
        }
    }

    const resetFilters = async () => {
        setCatalogHeader("Все книги")

        try {
            const response = await axios.get('/book',
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            setBooks(response.data.map(item => {
                return ( <GridBook key={item.id} img={item.img} name={item.name} id={item.id}/> )
            }))
        }
        catch (err) {
            if (!err?.response) {
                setCatalogHeader("Сервер не отвечает. Попробуйте позже.")
            }
        }
    }

    useEffect(() => {
        if (!bookOpen) {
            handleSearch()
        }
    }, [searchString])

    useEffect(() => {
        const handleBookedChanged = async () => {
            const bookedByUser = await axios.get('/booked/' + userId,
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                })

            const result = []
            for (const item of bookedByUser.data) {
                const book = await axios.get('/book/' + item.bookId,
                    {
                        headers: {'Content-Type': 'application/json'},
                        withCredentials: true
                    })

                const date = new Date(item.date)
                result.push(<BookedItem key={item.id}
                                        date={`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}
                                        bookId={item.bookId}
                                        bookImg={book.data.img}
                                        bookName={book.data.name}
                />)
            }

            setBooked(result)
        }

        if (userId) handleBookedChanged()
    }, [userId])

    return (
        <div className="Home">
            <header className="Header">
                <div className="NavBar">
                    <Link to="/" className="Logo" onClick={resetFilters}>
                        <h2>Каталог</h2>
                    </Link>
                    <form className="SearchBar" onSubmit={handleSearch}>
                        <input id="inputSearchBar"
                               value={searchString}
                               type="search"
                               placeholder="Найти книгу"
                               onChange={(e) => setSearchString(e.target.value)}/>
                        <button type="submit">
                            <img src={SearchIcon} alt=""/>
                        </button>
                    </form>
                    <div className="Options">
                        {!userId ?
                            <div className="TopButton" onClick={() => setLoginActive(true)}>
                                <img src={UserIcon} alt=""/>
                                <h6>Войти</h6>
                            </div>
                            :
                            <>
                                <div className="TopButton" onClick={() => {
                                    setSubmitExitActive(true)
                                }}>
                                    <div className="OptionsOffset">
                                        {userName}
                                    </div>
                                    <img src={UserIcon} alt=""/>
                                    <h6>Выйти</h6>
                                </div>
                                <div className="TopButton"  onClick={() => setBookedActive(true)}>
                                    <img src={OpenedBookIcon} alt=""/>
                                    <h6>Бронь</h6>
                                </div>
                            </>
                        }
                        {admin ?
                            <div className="TopButton" onClick={() => setNewBookActive(true)}>
                                <img src={OpenedBookIcon} alt=""/>
                                <h6>Добавить</h6>
                            </div>
                            : null
                        }
                    </div>
                </div>
            </header>
            <dev className="HomeContainer">
                <div className="Menu">
                    <div className="Category" onClick={async () => {
                        setSearchString("Приключение")
                        await handleSearch()
                    }}>
                        <img alt=""/>
                        <p>Приключение</p>
                    </div>
                    <div className="Category" onClick={async () => {
                        setSearchString("Детектив")
                        await handleSearch()
                    }}>
                        <img alt=""/>
                        <p>Детектив</p>
                    </div>
                    <div className="Category" onClick={async () => {
                        setSearchString("Юмор")
                        await handleSearch()
                    }}>
                        <img alt=""/>
                        <p>Юмор</p>
                    </div>
                </div>
                {bookOpen ?
                    <BookPage userId={userId} admin={admin} setLoginActive={setLoginActive}
                              booked={booked} setBooked={setBooked} setBookedActive={setBookedActive}
                              handleSearch={handleSearch}
                    />
                    :
                    <div className="Catalog">
                        <div className="GridHeader">
                            <h1>{catalogHeader}</h1>
                        </div>
                        <div className="BookGrid">
                            {books.length ?
                                [books]
                                :
                                <h2 style={{paddingLeft: "10px"}}>Ничего не найдено</h2>
                            }
                        </div>
                    </div>
                }
            </dev>
            <footer className="Footer">
                <p>Наши контакты: такие то такие</p>
            </footer>
            {!userId ?
                <Modal id="modalLogin" active={loginActive} setActive={setLoginActive} style={{top: "11vh", right: "11vw", height: "auto"}}>
                    <LoginForm bookOpen={bookOpen} setLoginActive={setLoginActive} setUserId={setUserId} setUserName={setUserName} setPassword={setPassword} setAdmin={setAdmin} />
                </Modal>
                :
                <>
                    <Modal id="modalBooked" active={bookedActive} setActive={setBookedActive} style={{top: "11vh", width: "600px", height: "auto", maxHeight: "79vh"}}>
                        <Booked booked={booked}/>
                    </Modal>
                    <Modal id="modalSubmitExit" active={submitExitActive} setActive={setSubmitExitActive} style={{top: "11vh", right: "11vw", height: "auto"}}>
                        <Submit question={"Вы уверены, что хотите выйти?"}
                                activate={() => {
                                    setAdmin(false)
                                    setPassword("")
                                    setUserName("")
                                    setUserId("")
                                    setBooked([])
                                    setSubmitExitActive(false)
                                }}
                                cancel={() => setSubmitExitActive(false)}/>
                    </Modal>
                </>
            }
            {admin ?
                <Modal id="modalAdd" active={newBookActive} setActive={setNewBookActive} style={{top: "1vh", width: "600px", height: "auto", maxHeight: "96vh"}}>
                    <NewBookForm books={books} setBooks={setBooks}/>
                </Modal>
                : null
            }
        </div>
    )
}

export default Home