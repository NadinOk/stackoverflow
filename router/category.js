const express = require('express');
const {checkPermission} = require("../helper/helper");
const router = express.Router();

const {CategoryModel} = require('../models/category');
const {PostModel} = require('../models/post');
const Category = new CategoryModel()
const Post = new PostModel()

//================Categories module===============

router.get('/', async (req, res) => {
    // if (!await checkPermission(req, res)) return;

    const allCat = await Category.getCategories(req.query.page);
    if (allCat !== null) {
        res.status(200).send(allCat)
    } else {
        res.status(400).send('Could not get categories')
    }
})
router.get('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const catById = await Category.getCategoryById(req.params.id)
    if (catById !== null) {
        res.status(200).send(catById)
    } else {
        res.status(400).send('Could not get category by id')
    }
})
router.get('/:id/posts', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const post = await Post.getPostsById(req.params.id)
    if (post !== null) {
        res.status(200).send(post)
    } else {
        res.status(404).send('Post not found')
    }
})

router.post('/', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const obj = await Category.createCategory(req.body.title, req.body.description)
    if (obj !== null) {
        res.status(201).send(obj)
    } else {
        res.status(400).send('Could not create category')
    }
});

router.patch('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const uptd = await Category.updateCategory(req.params.id, req.body.title, req.body.description)
    if (uptd[0] === 1) {
        res.status(200).send('Object updated')
    } else {
        res.status(400).send('Could not update category')
    }

})
router.delete('/:id', async (req, res) => {
    if (!await checkPermission(req, res)) return;

    const del = await Category.deleteCategoryById(req.params.id)
    if (del !== null) {
        res.status(204).send('Category deleted')
    } else {
        res.status(400).send('Could not deleted category')
    }
})

module.exports = router
