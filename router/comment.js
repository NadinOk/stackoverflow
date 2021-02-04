const express = require('express');
const {checkPermission, getCurrentUser} = require("../helper/helper");
const router = express.Router();

const {CommentsModel} = require('../models/comment');
const {LikeModel} = require('../models/like');
const {UserModel} = require('../models/user');
const Comment = new CommentsModel()
const Like = new LikeModel()
const User = new UserModel()


//===============Comments module/==================

router.get('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const com = await Comment.getCommentById(req.params.id)
    if (com !== null) {
        res.status(200).send(com)
    } else {
        res.status(400).send('Could not get comments')
    }
})
router.get('/:id/like', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const likes = await Like.getLikeByCommentId(req.params.id, req.query.page)

    if(likes !== null){
        res.status(201).send(likes)
    } else {
        res.status(404).send('Like not found' )
    }
})
router.post('/:id/like', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const user = await getCurrentUser(req.headers.authorization)
    const comById = await Comment.getCommentById(req.params.id)
    const likeById = await Like.getCommentsLikeById(user.id, req.params.id)
    if (comById !== null && likeById !== null) {
        res.status(400).send('Could not create like: like already exists')
    } else if (likeById === null) {
        const like = await Like.createLike(user.id, req.body.type_like, {comment_id: req.params.id})
        if (like === null) {
            res.status(400).send('Could not create like')
        } else {
            await User.updateRatingByUserId(comById.author, req.body.type_like)
            res.status(201).send(like);
        }
    } else {
        res.status(404).send('Comment not found')
    }

})

router.patch('/:id', async  (req, res) => {
    if (!await checkPermission(req, res)) return;

    const updated = await Comment.updateComments(req.params.id, req.body.author, req.body.publish_date, req.body.content)
    if (updated[0] === 1) {
        res.status(200).send('Object updated')
    } else {
        res.status(400).send('Could not update comment')
    }
})
router.delete('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;

        const delComme = await Comment.deleteCommentById(req.params.id)
        if (delComme !== null) {
            res.status(204).send()
        } else {
            res.status(400).send('Could not deleted category')

    }
})
router.delete('/:id/like', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const delLike = await Like.deleteLikeById(req.params.id)
    if (delLike !== null) {
        res.status(204).send()
    } else {
        res.status(400).send('Could not deleted like')
    }
})

module.exports = router
