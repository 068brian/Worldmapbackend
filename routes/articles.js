const express = require('express');
const { getArticles, addArticle, updateArticle, deleteArticle } = require('../controllers/articlesController');

const router = express.Router();

// Route to fetch all articles with optional sorting, ordering, and limiting
router.get('/', getArticles);

// Route to add a new article
router.post('/', addArticle);

// Route to update an existing article by ID
router.put('/:id', updateArticle);

// Route to delete an article by ID
router.delete('/:id', deleteArticle);

module.exports = router;
