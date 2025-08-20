const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let validUser = users.filter((user) => {
        return user.username === username;
    })

    if(validUser.length > 0){
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    if (!username && !password){
        return false;
    }

    let authenticatedUsers = users.filter((user) => {
        return user.username === username && user.password === password
    });

    if(authenticatedUsers.length > 0){
        return true;
    }

    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data: password
    }, "access", {expiresIn: 60*60});

    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).json({message: "User successfully logged in"});
  }

  return res.status(200).json({message: "User failed to login: Please enter correct username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const user = req.session.authorization.username;

  let myPromise = new Promise((resolve, reject) => {
    if(books[isbn]){
        if(books[isbn].reviews[user]){
            books[isbn].reviews[user] = review;
            resolve("Updated review to the book with ISBN " + isbn);
        };

        books[isbn].reviews[user] = review;
        resolve("Added review to the book with ISBN " + isbn);
    }else {
        reject("Could not find a book with the isbn " + isbn);
    }
  });

  myPromise.then((successMessage) => {
    return res.status(300).json({message: successMessage});
  }, (failMessage) => {
    return res.status(300).json({message: failMessage});
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;

  let myPromise = new Promise((resolve, reject) => {
    if(books[isbn]){
        if(books[isbn].reviews[user]){
            delete books[isbn].reviews[user]
            resolve("Removed review to the book with ISBN " + isbn);
        }else {
            reject("You have not left a review for the book with ISBN " + isbn);
        }
     }else {
        reject("Could not find a book with the isbn " + isbn);
    }
  });

  myPromise.then((successMessage) => {
    return res.status(300).json({message: successMessage});
  }, (failMessage) => {
    return res.status(300).json({message: failMessage});
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
