var express = require('express');
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV||'development']);

const postRouter = express.Router();
postRouter.use(express.json());

module.exports = postRouter;