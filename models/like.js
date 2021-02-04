const Sequelize = require('sequelize');
const sequelize = require('../db/database');
const {PAGE_SIZE} = require("../pagination/pagination");

const like = sequelize.define('like_entity', {
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
    publish_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    post_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    comment_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    type_like: {
        type: Sequelize.ENUM,
        values: ['like', 'dislike'],
        allowNull: false
    }
})

class LikeModel {
    async createLike(author, type_like, data) {
        try {
            return await like.create({
                author: author,
                publish_date: Date.now(),
                post_id: data.post_id === undefined ? null: data.post_id,
                comment_id: data.comment_id === undefined ? null: data.comment_id,
                type_like: type_like
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getPostsLikeById(user_id, post_id) {
        try {
            return await like.findOne({where: {author: [user_id], post_id: [post_id]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }
    // async getPostsCatById(user_id, post_id) {
    //     try {
    //         return await like.findAll({where: {author: [user_id], post_id: [post_id]}})
    //     } catch (e) {
    //         console.log(e)
    //         return null
    //     }
    // }
    async getCommentsLikeById(user_id, comment_id) {
        try {
            return await like.findOne({where: {author: user_id, comment_id: comment_id}})
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async getLikePostById(post_id, page=1) {
        try {
            return await like.findAll({where: ({post_id: post_id}), limit: PAGE_SIZE, offset: page * PAGE_SIZE - PAGE_SIZE})
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async getLikeByCommentId(id_com, page=1) {
        try {
            return await like.findAll({where: ({comment_id: id_com}),  limit: PAGE_SIZE, offset: page * PAGE_SIZE - PAGE_SIZE})
        } catch (e) {
            console.log(e)
            return null
        }
    }


    async getLikeByPostId(id) {
        try {
            return await like.findAll({where: {id: [id]}})
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async deleteLikeById(id) {
        try {
            return await like.destroy({
                where: {id: id}
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }

}


module.exports = { LikeModel, like };
