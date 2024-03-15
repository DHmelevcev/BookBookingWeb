const express = require('express')
const router = require('./router')

const app = express()
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
})
app.use(express.json());
app.use(router)

const PORT = 3500
app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`server is started on port ${PORT}`)
})