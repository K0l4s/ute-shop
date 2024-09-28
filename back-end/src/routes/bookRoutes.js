import express from 'express';
import { searchBooksByTitleController } from '../controllers/bookController.js';
const router = express.Router();
// Route tìm kiếm sách theo tên
router.get('/search', searchBooksByTitleController);
export default router;