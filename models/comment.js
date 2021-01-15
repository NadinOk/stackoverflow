const Sequelize = require('sequelize');
const sequelize = require('../db/database');

const comment = sequelize.define('comment_entity', {
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
    publish_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    // comment_id: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false
    // },
    content: {
        type: Sequelize.TEXT,
        allowNull:false
    }
});

class Comments {
    async createComments(author, comments, id) {
        try {
            return await comment.create({
                author: author,
                id: id,
                content: comments,
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

    async getComment() {
        try {
            return await comment.findAll()
        } catch (e) {
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
    async getCommentById(id) {
        try {
            return await comment.findAll({where: {id: [id]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async getCommentLikeById(id, comment) {
        try {
            return await comment.findAll({where: {id: [id], content: [comment]}})
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



module.exports = Comments;