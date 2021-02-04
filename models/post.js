const Sequelize = require('sequelize');
const sequelize = require('../db/database');
const {comment} = require("./comment");
const {like} = require("./like");
const {PAGE_SIZE} = require("../pagination/pagination");

const post = sequelize.define('post_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    author: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    publish_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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

post.hasMany(like, {
    foreignKey: 'post_id'
})

post.hasMany(comment, {
    foreignKey: 'post_id'
})

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
            return await post.findAll({limit: PAGE_SIZE, offset: page * PAGE_SIZE - PAGE_SIZE})
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

    async getPostById(id) {
        try {
            return await post.findOne({where: {id: [id]}})
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