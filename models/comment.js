const sequelize = require('../db/database');
const {post} = require("../db/database");
const {user} = require("../db/database");
const {comment} = require("../db/database");
const {PAGE_SIZE} = require("../pagination/pagination");



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
            return await comment.findAll({where: ({post_id: postId}), limit: PAGE_SIZE, offset: page * PAGE_SIZE - PAGE_SIZE,
                include:[{model: user, as: 'CommentAuthor', attributes: ['login']}]
                })
                
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