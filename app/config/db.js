require ('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_CONNECTION_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database sucessfully connected');

    }catch(error){

    console.error('Database connection failed')
    process.exit(1);
    }
}


module.exports = connectDB;