var express = require('express');
require('dotenv').config();
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const jwt = require('jsonwebtoken');
const postRouter = express.Router();
postRouter.use(express.json());

//verify authentication token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user_id = decodedToken.id;
    next();
  } catch (error) {
    res.status(401).json({error: "Invalid Token"})
  }
}

//get all posts with author name
postRouter.get('/', (req, res) => {
  knex("post")
    .join("users", "users.id", '=', 'post.user_id')
    .select("post.id", "post.title", 'post.creation_date', 'post.content', 'users.first_name', 'users.last_name')
    .then(data =>{
      res.status(200).json(data)
    })
    .catch(err =>{
      console.log(err)
      res.status(404).json({error: err})
    })
})

//get posts for a specific user account
postRouter.get('/user', verifyToken, (req, res) => {
    knex("post")
      .where({user_id: `${req.user_id}`})
      .join("users", "users.id", '=', 'post.user_id')
      .select("post.id", "post.title", 'post.creation_date', 'post.content', 'users.first_name', 'users.last_name')
      .then(data =>{
        res.status(200).json(data)
      })
      .catch(err =>{
        console.log(err)
        res.status(404).json({error: err})
      })
})

//create a new post with the user_id based on the authentication token
postRouter.post('/', verifyToken, (req, res) => {
  knex("post")
    .insert({...req.body, user_id: req.user_id})
    .returning("*")
    .then(data => {
      res.status(201).json(data)
    })
    .catch(err =>{
      console.log(err)
      res.status(404).json({error: err})
    })
})

//update a post only if the authentication token matches the user_id
postRouter.patch('/', verifyToken, (req, res) => {
  knex("post")
  .where({id: `${req.body?.id}`, user_id: `${req.user_id}`})
  .update(req.body)
  .then((data) => {
    if(data === 0){
      res.status(403).json({error :"Could not Update Post"})
    }else{
      res.status(201).json({message :"Post updated successfully"})
    }
  })
  .catch(err =>{
    console.log(err)
    res.status(404).json({error: err})
  })
  
})

//delete a post only if the authentication token matches the user_id
postRouter.delete('/', verifyToken, (req, res) => {
  knex("post")
    .where({id: `${req.body?.id} `, user_id: `${req.user_id}`})
    .returning("*")
    .delete()
    .then((data) => {
      if(data.length === 0){
        res.status(403).json({error :"Could not Delete Post"})
      }else{
        res.status(201).json({message :"Post deleted successfully"})
      }
    })
    .catch(err =>{
      console.log(err)
      res.status(404).json({error: err})
    })
})

module.exports = postRouter;