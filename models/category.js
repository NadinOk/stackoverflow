const {category} = require("../db/database");
const {PAGE_SIZE} = require("../pagination/pagination");

class CategoryModel {
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

    async getCategories(page= 1) {
        try {
            return await category.findAll({limit: PAGE_SIZE, offset: page * PAGE_SIZE - PAGE_SIZE})
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

module.exports = { CategoryModel, category };

