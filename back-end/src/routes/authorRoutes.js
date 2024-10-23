const {createAuthorController,getAuthorByIdController,getAuthorsController,updateAuthorController} = require('../controllers/authorController');
const express = require('express');

const router = express.Router();

router.post('/', createAuthorController);
router.get('/', getAuthorsController);
router.get('/:id', getAuthorByIdController);
router.put('/:id', updateAuthorController);

module.exports = router;
