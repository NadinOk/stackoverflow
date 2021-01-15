const Sequelize = require('sequelize');
const sequelize = require('../db/database');

const category = sequelize.define('category_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

class Category {
    async createCategory(title, description) {
        try {
            return await category.create({
                title: title,
                description: description
            })
        }
        catch (e) {
            console.log(e)
            return null
        }
    }

   async updateCategory(id, title, description) {
        let dataToUpdate = {}
        if (title !== undefined) {
            dataToUpdate['title'] = title;
        }
        if (description !== undefined) {
            dataToUpdate['description'] = description;
        }
        try {
            return await category.update(dataToUpdate, {where: ({id: id})})
        }catch (e){
            console.log(e)
            return null
        }
    }

    async getCategories() {
        try {
            return await category.findAll()
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getCategoryById(id) {
        try {
            return await category.findAll({where: {id: [id]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async deleteCategoryById(id) {
        try {
            return await category.destroy({
                where: {id: id}
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }

}

module.exports = Category;

