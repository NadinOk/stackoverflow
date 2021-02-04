const express = require('express');
const router = express.Router();

const {PostModel} = require('../models/post');
const {CategoryModel} = require('../models/category');
const {LikeModel} = require('../models/like');
const {CommentsModel} = require('../models/comment');
const {UserModel} = require('../models/user');
const {checkPermission, getCurrentUser} = require("../helper/helper");

const Category = new CategoryModel()
const Comment = new CommentsModel()
const Post = new PostModel()
const Like = new LikeModel()
const User = new UserModel()

//================Post module===================
router.get('/', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const allPosts = await Post.getPosts(req.query.page);
    if (allPosts !== null) {
        res.status(201).send(allPosts)
    } else {
        res.status(400).send('Could not get posts')
    }
})
router.get('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const posById = await Post.getPostsById(req.params.id)
    if (posById !== null) {
        res.status(201).send(posById)
    } else {
        res.status(400).send('Could not get post by id')
    }
})
router.get('/:id/comments', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const comment = await Comment.getCommentsByPostId(req.params.id, req.query.page)
    if (comment !== null) {
        res.status(201).send(comment)
    } else {
        res.status(404).send('comment not found')
    }
})
router.post('/:id/comments', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const user = await getCurrentUser(req.headers.authorization)
    const postFiend = await Post.getPostsById(req.params.id)
    const commentById = await Comment.getCommentPostById(req.params.id)
    if (postFiend !== null && commentById !== null) {
        const comment = await Comment.createComments(user.id, req.body.content, req.params.id)
        if (comment === null) {
            res.status(400).send('Could not create comment')
    } else {
            res.status(201).send(comment);
        }
    } else {
        res.status(404).send('Post not found')
    }
})
router.get('/:id/categories', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const posById = await Post.getPostsById(req.params.id)
    const categor = await Category.getCategoryById(req.params.id)
    if (posById !== null && categor !== null) {
        res.status(201).send(categor)
    } else {
        res.status(404).send('categories not found')
    }
    // получить все категории, связанные с id
})
router.get('/:id/like', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const like = await Like.getLikePostById(req.params.id, req.query.page)
    if (like !== null ) {
        res.status(201).send(like)
    } else {
        res.status(404).send('Like not found')
    }
})
router.post('/', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const user = await getCurrentUser(req.headers.authorization)
    const obj_post = await Post.createPost(user.id, req.body.title, req.body.publish_date, req.body.content,
        req.body.status, req.body.categories)
    if (obj_post !== null) {
        res.status(201).send(obj_post)
    } else {
        res.status(400).send('Could not create post')
    }
})
router.post('/:id/like', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const user = await getCurrentUser(req.headers.authorization)

    const posById = await Post.getPostById(req.params.id)
    const likeById = await Like.getPostsLikeById(user.id, req.params.id)
    if (posById !== null && likeById !== null) {
        res.status(400).send('Could not create like: like already exists')
    } else if (likeById === null) {
        const like = await Like.createLike(user.id, req.body.type_like, {post_id: req.params.id})
        if (like === null) {
            res.status(400).send('Could not create like')
        } else {
            await User.updateRatingByUserId(posById.author, req.body.type_like)
            res.status(201).send(like);
        }
    } else {
        res.status(404).send('Post not found')
    }

})


router.patch('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const uptPost = await Post.updatePost(req.params.id, req.body.author, req.body.title,
        req.body.publish_date, req.body.content, req.body.status, req.body.categories)
    if (uptPost[0] === 1) {
        res.status(200).send('Object updated')
    } else {
        res.status(400).send('Could not update category')
    }
    //обновить указанное сообщение (его заголовок, текст или категорию). Доступно только автору поста
})
router.delete('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;
    const postId = await Post.getPostsById(req.params.id)
    if (postId !== null) {
    await Post.deletePostById(req.params.id)
        res.status(204).send()
    } else {
        res.status(400).send('Could not deleted post')
    }
})
router.delete('/:id/like', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const user = await getCurrentUser(req.headers.authorization)
    const like = await Like.getPostsLikeById(user.id, req.params.id)
    if (like === null) {
        res.status(204).send()
    }
    else if (user.role === 'admin' || user.id === like.author) {
        const delLike = await Like.deleteLikeById(like.id)
        if (delLike !== null) {
            res.status(204).send()
        } else {
            res.status(400).send('Could not deleted like')
        }
    }
//    // delete лайк под постом доступно только автору или админу
})

module.exports = router
