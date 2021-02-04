const Sequelize = require('sequelize');


const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql',
        logging: false,
    })

module.exports = sequelize;
