var express = require('express');
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV||'development']);
const cors = require('cors')
const userRouter = require("./routes/user")
const postsRouter = require("./routes/posts")

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8080;

app.use('/user', userRouter);
app.use('/posts', postsRouter);


app.get("/", (req, res) =>{
  res.status(200).send("Server running")
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})