var express = require('express');
var router = express.Router();
const Book = require('../models').Book;


// Handler function to wrap each route. 
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      
      next(error);
    }
  }
}

// Redirects to home page
router.get('/', (req, res) => {
  res.redirect('/books'); 
});

// Keeps track of the book index and shows all the books in the library
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll({order: [["createdAt", "DESC"]]});
  res.render('index', { books, title: 'Books' });
}));

// Accesses new book form
router.get('/books/new', asyncHandler(async (req, res) => {

  res.render('new-book', { title: 'New Book' });
}));

// Allows the user to create a new book with a required title and author and optional genre and year
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/'); 
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      console.log(`SequelizeValidationError caught`)
      
      book = await Book.build(req.body);
      console.log(book)
      res.render('new-book', { book, errors: error.errors });
    } else {
      throw error; 
    }
  }
}));

// Allows the user to update the book form and gives error messages when needed
router.get('/books/:id', asyncHandler(async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id)
    if (book) {
      res.render('update-book', { book, title: book.title });
    }else {
      console.log(`no book found with id: ${req.params.id}`)
      res.render('page-not-found')
    }

  } catch (error) {
    console.log(`unhandled error`)
    console.log(error)
    throw error;
  }


}));

// Actually updates Book
router.post('/books/:id', asyncHandler(async (req, res) => {
  console.log(`entered post route for book id: ${req.params.id}`)
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/'); 
    } else {
      console.log(`no book found with id: ${req.params.id}`)
      res.render('page-not-found')
    }
  } catch (error) {
    console.log(error)
    if (error.name === 'SequelizeValidationError') {
      console.log(`SequelizeValidationError caught`)
      

     
      book = await Book.build(req.body);
      book.id = req.params.id; 
      res.render(`update-book`, { book, errors: error.errors });
    } else {
      console.log(`unhandled error`)
      console.log(error)
      throw error; 
    }
  }
}));

// Allows the user to delete any book
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/'); 
    } else {
      res.render('error', { error: "Book not found" }); 
    }
  } catch (error) {
    res.render('error', { error }); 
  }
}));



// JSON Route that is used to debugging!
router.get('/all', asyncHandler(async (req, res) => {
  const books = await Book.findAll({order: [["createdAt", "DESC"]]});
  res.json(books);
}));

module.exports = router;
