/*const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_URL,
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
    }
);

module.exports = sequelize;
*/
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Используем строку подключения из переменной окружения DB_URL
const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',  // Указываем, что используем PostgreSQL
    dialectOptions: {
        // Дополнительные настройки, если нужно (например, для SSL)
        ssl: false,
    },
});

module.exports = sequelize;
