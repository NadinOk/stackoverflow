const Sequelize = require('sequelize');
const sequelize = require('../db/database');
const str_rand = require('../helper/helper');


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
        defaultValue: Date.now()
    }
});

class Token {
    async createToken(user_id){
        try {
            return  await token.create({
                token: str_rand(),
                user_id: user_id,
                created: Date.now(),
                expires_at: Date.now() + (2 * 60 * 60 *1000)
            })
        } catch (e) {
            console.log(e)
        }
    }
    async updatedToken(token) {
        let dataToUpdate = {expires_at: Date.now()}
        try {
            return await token.update(dataToUpdate, {where: ({token: [token]})})
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async getUsersByToken(id, {token}) {
        try {
            return await token.findAll({where: {id: [id, token]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }
}

module.exports = Token