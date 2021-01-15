const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./router/router');
const sequelize = require('./db/database');
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
//app.use(express.static('public'))
app.use('/', userRouter);




