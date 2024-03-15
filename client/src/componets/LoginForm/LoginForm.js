import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./LoginForm.css";

const LoginForm = ({ bookOpen, setLoginActive, setUserId, setUserName, setPassword, setAdmin }) => {
    const navigate = useNavigate()

    const [userNameLogin, setUserNameLogin] = useState("")
    const [passwordLogin, setPasswordLogin] = useState("")

    const [errMsg, setErrMsg] = useState('');
    useEffect(() => {
        setErrMsg('');
    }, [userNameLogin, passwordLogin])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('/login',
                JSON.stringify({ user: userNameLogin, pwd: passwordLogin }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            setUserNameLogin("")
            setPasswordLogin("")

            setLoginActive(false)
            setUserId(response.data.id)
            setUserName(userNameLogin)
            setPassword(passwordLogin)
            setAdmin(response.data.isAdmin)

            if (!bookOpen)
                navigate("/")
        }
        catch (err) {
            if (!err?.response) {
                setErrMsg("Сервер не отвечает. Попробуйте позже.");
            } else if (err.response?.status === 406) {
                setErrMsg("Неверные имя пользователя или пароль");
            } else {
                setErrMsg("Ошибка входа")
            }
        }
    }

    return (
        <form className="LoginForm" onSubmit={handleSubmit}>
            <h2>Войти</h2>
            <div className="InputBox">
                <input id="inputLoginUN" value={userNameLogin}
                       onChange={(e) => setUserNameLogin(e.target.value)}
                       type="text"
                       autoFocus
                       placeholder="Имя пользователя" required/>
            </div>
            <div className="InputBox">
                <input id="inputLoginPS" value={passwordLogin}
                       onChange={(e) => setPasswordLogin(e.target.value)}
                       type="password"
                       placeholder="Пароль" required/>
            </div>
            <div className={errMsg ? "ErrMsg" : "Offscreen"}>
                {errMsg}
            </div>
            <button type="submit">Войти</button>
            <p>Нет аккаунта? <b><Link to="/register">Регистрация</Link></b></p>
        </form>
    )
}

export default LoginForm