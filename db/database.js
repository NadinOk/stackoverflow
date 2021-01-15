const Sequelize = require('sequelize');


DB_USER='usof'
DB_PASSWORD='nadin1009'
DB_DATABASE='usof'

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    })
module.exports = sequelize;

