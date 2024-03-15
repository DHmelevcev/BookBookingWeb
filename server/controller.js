const db = require('./db')

class Controller {
    async getAllBooks(req, res) {
        await db.books.find({}).sort({name: 1}).exec((err, data)=> {
            if (err) {
                res.status(503).json();
                return;
            }

            res.status(200).json(data.map(item => {
                return {id: item._id, name: item.name, author: item.author, tags: item.tags, description: item.description, img: item.img}
            }))
        })
    }

    async getBook(req, res) {
        const reqData = {...req.params}

        await db.books.findOne({
            _id: reqData.id
        }, (err, data)=> {
            if (err) {
                res.status(503).json();
                return;
            }
            if (data) {
                res.status(200).json({
                    id: data._id, name: data.name, author: data.author, tags: data.tags, description: data.description, img: data.img
                });
            }
            else {
                res.status(404).json() //not found
            }
        })
    }

    async getBooked(req, res) {
        const reqData = {...req.params}

        await db.booked.find({
            userId: reqData.userId
        }, (err, data)=> {
            if (err) {
                res.status(503).json();
                return;
            }
            res.status(200).json(data.map(item => {
                return {id: item._id, bookId: item.bookId, userId: item.userId, date: item.date}
            }))
        })
    }

    async loginUser(req, res) {
        const reqData = {...req.body}

        await db.users.findOne({
            user: reqData.user, pwd: reqData.pwd
        }, (err, data)=> {
            if (err) {
                res.status(503).json();
                return;
            }
            if (data) {
                res.status(200).json({id: data._id, isAdmin: data.isAdmin});
            }
            else {
                res.status(406).json() //user not found or wrong pwd
            }
        })
    }

    async addUser(req, res) {
        const reqData = {...req.body}

        await db.users.findOne({
            email: reqData.email
        }, async (err, data) => {
            if (err) {
                res.status(503).json();
                return
            }
            if (data) {
                res.status(406).json(); //same email
                return
            }

            await db.users.findOne({
                user: reqData.user
            }, async (err, data) => {
                if (err) {
                    res.status(503).json();
                    return
                }
                if (data) {
                    res.status(409).json(); //same name
                    return
                }

                await db.users.insert({...reqData, isAdmin: false}, (err) => {
                    if (err) {
                        res.status(503).json();
                        return
                    }
                    res.status(200).json()
                })
            })
        })
    }

    async addBook(req, res) {
        const reqData = {...req.body}

        await db.books.findOne({
            name: reqData.name, author: reqData.author
        }, async (err, data) => {
            if (err) {
                res.status(503).json();
                return;
            }
            if (data) {
                res.status(406).json(); //same book
                return
            }

            await db.books.insert({
                name: reqData.name, author: reqData.author, tags: [...reqData.tags], description: reqData.description, img: reqData.img
            }, (err, data)=> {
                if (err) {
                    res.status(503).json();
                    return;
                }
                if (data) {
                    res.status(200).json({id: data._id});
                }
            })
        })
    }

    async addBooked(req, res) {
        const reqData = {...req.body}

        await db.booked.findOne({
            bookId: reqData.bookId, userId: reqData.userId
        }, async (err, data) => {
            if (err) {
                res.status(503).json();
                return;
            }
            if (data) {
                res.status(406).json(); //already booked
                return
            }

            const date = new Date();
            date.setDate(date.getDate() + 28)

            await db.booked.insert({
                bookId: reqData.bookId, userId: reqData.userId, date: date.toJSON()
            }, (err, data)=> {
                if (err) {
                    res.status(503).json();
                    return;
                }
                if (data) {
                    res.status(200).json({id: data._id, bookId: data.bookId, userId: data.userId, date: data.date});
                }
            })
        })
    }

    async deleteBook(req, res) {
        const reqData = {...req.body}

        await db.books.remove({
            _id: reqData.id
        }, (err, numRemoved)=> {
            if (err) {
                res.status(503).json();
                return;
            }
            if (numRemoved === 0) {
                res.status(406).json(); //it wasn't there
                return
            }
            res.status(200).json();
        })
    }

    async deleteBooked(req, res) {
        const reqData = {...req.body}

        if (reqData?.id) {
            await db.booked.remove({
                _id: reqData.id
            }, (err, numRemoved)=> {
                if (err) {
                    res.status(503).json();
                    return;
                }
                if (numRemoved === 0) {
                    res.status(406).json(); //it wasn't there
                    return
                }
                res.status(200).json();
            })
        } else if (reqData?.bookId) {
            await db.booked.remove({
                bookId: reqData.bookId
            }, (err, numRemoved)=> {
                if (err) {
                    res.status(503).json();
                    return;
                }
                res.status(200).json();
            })
        }
    }
}

module.exports = new Controller()