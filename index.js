// const connectToMongo=require('./db.js');
const mongoose= require('mongoose');
const mongoURI="mongodb+srv://scragonrex:anand@cluster0.ox9zych.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo=()=>
{
    mongoose.connect(mongoURI,()=>
    {
        console.log("Connected to MongoDb");
    })
}

connectToMongo();

var cors = require('cors')
const express = require('express')
const port = process.env.PORT||5000;
var app = express()
 
app.use(cors());
 
app.use(express.json());

//Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})