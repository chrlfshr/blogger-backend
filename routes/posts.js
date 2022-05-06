var express = require('express');
require('dotenv').config();
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const jwt = require('jsonwebtoken');
const postRouter = express.Router();
postRouter.use(express.json());

postRouter.get('/', (req, res) => {
  knex("post")
    .join("users", "users.id", '=', 'post.user_id')
    .select("post.id", "post.title", 'post.creation_date', 'post.content', 'users.first_name', 'users.last_name')
    .then(data =>{
      res.status(200).json(data)
    })
    .catch(err =>{
      console.log(err)
      res.status(404).send(err)
    })
})

postRouter.get('/user', (req, res) => {
  const token = req.headers.authorization
  console.log(token)
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decodedToken)
    knex("post")
      .where({user_id: `${decodedToken.id}`})
      .join("users", "users.id", '=', 'post.user_id')
      .select("post.id", "post.title", 'post.creation_date', 'post.content', 'users.first_name', 'users.last_name')
      .then(data =>{
        res.status(200).json(data)
      })
      .catch(err =>{
        console.log(err)
        res.status(404).send(err)
      })
  } catch (error) {
    res.status(403).send("Invalid Token")
  }
})

postRouter.get('/:id', (req, res) => {
  knex("post")
    .where({id: `${req.params.id}`})
    .select("*")
    .then(data =>{
      res.status(200).json(data)
    })
    .catch(err =>{
      console.log(err)
      res.status(404).send(err)
    })
})

postRouter.post('/', (req, res) => {
  knex("post")
    .insert(req.body)
    .returning("*")
    .then(data => {
      res.status(201).json(data)
    })
    .catch(err =>{
      console.log(err)
      res.status(404).send(err)
    })
})

postRouter.patch('/:id', (req, res) => {
  knex("post")
    .where({id: `${req.params.id}`})
    .update(req.body)
    .then(() => {
      res.status(201).send("Post updated successfully")
    })
    .catch(err =>{
      console.log(err)
      res.status(404).send(err)
    })
})

postRouter.delete('/:id', (req, res) => {
  knex("post")
    .where({id: `${req.params.id}`})  .select("*")
    .delete()
    .then(() => {
      res.status(201).send("Post deleted successfully")
    })
    .catch(err =>{
      console.log(err)
      res.status(404).send(err)
    })
})

module.exports = postRouter;