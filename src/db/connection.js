const mongoose= require("mongoose")
const uri =  "mongodb://127.0.0.1:27017/users"

mongoose.connect(uri)
.then(sucess=> {
    console.log("sucessfully connected to database")
})