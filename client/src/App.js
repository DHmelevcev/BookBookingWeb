import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "./api/axios";
import Home from "./componets/Home/Home";
import Register from "./componets/Register/Register"
import "./Montserrat-Regular.ttf";

const App = () => {
    const [userId, setUserId] = useState("")
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [admin, setAdmin] = useState(false)

    useEffect(() => {
        const name = sessionStorage.getItem("userName")
        setUserName(name !== "null" ? name : "")
        const pwd = sessionStorage.getItem("password")
        setPassword(pwd !== "null" ? pwd : "")
    }, []);

    useEffect(() => {
        const login = async () => {
            if (userName || password)
                try {
                    const response = await axios.post('/login',
                        JSON.stringify({ user: userName, pwd: password }),
                        {
                            headers: { 'Content-Type': 'application/json' },
                            withCredentials: true
                        }
                    );

                    setUserId(response.data.id)
                    setAdmin(response.data.isAdmin)
                }
                catch (err) {
                    setUserName("")
                    setPassword("")
                }
        }

        login()
    }, [userName && password]);

    useEffect(() => {
        sessionStorage.setItem("userName", userName)
        sessionStorage.setItem("password", password)
    }, [userId]);

    return(
        <Routes>
            <Route path="/register" element={<Register/>}/>
            <Route path="/" element={<Home login={false} bookOpen={false}
                                           userId={userId} setUserId={setUserId}
                                           userName={userName} setUserName={setUserName}
                                           password={password} setPassword={setPassword}
                                           admin={admin} setAdmin={setAdmin}/>}/>
            <Route path="/login" element={<Home login={true} bookOpen={false}
                                                userId={userId} setUserId={setUserId}
                                                userName={userName} setUserName={setUserName}
                                                password={password} setPassword={setPassword}
                                                admin={admin} setAdmin={setAdmin}/>}/>
            <Route path="/book/:id" element={<Home login={false} bookOpen={true}
                                                   userId={userId} setUserId={setUserId}
                                                   userName={userName} setUserName={setUserName}
                                                   password={password} setPassword={setPassword}
                                                   admin={admin} setAdmin={setAdmin}/>}/>
            <Route path="*" element={<Home login={false} bookOpen={false}
                                           userId={userId} setUserId={setUserId}
                                           userName={userName} setUserName={setUserName}
                                           password={password} setPassword={setPassword}
                                           admin={admin} setAdmin={setAdmin}/>}/>
        </Routes>
    )
}

export default App