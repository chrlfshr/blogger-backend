var express = require('express');
require('dotenv').config();
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const jwt = require('jsonwebtoken');
const postRouter = express.Router();
postRouter.use(express.json());

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

postRouter.patch('/', verifyToken, (req, res) => {
  knex("post")
  .where({id: `${req.body?.id}`, user_id: `${req.user_id}`})
  .update(req.body)
  .then(() => {
    res.status(201).json({Message :"Post updated successfully"})
  })
  .catch(err =>{
    console.log(err)
    res.status(404).json({error: err})
  })
  
})

postRouter.delete('/', verifyToken, (req, res) => {
  knex("post")
    .where({id: `${req.body?.id} `, user_id: `${req.user_id}`})
    .returning("*")
    .delete()
    .then((data) => {
      if(data.length === 0){
        res.status(403).json({Error :"Could not Delete Post"})
      }else{
        res.status(201).json({Message :"Post deleted successfully"})
      }
      
    })
    .catch(err =>{
      console.log(err)
      res.status(404).json({error: err})
    })
})

module.exports = postRouter;