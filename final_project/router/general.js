const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username && !password){
    return res.status(300).json({message: "User registration failed: Please provide valid credentials"});
  }

  if(isValid(username)) {
    users.push(req.body);
    return res.status(300).json({message: "User registered successfully"});
  }

  return res.status(300).json({message: "User registration failed: User with name " + username + " already exists"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4));
  });

  myPromise.then((successMessage) => {
    return res.status(300).send(successMessage);
  }, (failMessage) => {
    return res.status(300).json({message: "Failed to retrieve list of books"});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  let myPromise = new Promise((resolve, reject) => {
    if(books[isbn]){
        resolve(books[isbn]);
    }else {
        reject("Could not find a book with the isbn " + isbn);
    }
  });

  myPromise.then((successMessage) => {
    return res.status(300).send(successMessage);
  }, (failMessage) => {
    return res.status(300).json({message: failMessage});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    let myPromise = new Promise((resolve, reject) => {
        const keys = Object.keys(books);

        let authorBooks = {};

        keys.forEach((key) => {
            if(books[key].author === author){
                authorBooks[key] = books[key];
            }
        })

        if(Object.keys(authorBooks).length > 0){
            resolve(JSON.stringify(authorBooks, null, 4));
        }else {
            reject("Could not find books from the author " + author);
        }
      });
    
      myPromise.then((successMessage) => {
        return res.status(300).send(successMessage);
      }, (failMessage) => {
        return res.status(300).json({message: failMessage});
      });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    let myPromise = new Promise((resolve, reject) => {
        const keys = Object.keys(books);

        let titleBooks = {};

        keys.forEach((key) => {
            if(books[key].title === title){
                titleBooks[key] = books[key];
            }
        })

        if(Object.keys(titleBooks).length > 0){
            resolve(JSON.stringify(titleBooks, null, 4));
        }else {
            reject("Could not find books with the title " + title);
        }
      });
    
      myPromise.then((successMessage) => {
        return res.status(300).send(successMessage);
      }, (failMessage) => {
        return res.status(300).json({message: failMessage});
      });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    let myPromise = new Promise((resolve, reject) => {
      if(books[isbn]){
          resolve(JSON.stringify(books[isbn].reviews));
      }else {
          reject("Could not find a book with the isbn " + isbn);
      }
    });
  
    myPromise.then((successMessage) => {
      return res.status(300).send(successMessage);
    }, (failMessage) => {
      return res.status(300).json({message: failMessage});
    });
});

module.exports.general = public_users;
