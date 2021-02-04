const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db/database');

const authRouter = require('./router/auth');
const categoryRouter = require('./router/category');
const commentRouter = require('./router/comment');
const postRouter = require('./router/post');
const userRouter = require('./router/user');

const app = express();

const PORT = process.env.PORT || 3000

async function start () {
   try {
      await sequelize.sync()
      app.listen(PORT, () => {
         console.log(`Server is running on port ${PORT}`)
      })
   } catch (err) {
      console.log(err)
   }
}
start();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expected: true}));
app.use('/api/auth/', authRouter);
app.use('/api/categories/', categoryRouter);
app.use('/api/comments/', commentRouter);
app.use('/api/posts/', postRouter);
app.use('/api/users/', userRouter);




