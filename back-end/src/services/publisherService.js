const db = require("../models");
const Publisher = db.Publisher;

const getPublishers = async () => {
  try {
    return Publisher.findAll();
  }
  catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getPublishers,
}