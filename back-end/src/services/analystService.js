const db = require('../models');
const { Op } = require('sequelize');
const User = db.User;
const Order = db.Order;
const Book = db.Book;
const Detail_Order = db.Detail_Order;
const Sequelize = require('sequelize');

const getDashboardInformation = async ({ startDay, endDay }) => {
    const year = new Date().getFullYear();

    // 1. Lấy tổng số người dùng
    const totalUsers = await User.count();

    // 2. Lấy tổng số orders
    const totalOrders = await Order.count();

    // 3. Lấy tổng số sản phẩm (books)
    const totalBooks = await Book.count();

    // 4. Lấy số sách đã bán và doanh thu theo tháng trong năm hiện tại
    const monthlyReport = await Detail_Order.findAll({
        attributes: [
            [Sequelize.fn('MONTH', Sequelize.col('updatedAt')), 'month'], // Tính tháng từ updatedAt
            [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSold'], // Tổng số sách bán ra
            [Sequelize.fn('SUM', Sequelize.col('price')), 'revenue'] // Tổng doanh thu
        ],
        where: {
            updatedAt: {
                [Op.between]: [`${year}-01-01`, `${year}-12-31`], // Lọc theo năm hiện tại
            }
        },
        group: [Sequelize.fn('MONTH', Sequelize.col('updatedAt'))], // Nhóm theo tháng
        order: [[Sequelize.fn('MONTH', Sequelize.col('updatedAt')), 'ASC']]
    });

    // Xử lý kết quả để tạo một mảng gồm 12 tháng
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const data = monthlyReport.find((report) => report.dataValues.month === month);
        return {
            month,
            totalSold: data ? data.dataValues.totalSold : 0,
            revenue: data ? data.dataValues.revenue : 0
        };
    });
    // 5. Lấy số người dùng mới trong tháng bằng SELECT * FROM users ORDER BY createAt DESC LIMIT 20;
    const newUsers = await User.findAll({
        order: [['createAt', 'DESC']],
        limit: 20,
        attributes: ['id', 'firstname', 'lastname', 'createAt','avatar_url']
    })

    return {
        totalUsers,
        totalOrders,
        totalBooks,
        monthlyData,
        newUsers
    };
}



module.exports = {
    getDashboardInformation
}