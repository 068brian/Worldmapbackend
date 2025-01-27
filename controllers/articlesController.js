const Article = require('../models/Article');

// Get all articles or fetch with sorting, ordering, and limiting
exports.getArticles = async (req, res) => {
  try {
    const { _sort = 'createdAt', _order = 'desc', _limit } = req.query;

    // Parse sorting and order
    const sortField = _sort;
    const sortOrder = _order === 'desc' ? -1 : 1;
    const limit = _limit ? parseInt(_limit, 10) : undefined;

    // Fetch articles with sorting and limiting
    const articles = await Article.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit);

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new article
exports.addArticle = async (req, res) => {
  try {
    const { title, image, content } = req.body;
    const newArticle = new Article({ title, image, content });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an article
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedArticle = await Article.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an article
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await Article.findByIdAndDelete(id);
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
