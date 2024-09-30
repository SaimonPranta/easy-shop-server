const mongoose= require("mongoose")
const dotenv = require("dotenv");
dotenv.config()
const uri =  "mongodb://127.0.0.1:27017/users"

// const uri =  `mongodb+srv://saimon_pranta:${process.env.MONGODB_USER_PASSWORD}@cluster0.e6somin.mongodb.net/users`


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

.then(success=> {
    console.log("Successfully connected to database")
})
