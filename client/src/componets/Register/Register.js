import React, { useState, useEffect }  from "react";
import { Link } from "react-router-dom";
import axios from '../../api/axios';
import "./Register.css";
import InfoCircle from "../../info-circle.svg";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

const Register = () => {
    const [email, setEmail] = useState("")
    const [validEmail, setValidEmail] = useState(false);
    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    const [userName, setUserName] = useState("")
    const [validName, setValidName] = useState(false);
    useEffect(() => {
        setValidName(USER_REGEX.test(userName));
    }, [userName])

    const [password, setPassword] = useState("")
    const [validPassword, setValidPassword] = useState(false);
    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password])

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [email, userName, password])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const v1 = EMAIL_REGEX.test(email);
        const v2 = USER_REGEX.test(userName);
        const v3 = PWD_REGEX.test(password);
        if (!v1 || !v2 || !v3) {
            setErrMsg("Неверные данные");
            return;
        }
        try {
            await axios.post('/register',
                JSON.stringify({ email: email, user: userName, pwd: password}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            setSuccess(true);
            setEmail('');
            setUserName('');
            setPassword('');
        }
        catch (err) {
            if (!err?.response) {
                setErrMsg("Сервер не отвечает. Попробуйте позже.");
            } else if (err.response?.status === 406) {
                setErrMsg("Почта занята");
            } else if (err.response?.status === 409) {
                setErrMsg("Имя занято");
            } else {
                setErrMsg("Ошибка регистрации")
            }
        }
    }

    return (
        <div className="Register" onSubmit={handleSubmit}>
            {success ? (
                <h1>Регистрация прошла успешно!<br/><Link to="/login">Войти</Link></h1>
            ) : (
                <form className="RegisterForm">
                    <h2>Регистрация</h2>
                    <div className="InputBox">
                        <input id="inputRegisterML"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               type="email"
                               autoFocus
                               placeholder="Почта"
                               required/>
                    </div>
                    <div id="EmailNote" className={email && !validEmail ? "Instructions" : "Offscreen"}>
                        <img src={InfoCircle} alt=""/>
                        Пример: tom19@tmail.com
                    </div>
                    <div className="InputBox">
                        <input id="inputRegisterUN"
                               value={userName}
                               onChange={(e) => setUserName(e.target.value)}
                               type="text"
                               placeholder="Имя пользователя"
                               required/>
                    </div>
                    <div id="UserNameNote" className={userName && !validName ? "Instructions" : "Offscreen"}>
                        <img src={InfoCircle} alt=""/>
                        Имя начинается с буквы. Разрешены только латинские буквы, цифры, нижние подчёркивания и тире.
                    </div>
                    <div className="InputBox">
                        <input id="inputRegisterPS"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               type="password"
                               placeholder="Пароль"
                               required/>
                    </div>
                    <div id="PasswordNote" className={password && !validPassword ? "Instructions" : "Offscreen"}>
                        <img src={InfoCircle} alt=""/>
                        От 8 до 24 символов. Должны быть латинские буквы верхнего и нижнего регистра и цифры.
                    </div>
                    <div className={errMsg ? "ErrMsg" : "Offscreen"}>
                        {errMsg}
                    </div>
                    <button type="submit">Зарегистрироваться</button>
                    <p>Уже есть аккаунт? <b><Link to="/login">Войти</Link></b></p>
                </form>
            )}
        </div>
    )
}

export default Register