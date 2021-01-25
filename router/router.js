const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const PostModel = require('../models/post');
const UserModel = require('../models/user');
const CategoryModel = require('../models/category');
const LikeModel = require('../models/like');
const CommentModel = require('../models/comment');
const TokenModel = require('../models/token');
const isEmail = require ( 'isemail' );
const crypto = require('crypto')
const str_rand = require('../helper/helper');
const sendMail = require('../helper/sendMail');

//const {registerValidators} = require('../validators/auth')

const Category = new CategoryModel()
const Comment = new CommentModel()
const Post = new PostModel()
const User = new UserModel()
const Like = new LikeModel()
const Token = new TokenModel()



router.get('/', (req, res) => {
   res.send('index', {
      title: 'Stack Overflow - Where Developers Learn, Share, & Build Careers'
   })
})

// ===========Authentication module=============
router.get('/api/auth/confirm/:code', async (req, res) => {
   const userByCode = await User.getUsersByCode(req.params.code)
   if (userByCode !== null) {
      User.confirmUser(userByCode[0].dataValues.id)
      res.status(200).send('Email confirm')
   } else {
      res.status(404).send('User not found')
   }

})

router.post('/api/auth/register', async (req, res) => {
   try {
      const hashPassword = await bcrypt.hash(req.body.password, 10)

      const validEmail = isEmail.validate(req.body.email, {errorLevel: true})
      if (validEmail === 0) {
         const  randStr = str_rand();
          await User.createUser(req.body.login, hashPassword, req.body.full_name, req.body.email, randStr)

          const message = {
             to: req.body.email,
             subject: 'Confirm email',
             html:  `<h2>Поздравляем, вы успешно зарегестрировались на сайте!<h2>
                   
                    <a href="http://localhost:3000/api/auth/confirm/${randStr} ">Перейдите по ссылке для подтверждения регистрации</a>
                    <br>
                    <i>Данное письмо не требует ответа</i>`
          }
          sendMail(message)
         user = req.body
         res.status(201).send("User registered")
      } else {
         res.status(400).send("email is not valid")
      }
   }
   catch (e) {
      console.log(e)
   }


   // login, password, password confirm, email
})
router.post('/api/auth/login', async (req, res) => {
   try {
      const userEm = await User.getUsersByEmail(req.body.email)
      if (userEm){
         const areSame = await bcrypt.compare(req.body.password, userEm[0].dataValues.password)
         if (areSame) {
             await Token.createToken( userEm[0].dataValues.id)
             res.status(200).send('Password confirm, token created')
         } else {
            res.status(401).send('Password not confirm')
         }
      } else {
         res.status(404).send('Email not found')
      }
   } catch (e) {
      console.log(e)
   }
})
router.post('/api/auth/logout', async (req, res) => {
   // try {
   //    console.log('==========')
   //
   //    console.log(userEm[0].dataValues.token)
   // const tokenUser = await Token.getUsersByToken(userEm[0].dataValues.id, userEm[0].dataValues.token)
   //    console.log(tokenUser)
   // } catch (e) {
   //    console.log(e)
   // }
       // выход
})
router.post('/api/auth/password-reset', async (req, res) => {
  try {
       const userEmail = await  User.getUsersByEmail(req.body.email)
     
  } catch (e) {
     console.log(e)
  }

   // смена пароля через почту
})
router.post('/api/auth/password-reset/confirm-token', (req, res) => {
   res.send("OK token")
   // при подтверждении нового пароля с помощью токена обязательный параметр новый пароль
})

//================User module===================
router.get('/api/users', async (req, res) => {
   const allUser = await User.getUser();
   if (allUser !== null) {
      res.status(201).send(allUser)
   } else {
      res.status(400).send('Could not get user')
   }
})
router.get('/api/users/:id', async (req, res) => {
   const userById = await User.getUsersById(req.params.id)
   if (userById !== null) {
      res.status(201).send(userById)
   } else {
      res.status(400).send('Could not get user by id' )
   }
})
router.post('/api/users', async (req, res) => {
   const obj_user = await User.createUser(req.body.login, req.body.password, req.body.full_name, req.body.email,
                                          req.body.profile_picture, req.body.rating, req.body.role)
   if (obj_user !== null) {
      res.status(201).send(obj_user)
   } else {
      res.status(400).send('Could not create user')
   }
   // создание юзера с правами администратора
})
// router.post('/api/users/avatar', (req, res) => {
//    res.send("OK")
//    // загрузка пользователем свой аватар по токену
// })
router.patch('/api/users/:id', async (req, res) => {
   const uptUser = await User.updateUser(req.params.id, req.body.login, req.body.password, req.body.full_name, req.body.email,
                                          req.body.profile_picture, req.body.rating, req.body.role)
   if (uptUser[0] === 1) {
      res.status(200).send('Object updated')
   } else {
      res.status(400).send('Could not update user')
   }
})
router.delete('/api/users/:id', async (req, res) => {
   const delUser = await User.deleteUserById(req.params.id)
   if (delUser !== null) {
      res.status(204).send()
   } else {
      res.status(400).send('Could not deleted user')
   }
 })

//================Post module===================
router.get('/api/posts', async (req, res) => {
   const allPosts = await Post.getPosts();
   if (allPosts !== null) {
      res.status(201).send(allPosts)
   } else {
      res.status(400).send('Could not get posts')
   }
   // получить все сообщения если их много нужно реализовать розделение на страници
})
router.get('/api/posts/:id', async (req, res) => {
   const posById = await Post.getPostsById(req.params.id)
   if (posById !== null) {
      res.status(201).send(posById)
   } else {
      res.status(400).send('Could not get post by id' )
   }
})
router.get('/api/posts/:id/comments', async (req, res) => {
   const comment = await Comment.getCommentById(req.params.id)
   if(comment !== null){
      res.status(201).send(comment)
   } else {
      res.status(404).send('comment not found' )
   }
   // получить id комментарии
})
router.post('/api/posts/:id/comments', async (req, res) => {
   req.body.author = 1 // удалить после реализации логинки
   const postFiend = await Post.getPostsById(req.params.id)
   const commentById = await Comment.getCommentPostById(req.params.id)
   if (postFiend !== null && commentById !== null) {
      res.status(400).send('Could not create like: like already exists')
   }
   else if (commentById === null ){
      const comment = await Comment.createComments(req.body.author, req.body.content, req.params.id)
      if(comment === null){
         res.status(400).send('Could not create comment')
      } else {
         res.status(201).send(comment);
      }
   } else {
      res.status(404).send('Post not found' )
   }
   // создать новый комментарий, required parameter is [content]
})
router.get('/api/posts/:id/categories', async (req, res) => {
   const categor = await Category.getCategoryById(req.params.id)
   if(categor !== null){
      res.status(201).send(categor)
   } else {
      res.status(404).send('categories not found' )
   }
   // получить все категории, связанные с id
})
router.get('/api/posts/:id/like', async (req, res) => {
   const like = await Like.getLikeByPostId(req.params.id)
   if(like !== null){
      res.status(201).send(like)
   } else {
      res.status(404).send('Like not found' )
   }
 })
router.post('/api/posts', async (req, res) => {
   const obj_post = await Post.createPost(req.body.author, req.body.title, req.body.publish_date, req.body.content,
                                          req.body.status, req.body.categories)
   if (obj_post !== null) {
      res.status(201).send(obj_post)
   } else {
      res.status(400).send('Could not create post')
   }
})
router.post('/api/posts/:id/like', async (req, res) => {
   req.body.author = 1 // удалить после реализации логинки
   const posById = await Post.getPostsById(req.params.id)
   const likeById = await Like.getPostsLikeById(req.body.author, req.params.id)
   if (posById !== null && likeById !== null) {
      res.status(400).send('Could not create like: like already exists')
   }
   else if (likeById === null ){
      const like = await Like.createLike(req.body.author, req.body.type_like, {post_id: req.params.id})
      if(like === null){
         res.status(400).send('Could not create like')
      } else {
         res.status(201).send(like);
      }
   } else {
      res.status(404).send('Post not found' )
   }
 })


router.patch('/api/posts/:id', async (req, res) => {
   const uptPost = await Post.updatePost(req.params.id, req.body.author, req.body.title, req.body.publish_date, req.body.content,
                                          req.body.status, req.body.categories)
   if (uptPost[0] === 1) {
      res.status(200).send('Object updated')
   } else {
      res.status(400).send('Could not update category')
   }

   //обновить указанное сообщение (его заголовок, текст или категорию). Доступно только автору поста
})
router.delete('/api/posts/:id', async (req, res) => {
   const delPost = await Post.deletePostById(req.params.id)
   if (delPost !== null) {
      res.status(204).send()
   } else {
      res.status(400).send('Could not deleted category')
   }
})
   router.delete('/api/posts/:id/like', async (req, res) => {
   const delLike = await Like.deleteLikeById(req.params.id)
      if (delLike !== null) {
         res.status(204).send()
      } else {
         res.status(400).send('Could not deleted like')
      }
//    // delete лайк под постом доступно только автору или админу
 })

//================Categories module===============

router.get('/api/categories', async (req, res) => {
   const allCat = await Category.getCategories();
   if (allCat !== null) {
      res.status(201).send(allCat)
   } else {
      res.status(400).send('Could not get categories')
   }
})
router.get('/api/categories/:id', async (req, res) => {
   const catById = await Category.getCategoryById(req.params.id)
   if (catById !== null) {
      res.status(201).send(catById)
   } else {
      res.status(400).send('Could not get category by id' )
   }
   // получить id все категории
})
router.get('/api/categories/:id/posts', (req, res) => {
   res.send("OK id/posts")
   // получить все сообщения, связанные с указанной категорией
})

router.post('/api/categories', async (req, res) => {
   const obj = await Category.createCategory(req.body.title, req.body.description)
   if (obj !== null) {
      res.status(201).send(obj)
   } else {
      res.status(400).send('Could not create category')
   }
});

router.patch('/api/categories/:id', async (req, res) => {
   const uptd = await Category.updateCategory(req.params.id, req.body.title, req.body.description)
   if (uptd[0] === 1) {
      res.status(200).send('Object updated')
   } else {
      res.status(400).send('Could not update category')
   }

})
router.delete('/api/categories/:id', async (req, res) => {
   const del = await Category.deleteCategoryById(req.params.id)
   if (del !== null) {
      res.status(204).send()
   } else {
      res.status(400).send('Could not deleted category')
   }
})

//===============Comments module/==================

router.get('/api/comments/:id', async (req, res) => {
   const com = await Comment.getCommentById(req.params.content ,req.params.id)
   if (com !== null) {
      res.status(200).send(com)
   } else {
      res.status(400).send('Could not get comments')
   }
   // получить id категории
})
router.get('/api/comments/:id/like', async (req, res) => {
   const like = await Like.getLikeByPostId(req.params.id)
   if(like !== null){
      res.status(201).send(like)
   } else {
      res.status(404).send('Like not found' )
   }
   // получить все лайки по указанному комментарию
})
router.post('/api/comments/:id/like', async (req, res) => {
   req.body.author = 1 // удалить после реализации логинки
   const commById = await Comment.getCommentById(req.params.id)
   const likeById = await Like.getCommentsLikeById(req.body.author, req.params.id)
   if (commById !== null && likeById.length !== 0) {
      console.log(commById)
      console.log(likeById)
      res.status(400).send('Could not create like: like already exists')
   }
   else if (likeById.length === 0){
      const like = await Like.createLike(req.body.author,  req.body.type_like, {comment_id: req.params.id})
      if(like === null){
         res.status(400).send('Could not create like')
      } else {
         res.status(201).send(like);
      }
   } else {
      res.status(404).send('comment not found' )
   }
   // создать новую категорию, обязательный параметр - [название]
})
router.patch('/api/comments/:id', async  (req, res) => {
   const updated = await Comment.updateComments(req.params.id, req.body.author, req.body.publish_date, req.body.content)
   if (updated[0] === 1) {
      res.status(200).send('Object updated')
   } else {
      res.status(400).send('Could not update comment')
   }
   // обновить данные указанной категории
})
router.delete('/api/comments/:id', async (req, res) => {
   const delComme = await Comment.deleteCommentById(req.params.id)
   if (delComme !== null) {
      res.status(204).send()
   } else {
      res.status(400).send('Could not deleted category')
   }
  // res.send("OK delete comment id")

})
router.delete('/api/comments/:id/like', async (req, res) => {
   const delLike = await Like.deleteLikeById(req.params.id)
   if (delLike !== null) {
      res.status(204).send()
   } else {
      res.status(400).send('Could not deleted like')
   }
   //delete
})

module.exports = router;
