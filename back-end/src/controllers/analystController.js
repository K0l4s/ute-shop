const { getDashboardInformation  } = require('../services/analystService.js');

const getDashboard = async (req, res) => {
    const { startDay, endDay } = req.body;
    try {
        const response = await getDashboardInformation({ startDay, endDay });
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getDashboard
}