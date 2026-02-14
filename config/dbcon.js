const mongoose = require("mongoose")

async function connectdb() {
    try {
        
        await mongoose.connect("mongodb://127.0.0.1:27017/chat-app")
        console.log("db connect")
    } catch (error) {
        console.log("db not connect:",error)
        
    }
    
}


module.exports={
    connectdb
}