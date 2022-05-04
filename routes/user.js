var express = require('express');
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV||'development']);

const userRouter = express.Router();
userRouter.use(express.json());

module.exports = userRouter;

userRouter.get('/:username', (req, res) => {

})

userRouter.get('/:id', (req, res) => {

})

userRouter.post('/', (req, res) => {
  knex("users")
  .select("username")
  .where({username: `${body?.username}`})
  .then(data =>{
    if(data.length !== 0){
      res.status(406)
      res.send("Username Already Exists")
    } else{
      knex("users")
      .insert(req.body)
      .returning("id")
      .then(data => {
        res.status(201).send("Successfully created new user")
      })
      .catch(err =>{
        console.log(err)
        res.status(404).send(err)
      })
    }
  })
})

userRouter.patch('/:username', (req, res) =>{
  
})