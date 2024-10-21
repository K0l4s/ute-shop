const Role = require('../enums/role.js');
const { getDashboardInformation } = require('../services/analystService.js');
const userService = require('../services/userService.js');
const getDashboard = async (req, res) => {
    const { startDay, endDay } = req.body;
    try {
        const response = await getDashboardInformation({ startDay, endDay });
        const userToken = req.user;
        const user = await userService.getUserById(userToken.id);
        if (user.role !== Role.ADMIN) {
            throw new Error('You do not have permission to perform this action');
        }
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getDashboard
}