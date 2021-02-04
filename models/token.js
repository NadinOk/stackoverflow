const Sequelize = require('sequelize');
const sequelize = require('../db/database');





const token = sequelize.define('token_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});

class TokenModel {
    async createToken(user_id, rand){
        try {
            return  await token.create({
                token: rand,
                user_id: user_id,
                created: Date.now(),
                expires_at: Date.now() + (2 * 60 * 60 *1000)
            })
        } catch (e) {
            console.log(e)
        }
    }
    async logout(t) {
        let dataToUpdate = {expires_at: Date.now()}
        try {
            return await token.update(dataToUpdate, {where: ({token: [t]})})
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async getUserByToken(t) {
        try {
            return await token.findOne({where: {token: [t]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }
}

module.exports = { TokenModel, token }