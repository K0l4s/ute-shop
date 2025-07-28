process.env.NODE_ENV = 'test';

const { sequelize } = require('../src/models');

// Setup trước khi chạy tất cả tests
beforeAll(async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Test database connection established successfully.');
    
    // Sync database - tạo tables
    await sequelize.sync({ force: true });
    console.log('Test database synced successfully');
  } catch (error) {
    console.error('Unable to connect to test database:', error);
    throw error;
  }
}, 30000);

// Cleanup sau khi chạy tất cả tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database:', error);
  }
});

// Clean up data sau mỗi test
afterEach(async () => {
  try {
    // Xóa tất cả data trong các bảng theo thứ tự để tránh foreign key constraint
    const models = Object.keys(sequelize.models);
    
    // Disable foreign key checks cho SQLite
    if (sequelize.getDialect() === 'sqlite') {
      await sequelize.query('PRAGMA foreign_keys = OFF');
    }
    
    for (const modelName of models) {
      await sequelize.models[modelName].destroy({
        where: {},
        force: true,
        cascade: true
      });
    }
    
    // Re-enable foreign key checks
    if (sequelize.getDialect() === 'sqlite') {
      await sequelize.query('PRAGMA foreign_keys = ON');
    }
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
});