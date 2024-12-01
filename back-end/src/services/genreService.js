const db = require('../models');
const { Op } = require("sequelize");
const Genre = db.Genre;
const Book = db.Book;
const BookGenre = db.Book_Genre;

const createGenre = async ({ name, listBookId }) => {
    const genre = await Genre.create({
        name: name,
    });

    if (listBookId && listBookId.length > 0) {
        for (const bookId of listBookId) {
            await BookGenre.create({
                bookId: bookId,
                genreId: Genre.id,
            });
        }
    }

    return {
        message: "Thể loại đã được tạo thành công!",
        genre: genre,
    };
};


const getGenres = async () => {
    return await Genre.findAll({
        include: [
            {
                model: Book,
                as: 'books', // Alias đã được định nghĩa trong static associate()
                through: {
                    attributes: [], // Không lấy các cột từ bảng trung gian `Book_Genre`
                },
            },
        ],
    });
};



const addGenreToBook = async (
    { bookId, genreId }
) => {
    return await BookGenre.create({
        bookId: bookId,
        genreId: genreId,
    });
};

const removeGenreFromBook = async (
    { bookId, genreId }
) => {
    return await BookGenre.destroy({
        where: {
            bookId: bookId,
            genreId: genreId,
        },
    });
}

const updateGenres = async (
    { id, name }
) => {
    return await Genre.update({
        name: name,
    }, {
        where: {
            id: id,
        },
    });
};


module.exports = {
    createGenre,
    getGenres,
    addGenreToBook,
    removeGenreFromBook,
    updateGenres,
};