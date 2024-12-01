const { createGenre,
    getGenres,
    addGenreToBook,
    removeGenreFromBook,
    updateGenres } = require('../services/genreService.js');

    const createGenreController = async ({ name, listBookId }) => {
        return await createGenre({
            name: name,
            listBookId: listBookId,
        });
    };
    

const getGenresController = async () => {
    return await getGenres();
}

const addGenreToBookController = async ({ bookId, genreId }) => {
    return await addGenreToBook({
        bookId: bookId,
        genreId: genreId,
    });
};

const removeGenreFromBookController = async ({ bookId, genreId }) => {
    return await removeGenreFromBook({
        bookId: bookId,
        genreId: genreId,
    });
};

const updateGenresController = async ({ id, name }) => {
    return await updateGenres({
        id: id,
        name: name,
    });
}

module.exports = {
    createGenreController,
    getGenresController,
    addGenreToBookController,
    removeGenreFromBookController,
    updateGenresController,
};
