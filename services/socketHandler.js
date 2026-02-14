const {Server} = require("socket.io")
let io;
let onlineUsers = new Map()

function setupSocket(server) {
  io = new Server(server,{
    cors:{
      origin: "http://localhost:5173",
      credentials: true,
    }
  })

  io.on("connection",(socket) => {
    console.log(`User connect: ${socket.id}`)
    


    // USER JOIN LIST

    socket.on("addUser",(userId) => {
      if(onlineUsers.has(userId)){
        onlineUsers.get(userId).push(socket.id)
      }else{
        onlineUsers.set(userId,[socket.id])
      }
      console.log(`User added:${userId} =>  socketId${onlineUsers.get(userId)}`)
    });

    // create room for specific chat
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat room: ${chatId}`);
    });

    socket.on("disconnect", () => {
      for(let [key,sIds] of onlineUsers.entries()){
        const filtered = sIds.filter(id => id !== socket.id)
        if(filtered.length > 0){
          onlineUsers.set(key,filtered)
        }else{
          onlineUsers.delete(key)
        }
      }
      console.log(`User disconnected: ${socket.id}`);
    })
  });
  
}

function getIO() {
  return io
}
function getOnlineUsers() {
  return onlineUsers
}

module.exports = {
  setupSocket,
  getIO,
  getOnlineUsers
}
