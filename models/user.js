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
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        isEmail: true,
        allowNull: false
    },
    profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    rating: {
        type: Sequelize.INTEGER,
        defaultValue: "0",
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        defaultValue: "user",
        allowNull: false
    },
    confirmCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    is_confirm: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    resetToken: {
        type: Sequelize.STRING,
        allowNull: true
    },
    expires: {
        type: Sequelize.DATE,
    },
});

class User {
    async createUser(login, password, full_name, email, confirmCode, profile_picture) {
        try { //TODO сделать обработчик пути картинки
            return await user.create({
                login: login,
                password: password,
                full_name: full_name,
                email: email,
                confirmCode: confirmCode,
                profile_picture: profile_picture
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
    async updateUserPassword(id, password) {
        let dataToUpdate = {}
        if (password !== undefined) {
            dataToUpdate['password'] = password;
            try {
                return await user.update(dataToUpdate, {where: ({id: [id]})})
            } catch (e) {
                console.log(e)
                return null
            }
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
    async createTokenResPasword (user_id, token){
        try {
            return await user.update({
                resetToken: token,
                expires: Date.now() + 3600000
            }, {where: {id: [user_id]}})
        } catch (e) {
            console.log(e)
        }
    }
    async getUsersByCode(code) {
        try {
            return await user.findAll({where: {confirmCode: [code]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getUsersByResetCode(code) {
        try {
            return await user.findAll({where: {resetToken: [code]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getUsersByEmail(email) {
        try {
            return await user.findAll({where: {email: [email]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async confirmUser(id) {
        let dataToUpdate = {is_confirm: true}
        try {
            return await user.update(dataToUpdate, {where: ({id: id})})
            //update user set is_confirm=true where id=1;(1- пример значения переменной id)
        } catch (e) {
            console.log(e)
            return null
        }
    }
}


module.exports = User;