const {Notification} = require("../model/notification")
const {getIO,  getOnlineUsers} = require("./socketHandler")
async function sendNotification(senderId,receiverId,type,message) {

  try {
    const notification = await Notification.create({
      sender: senderId,
      receiver: receiverId,
      notifyType: type,
      content: message,
  });

  const io = getIO()
  const onlineUsers = getOnlineUsers()

  const receiverSocket = onlineUsers.get(receiverId.toString())

  receiverSocket.forEach(socketId => {
    io.to(socketId).emit("getNotification",{
      sender: senderId,
      receiver: receiverId,
      notifyType: type,
      content: message,
      createdAt: notification.createdAt
      
    })
  });
  return notification

 
  } catch (error) {
  console.log(`Notification error: ${error.message}`);   
  } 
}

module.exports = {
  sendNotification
}


