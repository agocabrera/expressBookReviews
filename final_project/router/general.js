const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if user is already registered
const doesExist = username => {
    let usersWithSameName = users.filter(user => user.username === username);
    return usersWithSameName.length > 0;
}

// Register new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login." });
        } else {
            return res.status(404).json({ message: "User already exists." });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const getBooks = new Promise(function (resolve, reject) {
        res.status(200).json(books);
        resolve("Task 10 OK.");
    });

    getBooks
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const getBooksByIsbn = new Promise(function (resolve, reject) {
        if (!book) {
            res.status(404).json({ message: "No books with provided ISBN found." });
            reject("Task 11 error.");
        }
        res.status(200).json(book);
        resolve("Task 11 OK.");
    });

    getBooksByIsbn
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    for (const isbn in books) {
        if (books[isbn].author === author) {
            res.send(JSON.stringify(books[isbn], null, 4));
            return;
        }
    }
    return res.status(404).json({ message: "No books by this author found." });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    for (const isbn in books) {
        if (books[isbn].title === title) {
            res.send(JSON.stringify(books[isbn], null, 4));
            return;
        }
    }
    return res.status(404).json({ message: "No books with provided title found." });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) return res.status(404).json({ message: "No books with provided ISBN found." });

    res.send(book.reviews);
});

module.exports.general = public_users;