const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "Donald", password: "123" },
  { username: "Joe", password: "123" }
];

const isValid = (username) => { //returns boolean
  //write code to check if the username is valid
}

// Check if username and password match the one we have in records
const authenticatedUser = (username, password) => {
  let validusers = users.filter(user => user.username === username && user.password === password);
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in." });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in.");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const user = req.session.authorization.username;

  if (!books[isbn]) return res.send("Invalid ISBN.");

  if (!review) return res.send("Review body empty.");

  books[isbn].reviews[user] = review;

  return res.status(200).json({
    message: "Review submission successful.",
    reviews: books[isbn].reviews
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;

  if (!books[isbn]) return res.send("Invalid ISBN.");

  delete books[isbn].reviews[user];

  return res.status(200).json({
    message: "Review successfully deleted.",
    reviews: books[isbn].reviews
  });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
