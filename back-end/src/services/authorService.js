const db = require('../models');
const { Op } = require('sequelize');

const Author = db.Author;

const createAuthor = async (authorData) => {
    try {
        const { name, description } = authorData;

        const newAuthor = await Author.create({
            name: name,
            description: description
        });

        return newAuthor;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAuthors = async () => {
    try {
        const authors = await Author.findAll(
            {
                order: [['name', 'ASC']],
                // đếm số lượng sách tác giả viết
                attributes: {
                    include: [
                        [
                            db.sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM Books
                                WHERE Books.author_id = Author.id
                            )`),
                            'book_count'
                        ]
                    ]
                }
            }
        );
        if (!authors) {
            throw new Error('No authors found');
        }
        return authors;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAuthorById = async (id) => {
    try {
        const author = await Author.findByPk(id);
        if (!author) {
            throw new Error(`Author with ID ${id} not found`);
        }
        return author;
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateAuthor = async (id, authorData) => {
    try {
        const author = await Author.findByPk(id);
        if (!author) {
            throw new Error(`Author with ID ${id} not found`);
        }

        const { name, description } = authorData;
        if(name!==undefined || name!==null || name!=='')
            author.name = name;
        if(description!==undefined || description!==null || description!=='')
            author.description = description;

        await author.save();

        return author;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    createAuthor,
    getAuthors,
    getAuthorById,
    updateAuthor
}