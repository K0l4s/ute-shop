const {createGenreController,
    getGenresController,
    addGenreToBookController,
    removeGenreFromBookController,
    updateGenresController,} = require('../controllers/genreController');

const router = require('express').Router();

router.post('/create', async (req, res) => {
    const { name, listBookId } = req.body;
    try {
        const result = await createGenreController({ name, listBookId });
        return res.status(200).json({
            message: result.message,
            genre: result.genre,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});


router.get('/get', async (req, res) => {
    try {
        const result = await getGenresController();
        return res.status(200).json({ genres: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.post('/add', async (req, res) => {
    const { bookId, genreId } = req.body;
    try {
        const result = await addGenreToBookController({ bookId, genreId });
        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.post('/remove', async (req, res) => {
    const { bookId, genreId } = req.body;
    try {
        const result = await removeGenreFromBookController({ bookId, genreId });
        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.put('/update', async (req, res) => {
    const { id, name } = req.body;
    try {
        const result = await updateGenresController({ id, name });
        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;
