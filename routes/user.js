var express = require('express');
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);

const userRouter = express.Router();
userRouter.use(express.json());


userRouter.post('/', (req, res) => {
  knex("users")
    .where({username: req.body?.username})
    .select("username")
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

userRouter.get('/username', (req, res) => {
  knex('users')
    .select('id', 'username', 'first_name', 'last_name')
    .then(data =>{
      res.status(200).json(data)
    })
    .catch(err =>{
      console.log(err)
      res.status(404).send(err)
    })
})

userRouter.get('/username/:id', (req, res) => {
  knex('users')
    .where({id: req.params.id})
    .select('username')
    .then(data =>{
      res.status(200).json(data[0])
    })
    .catch(err =>{
      console.log(err)
      res.status(404).send(err)
    })
})

userRouter.post('/:username', (req, res) => {
  console.log(req.body)
  knex("users")
    .where({username: req.body?.username, password: req.body?.password})
    .select('id', 'username', 'first_name', 'last_name')
    .then(user =>{
      if(user.length !== 1){
        res.status(401).json({message: "failed to sign in"})
      }else{
        res.status(200).json(user[0])
      }
      
    })
    .catch(err =>
      res.status(404).send(err)
    );
})

userRouter.post('/', (req, res) => {
  knex("users")
    .where({username: req.body?.username})
    .select("username")
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

userRouter.patch('/:id', (req, res) =>{
  knex("users")
    .where({id: req.params.id})
    .update(req.body)
    .then(() => {
      res.status(201).send("user updated successfully")
    })
    .catch(err =>{
      console.log(err)
      res.status(404).send(err)
    })
})

userRouter.delete('/:id', (req, res) =>{
  knex("users")
    .where({id: req.params.id})  .select("*")
    .delete()
    .then(() => {
      res.status(201).send("User deleted successfully")
    })
    .catch(err =>{
      console.log(err)
      res.status(404).send(err)
    })
})

module.exports = userRouter;