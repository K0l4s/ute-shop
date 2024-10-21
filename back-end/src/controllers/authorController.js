const {createAuthor, getAuthorById,getAuthors,updateAuthor} = require('../services/authorService.js');

const createAuthorController = async (req, res) => {
    try {
        const response = await createAuthor(req.body);
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getAuthorsController = async (req, res) => {
    try {
        const authors = await getAuthors();
        res.status(200).json(authors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getAuthorByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const author = await getAuthorById(id);
        res.status(200).json(author);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateAuthorController = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await updateAuthor(id, req.body);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createAuthorController,
    getAuthorsController,
    getAuthorByIdController,
    updateAuthorController
}