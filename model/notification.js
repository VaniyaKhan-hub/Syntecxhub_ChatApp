const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    notifyType:{
        type:String,        
        required:true,
    },
    content:{
        type:String,        
        required:true,
    },
    isRead:{
        type:Boolean,
        default:false
    },
},{timestamps:true})

const Notification = mongoose.model("Notification",notificationSchema)

module.exports = {
    Notification
}