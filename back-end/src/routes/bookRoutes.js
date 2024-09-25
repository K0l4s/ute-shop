import express from 'express';
import { searchBooksByTitle } from '../controllers/bookController.js';

const router = express.Router();

// Route tìm kiếm sách theo tên
router.get('/search', searchBooksByTitle);

export default router;
