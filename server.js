require('dotenv').config();
const app = require('./src/app');  // Import the configured app
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database without force/alter options
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer(); 