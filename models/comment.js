const Sequelize = require('sequelize');
const sequelize = require('../db/database');
const user = require('./user')
const {PAGE_SIZE} = require("../pagination/pagination");
const {like} = require("./like");

const comment = sequelize.define('comment_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    author: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    publish_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull:false
    }
});

comment.hasMany(like, {
    foreignKey: 'comment_id'
})

class CommentsModel {
    async createComments(author, comments, id) {
        try {
            return await comment.create({
                author: author,
                content: comments,
                post_id: id,
                publish_date: Date.now()
            })
        }
        catch (e) {
            console.log(e)
            return null
        }
    }

    async updateComments(id, author, publish_date, content) {
        let dataToUpdate = {}
        if (author !== undefined) {
            dataToUpdate['author'] = author;
        }
        if (publish_date !== undefined) {
            dataToUpdate['publish_date'] = publish_date;
        }
        if (content !== undefined) {
            dataToUpdate['content'] = content;
        }
        try {
            return await comment.update(dataToUpdate, {where: ({id: id})})
        }catch (e){
            console.log(e)
            return null
        }
    }


    async getCommentPostById(author_id, post_id) {
        try {
            return await comment.findAll({where: {id: [author_id], post_id: [post_id]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async getCommentsByPostId(postId, page=1) {
        try {
            return await comment.findAll({where: ({post_id: postId}), limit: PAGE_SIZE, offset: page * PAGE_SIZE - PAGE_SIZE})
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getCommentById(id) {
        try {
            return await comment.findOne({where: {id: id}})
        } catch (e) {
            console.log(e)
            return null
        }
    }


    async deleteCommentById(id) {
        try {
            return await comment.destroy({
                where: {id: id}
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }

}



module.exports = { CommentsModel, comment };