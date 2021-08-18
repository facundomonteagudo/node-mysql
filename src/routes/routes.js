/* eslint-disable camelcase */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
const express = require('express');
const connection = require('../db/connect');

const router = express.Router();

const mappedBooks = (result) =>
  result.map((book) => ({
    id: book.id,
    name: book.name,
    isbn: book.isbn,
    author: {
      id: book.id_author,
      name: book.author_name,
      country: book.country
    }
  }));

router.get('/books', (_, res) => {
  connection.query(
    `SELECT b.id, b.name, b.isbn, a.id as 'id_author', a.name as 'author_name', a.country FROM books as b INNER JOIN authors as a ON b.id_author = a.id;`,
    (error, result) => {
      if (error) {
        res.status(500).json({ message: 'Error reading the database' });
      }
      if (!result.length) {
        res.status(200).json({ message: 'The book table is empty!' });
      }

      const books = mappedBooks(result);

      res.status(200).json({ data: books });
    }
  );
});

router.get('/books/:id', (req, res) => {
  connection.query(
    `SELECT b.id, b.name, b.isbn, a.id as 'id_author', a.name as 'author_name', a.country FROM books as b INNER JOIN authors as a ON b.id_author = a.id WHERE b.id = ?;`,
    [req.params.id],
    (error, result) => {
      if (error) {
        res.status(500).json({ message: 'Error reading the database' });
      }

      if (!result.length) {
        res.status(200).json({
          message: `the ID[${req.params.id}] does not exist in the table`
        });
      }

      const book = mappedBooks(result);

      res.status(200).json({ book });
    }
  );
});

router.post('/books', (req, res) => {
  const { name, isbn, idAuthor } = req.body;

  if (!name || !isbn || !idAuthor) {
    res.status(400).json({
      message: 'verify that the submitted fields are name, isbn and idAuthor'
    });
  }

  connection.query(
    'INSERT INTO books (name, isbn, id_author) VALUES (?, ?, ?)',
    [name, isbn, idAuthor],
    (error) => {
      if (error) {
        res.status(500).json({
          message:
            'Error adding the book to the database, check the submitted fields'
        });
      }

      res.status(201).json({ message: 'Book added successfully!' });
    }
  );
});

router.put('/books/:id', (req, res) => {
  const { name, isbn, idAuthor } = req.body;

  if (!name || !isbn || !idAuthor) {
    res.status(400).json({
      message: 'verify that the submitted fields are name, isbn and idAuthor'
    });
  }

  connection.query(
    'UPDATE books SET name = ?, isbn = ?, id_author = ? WHERE id = ?',
    [name, isbn, idAuthor, req.params.id],
    (error, result) => {
      if (error) {
        switch (error.code) {
          case 'ER_DUP_ENTRY':
            res.status(500).json({ message: 'Duplicate isbn' });
            break;
          case 'ER_NO_REFERENCED_ROW_2':
            res.status(500).json({ message: 'The author was not found' });
            break;
          default:
            res.status(500).json({ message: 'Database internal Error' });
        }
      }

      if (!result.affectedRows) {
        res.status(404).json({ message: 'The book was not found' });
      }

      res.status(200).json({ message: 'the book was successfully modified' });
    }
  );
});

router.delete('/books/:id', (req, res) => {
  connection.query(
    'DELETE FROM books WHERE ID = ?',
    req.params.id,
    (error, result) => {
      if (error) {
        res.status(500).json({ message: 'Database error' });
      }

      if (!result.affectedRows) {
        res
          .status(204)
          .json({ message: `there is no book with id [${req.params.id}]` });
      }

      res.status(200).json({ message: 'book successfully removed' });
    }
  );
});

module.exports = router;
