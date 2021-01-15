const Sequelize = require('sequelize');
const sequelize = require('../db/database');



const user = sequelize.define('user_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    login: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    full_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        isEmail: true,
        allowNull: false
    },
    profile_picture: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

class User {
    async createUser(login, password, full_name, email, profile_picture, rating, role) {
        try { //TODO сделать обработчик пути картинки
            return await user.create({
                login: login,
                password: password,
                full_name: full_name,
                email: email,
                profile_picture: profile_picture,
                rating: rating,
                role: role
            })
        }
        catch (e) {
            console.log(e)
            return null
        }
    }

    async updateUser(id, login, password, full_name, email, profile_picture, rating, role) {
        let dataToUpdate = {}
        if (login !== undefined) {
            dataToUpdate['login'] = login;
        }
        if (password !== undefined) {
            dataToUpdate['password'] = password;
        }
        if (full_name !== undefined) {
            dataToUpdate['full_name'] = full_name;
        }
        if (email !== undefined) {
            dataToUpdate['email'] = email;
        }
        if (profile_picture !== undefined) {
            dataToUpdate['profile_picture'] = profile_picture;
        }
        if (rating !== undefined) {
            dataToUpdate['rating'] = rating;
        }
        if (role !== undefined) {
            dataToUpdate['role'] = role;
        }
        try {
            return await user.update(dataToUpdate, {where: ({id: id})})
        }catch (e){
            console.log(e)
            return null
        }
    }

    async getUser() {
        try {
            return await user.findAll()
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getUsersById(id) {
        try {
            return await user.findAll({where: {id: [id]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async deleteUserById(id) {
        try {
            return await user.destroy({
                where: {id: id}
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }

}

module.exports = User;