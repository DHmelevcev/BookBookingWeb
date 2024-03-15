import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./NewBookForm.css";
import GridBook from "../GridBook/GridBook";

const NewBookForm = ({ books, setBooks }) => {
    const [bookName, setBookName] = useState("")
    const [author, setAuthor] = useState("")
    const [tags, setTags] = useState("")
    const [description, setDescription] = useState("")
    const [imgLink, setImgLink] = useState("")

    const [errMsg, setErrMsg] = useState('');
    useEffect(() => {
        setErrMsg('');
    }, [bookName, author, tags, description, imgLink])
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('/book',
                JSON.stringify({ name: bookName, author: author, tags: tags.split(" "), description: description, img: imgLink }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            setBookName("")
            setAuthor("")
            setTags("")
            setDescription("")
            setImgLink("")

            setBooks([...books, <GridBook key={response.data.id} img={imgLink} name={bookName} id={response.data.id}/>])
        }
        catch (err) {
            if (!err?.response) {
                setErrMsg("Сервер не отвечает. Попробуйте позже.");
            } else if (err.response?.status === 406) {
                setErrMsg("Такая книга уже есть!");
            } else {
                setErrMsg("Ошибка добавления")
            }
        }
    }

    return (
        <form className="NewBookForm" onSubmit={handleSubmit}>
            <h2>Добавление новой книги</h2>
            <div className="InputBox">
                <input id="1" value={bookName}
                       onChange={(e) => setBookName(e.target.value)}
                       type="text"
                       autoFocus
                       placeholder="Название" required/>
            </div>
            <div className="InputBox">
                <input id="2" value={author}
                       onChange={(e) => setAuthor(e.target.value)}
                       type="text"
                       placeholder="Автор" required/>
            </div>
            <div className="InputBox">
                <input id="3" value={tags}
                       onChange={(e) => setTags(e.target.value)}
                       type="text"
                       placeholder="Теги (через пробел)" required/>
            </div>
            <div className="GrowingInputBox">
                <textarea id="4" value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Описание"
                          rows="1"
                          style={{
                              gridArea: '1 / 1 / 2 / 2'
                          }}
                          required/>
                <span style={{
                    gridArea: '1 / 1 / 2 / 2',
                    visibility: 'hidden',
                    whiteSpace: 'pre-wrap',
                }}>
                    {description}{' '}
                </span>
            </div>
            <div className="InputBox">
                <input id="5" value={imgLink}
                       onChange={(e) => setImgLink(e.target.value)}
                       type="text"
                       placeholder="Ссылка на фотографию" required/>
            </div>
            <div className={errMsg ? "ErrMsg" : "Offscreen"}>
                {errMsg}
            </div>
            {!errMsg ?
                <button type="submit">Добавить</button>
                : null
            }
        </form>
    )
}

export default NewBookForm