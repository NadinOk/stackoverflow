const Sequelize = require('sequelize');
const {post, like, comment, user} = require("../db/database");
const {PAGE_SIZE} = require("../pagination/pagination");

class PostModel {
    async createPost(author, title, publish_date, content, status, categories) {
        try {
            return await post.create({
                author: author,
                title: title,
                publish_date: publish_date,
                content: content,
                status: status,
                categories: categories
            })
        }
        catch (e) {
            console.log(e)
            return null
        }
    }

    async updatePost(id, author, title, publish_date, content, status, categories) {
        let dataToUpdate = {}
        if (title !== undefined) {
            dataToUpdate['title'] = title;
        }
        if (author !== undefined) {
            dataToUpdate['author'] = author;
        }
        if (publish_date !== undefined) {
            dataToUpdate['publish_date'] = publish_date;
        }
        if (content !== undefined) {
            dataToUpdate['content'] = content;
        }
        if (status !== undefined) {
            dataToUpdate['status'] = status;
        }
        if (categories !== undefined) {
            dataToUpdate['categories'] = categories;
        }
        try {
            return await post.update(dataToUpdate, {where: ({id: id})})
        }catch (e){
            console.log(e)
            return null
        }
    }

    async getPosts( page=1) {
        
        try {
            return await post.findAll({
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE - PAGE_SIZE,
                include:[{model: user, as: 'Author', attributes: ['login']}],
                order: [['publish_date', 'DESC']]
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getPostsById(id) {

        try {
            return await post.findAll(
                {where: {id: [id]},
                include:[{model: user, as: 'Author', attributes: ['login']}]
                })
        } catch (e) {
            console.log(e)
            return null
        }
    }


    async getUserPostsById(user_id) {
        try {
            return await post.findAll({where: {author: [user_id]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getPostById(id) {
        try {
            return await post.findOne(
                {where: {id: [id]},
                    // include:[{model: user, as: 'Author', attributes: ['login']}]
                })
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async deletePostById(id) {
        try {
            return await post.destroy({
                where: {id: id}
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }

}


module.exports = { PostModel, post};