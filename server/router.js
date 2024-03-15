const Router = require('express')
const router = new Router()
const Controller = require('./controller')

router.get('/book', Controller.getAllBooks)
router.get('/book/:id', Controller.getBook)
router.get('/booked/:userId', Controller.getBooked)
router.post('/book', Controller.addBook)
router.post('/login', Controller.loginUser)
router.post('/register', Controller.addUser)
router.post('/booked', Controller.addBooked)
router.delete('/book', Controller.deleteBook)
router.delete('/booked', Controller.deleteBooked)

module.exports = router