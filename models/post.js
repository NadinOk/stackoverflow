const Sequelize = require('sequelize');
const sequelize = require('../db/database');


const post = sequelize.define('post_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    publish_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull:false
    },
    categories: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

class Post {
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

    async getPosts() {
        try {
            return await post.findAll()
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getPostsById(id) {
        try {
            return await post.findAll({where: {id: [id]}})
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


module.exports = Post;