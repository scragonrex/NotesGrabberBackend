const mongoose= require('mongoose');
const mongoURI="mongodb+srv://scragonrex:anand@cluster0.ox9zych.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo=()=>
{
    mongoose.connect(mongoURI,()=>
    {
        console.log("Connected to MongoDb");
    })
}

module.exports=connectToMongo