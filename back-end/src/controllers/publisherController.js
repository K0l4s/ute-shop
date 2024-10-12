const { getPublishers } = require("../services/publisherService");

const getPublishersController = async (req, res) => {
  try {
    const publishers = await getPublishers();
    return res.status(200).json({
      message: "success",
      data: publishers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

module.exports = {
  getPublishersController,
}