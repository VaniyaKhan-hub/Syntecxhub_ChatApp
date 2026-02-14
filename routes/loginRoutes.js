const express  = require("express")
const {checkUserLogin} = require("../middleware/checkLogin")
const route = express.Router()

// login
const {
    register,
    login,
    logOut,
} = require("../controller/loginController")


//home
const {
    showUser,
    sendRequest,
    getFriendRequest,
    acceptRequest,
    rejectRequest,
    friendList,
    unfriend,
    cancelRequest,
    blockUser,
    showBlockUser,
    unblockUser,
    getNotifications,
    singleUser,
    createChat,
    sendMessage,
    getMessage
} = require("../controller/homeController")


//======Login routes======
route.post("/register",register)
route.post("/login",login)
route.get("/logout",logOut)

//======Home routes======
route.get("/home",checkUserLogin,showUser)
route.get("/friend-list",checkUserLogin,friendList)

//======Request routes======
route.get("/send-request/:id",checkUserLogin,sendRequest)
route.get("/reject-request/:id",checkUserLogin,rejectRequest)
route.get("/cancel-request/:id",checkUserLogin,cancelRequest)
route.get("/friend-request",checkUserLogin,getFriendRequest)
route.get("/accept-request/:id",checkUserLogin,acceptRequest)
route.get("/unfriend/:id",checkUserLogin,unfriend)
route.get("/block-user/:id",checkUserLogin,blockUser)
route.get("/block-users", checkUserLogin, showBlockUser);
route.get("/unblock/:id",checkUserLogin,unblockUser)
route.get("/single-user",checkUserLogin,singleUser)

//======Notification routes======
route.get("/notifications", checkUserLogin, getNotifications);

//======Chats routes======
route.get("/chat/:friendId", checkUserLogin, createChat);
route.post("/send-message", checkUserLogin, sendMessage);
route.get("/get-messages/:chatId", checkUserLogin, getMessage);




module.exports={
    route
}