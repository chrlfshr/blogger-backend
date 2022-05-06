var express = require('express');
require('dotenv').config();
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const saltRounds = 11

const userRouter = express.Router();
userRouter.use(express.json());

//user creation validation
const validateNewUser = (req, res, next) => {
  if(req.body?.password?.length < 8){
    res.status(400).json({error : "Password does not meet requirements"})
  }else if(req.body?.username?.length < 3){
    res.status(400).json({error : "Username does not meet requirements"})
  }else if(req.body?.first_name?.length < 1){
    res.status(400).json({error : "First name can not be empty"})
  }else if(req.body?.last_name?.length < 1){
    res.status(400).json({error : "Last name can not be empty"})
  }
  else{
    next();
  }
}


//create user route
userRouter.post('/', validateNewUser, (req, res) => {
  knex("users")
    .where({username: req.body?.username})
    .select("username")
    .then(data =>{
      if(data.length !== 0){
        res.status(400).json({error : "Username Already Exists"})
      } else{
        let user = {...req.body}
        bcrypt.hash(user.password, saltRounds)//salt and hash the password
        .then(hash =>{
          user.password = hash
          knex("users")
            .insert(user)
            .returning("id")
            .then(data => {
              res.status(201).json({message: "Successfully created new user"})
            })
            .catch(err =>{
              console.log(err)
              res.status(404).json({error: err})
            })
        })
        
      }
    })
})

//login route
userRouter.post('/login', async (req, res) => {
  const login = {...req.body}
  knex("users")
    .where({username: login.username})
    .select('password')
    .then(pass =>{
      if(pass.length === 0){
        res.status(401).json({message: "failed to sign in"})
      } else{
        bcrypt.compare(login.password, pass[0].password)
        .then(valid =>{
          if(valid){
            knex("users")
              .where({username: login.username})
              .select('id', 'username', 'first_name', 'last_name')
              .then(user =>{
                const accessToken = jwt.sign(
                  user[0],
                  process.env.JWT_SECRET,
                  {expiresIn: "20m"}//set token timeout
                )
                res.header('authorization', accessToken).json(accessToken)
              })
          }else{
            res.status(401).json({message: "failed to sign in"})
          }
        })
        .catch(err =>
          res.status(404).json({error: err})
        );
      }
    })
    .catch(err =>
      res.status(404).json({error: err})
    );
})

module.exports = userRouter;