var express = require('express');
require('dotenv').config();
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const saltRounds = 11

const userRouter = express.Router();
userRouter.use(express.json());

//create user route
userRouter.post('/', (req, res) => {
  knex("users")
    .where({username: req.body?.username})
    .select("username")
    .then(data =>{
      if(data.length !== 0){
        res.status(400)
        res.send("Username Already Exists")
      } else{
        let user = {...req.body}
        bcrypt.hash(user.password, saltRounds)
        .then(hash =>{
          user.password = hash
          knex("users")
            .insert(user)
            .returning("id")
            .then(data => {
              res.status(201).send("Successfully created new user")
            })
            .catch(err =>{
              console.log(err)
              res.status(404).send(err)
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
          res.status(404).send(err)
        );
      }
    })
    .catch(err =>
      res.status(404).send(err)
    );
})

// userRouter.patch('/:id', (req, res) =>{
//   knex("users")
//     .where({id: req.params.id})
//     .update(req.body)
//     .then(() => {
//       res.status(201).send("user updated successfully")
//     })
//     .catch(err =>{
//       console.log(err)
//       res.status(404).send(err)
//     })
// })

// userRouter.delete('/:id', (req, res) =>{
//   knex("users")
//     .where({id: req.params.id})  .select("*")
//     .delete()
//     .then(() => {
//       res.status(201).send("User deleted successfully")
//     })
//     .catch(err =>{
//       console.log(err)
//       res.status(404).send(err)
//     })
// })

module.exports = userRouter;