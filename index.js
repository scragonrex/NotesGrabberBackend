const connectToMongo=require('./db.js');
connectToMongo();

var cors = require('cors')
const express = require('express')
const port = process.env.PORT||3000;
var app = express()
 
app.use(cors());
 
app.use(express.json());

//Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})