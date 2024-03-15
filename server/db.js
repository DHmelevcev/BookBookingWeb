const Datastore = require("nedb");

const usersDb = new Datastore('usersDb.db');
usersDb.loadDatabase();
const booksDb = new Datastore('booksDb.db');
booksDb.loadDatabase();
const bookedDb = new Datastore('bookedDb.db');
bookedDb.loadDatabase();

module.exports = { users: usersDb, books: booksDb, booked: bookedDb }