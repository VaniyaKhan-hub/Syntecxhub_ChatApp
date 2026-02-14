const { User } = require("../model/user")
const { Notification } = require("../model/notification")
const { sendNotification } = require("../services/sendNotification")
const { Chat } = require("../model/chat");
const { Message } = require("../model/message");
const { getIO } = require("../services/socketHandler");

//========= Show All User =======
async function showUser(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const users = await User.find({
      _id: {
        $nin: [
          ...user.friends,
          ...user.receivedRequests,
          ...user.blockedUsers
        ]
      },
    });


    return res.status(200).json({
      success: true,
      loggedInUserId: userId,
      sentRequests: user.sentRequests,
      data: users,
    });

  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}



//========= send request =======

const sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);


    sender.sentRequests.push(receiverId);
    receiver.receivedRequests.push(senderId);

    await sender.save();
    await receiver.save();

    await sendNotification(
      senderId,
      receiverId,
      "friend_request",
      `${sender.name} sent you a friend request`
    );
    
    return res.status(200).json({ success: true, msg: "Friend request sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error sending request", error: err.message });
  }
};

// homeController.js
async function getFriendRequest(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("receivedRequests", "name email");

    if (!user) return res.status(404).json({ success: false, msg: "user not found" });

    return res.status(200).json({
      success: true,
      msg: "request fetch successful",
      loggedInUserId: userId,   // <-- add this line
      requests: user.receivedRequests,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
}

async function acceptRequest(req, res) {
  try {
    const recevierId = req.user.id
    const senderId = req.params.id

    const sender = await User.findById(senderId)
    const receiver = await User.findById(recevierId)

    if (!sender || !receiver) return res.status(404).json({ success: false, msg: "users not found" })

    sender.friends.push(recevierId)
    receiver.friends.push(senderId)

    sender.sentRequests = sender.sentRequests.filter(u => u.toString() !== recevierId.toString())
    receiver.receivedRequests = receiver.receivedRequests.filter(u => u.toString() !== senderId.toString())

    await sender.save()
    await receiver.save()

    await sendNotification(
      recevierId,
      senderId,
      "request_accepted",
      `${receiver.name} accepted your friend request`
    );


    return res.status(200).json({
      success: true,
      msg: "friend request successfull"
    })
  } catch (error) {
    await receiver.save()

    return res.status(500).json({
      success: false,
      msg: "internel server error",
      err: error.message
    })

  }
}

async function rejectRequest(req, res) {
  try {
    const receiverId = req.user.id
    const senderId = req.params.id

    const sender = await User.findById(senderId)
    const receiver = await User.findById(receiverId)

    if (!sender || !receiver) return res.status(404).json({ success: false, msg: "users not found" })

    sender.sentRequests = sender.sentRequests.filter(reqId => reqId.toString() !== receiverId.toString())
    receiver.receivedRequests = receiver.receivedRequests.filter(reqId => reqId.toString() !== senderId.toString())

    await sender.save()
    await receiver.save()

    return res.status(200).json({ success: true, msg: "request reject successfull" })

  } catch (error) {
    return res.status(500).json({ success: false, msg: "internal server error", err: error.message })

  }
}

async function friendList(req, res) {
  try {
    const loggedInUserId = req.user.id

    const user = await User.findById(loggedInUserId).populate("friends", "name email")
    if (!user) return res.status(404).json({ success: false, msg: "user not found" })

    return res.status(200).json({ success: true, friends: user.friends })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "internal server error",
      err: error.message
    })
  }
}

async function unfriend(req, res) {
  try {
    const loginUserId = req.user.id
    const friendId = req.params.id

    const user = await User.findById(loginUserId)
    const friend = await User.findById(friendId)

    user.friends = user.friends.filter(id => id.toString() !== friendId.toString())
    friend.friends = friend.friends.filter(id => id.toString() !== loginUserId.toString())

    await user.save()
    await friend.save()

    return res.status(200).json({ success: true, msg: "unfriend successfull" })



  } catch (error) {
    return res.status(500).json({ success: true, msg: "unfriend successfull" })

  }
}

async function cancelRequest(req, res) {
  try {
    const userId = req.user.id
    const sendRequestId = req.params.id



    const user = await User.findById(userId)
    const receiver = await User.findById(sendRequestId)


    if (!userId || !sendRequestId) return res.status(404).json({ success: false, msg: "user not found" })

    user.sentRequests = user.sentRequests.filter(id => id.toString() !== sendRequestId.toString())
    receiver.receivedRequests = receiver.receivedRequests.filter(id => id.toString() !== userId.toString())

    await user.save()
    await receiver.save()

    return res.status(200).json({
      success: true,
      msg: "request cancel successfull"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "internal server error",
      err: error.message
    })

  }

}

async function blockUser(req, res) {
  try {
    const loginUserId = req.user.id; 
    const blockUserId = req.params.id;

    const loginUser = await User.findById(loginUserId);
    const blockUser = await User.findById(blockUserId);

    if (!loginUser || !blockUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    
    loginUser.receivedRequests = loginUser.receivedRequests.filter(
      (id) => id.toString() !== blockUserId.toString()
    );

    
    blockUser.sentRequests = blockUser.sentRequests.filter(
      (id) => id.toString() !== loginUserId.toString()
    );

    
    if (!loginUser.blockedUsers.some(id => id.toString() === blockUserId.toString())) {
      loginUser.blockedUsers.push(blockUserId);
    }

    await loginUser.save();
    await blockUser.save();

    return res.status(200).json({ success: true, msg: "User blocked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Internal server error" });
  }
}

async function showBlockUser(req, res) {
  try {
    const loggedInUserId = req.user.id

    const user = await User.findById(loggedInUserId).populate("blockedUsers", "name email")
    if (!user) return res.status(404).json({ success: false, msg: "user not found" })

    return res.status(200).json({ success: true, blockedUsers: user.blockedUsers })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "internal server error",
      err: error.message
    })
  }
}

async function unblockUser(req, res) {
  try {
    const userId = req.user.id
    const blockUser = req.params.id

    const user = await User.findById(userId)

    if (!user) return res.status(404).json({ success: false, msg: "user not found" })
    user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== blockUser.toString())
    await user.save()

    return res.status(200).json({ success: true, msg: "user unblock successfull" })
  } catch (error) {
    return res.status(500).json({ success: false, msg: "internal server error", err: error.message })

  }
}

async function getNotifications(req, res) {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ receiver: userId })
      .populate("sender", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      loggedInUserId: userId,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error fetching notifications",
      err: error.message,
    });
  }
}

async function singleUser(req, res) {
  try {
    const userId = req.user.id
    
    const user = await User.findById(userId)
    
    if(!user) return res.status(404).json({success:false,msg:"user not found"})

    return res.status(200).json({
      success:true,
      data:user
    })
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      msg:"internal server error",
      err:error
    })

  }

}


async function createChat(req,res) {

   try {
    const userId = req.user.id;  
    const friendId = req.params.friendId;


    let chat = await Chat.findOne({
      members: { $all: [userId, friendId] }
    });

    
    if (!chat) {
      chat = await Chat.create({
        members: [userId, friendId]
      });
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Chat error",err:error.message });
  }
}

async function sendMessage(req,res) {
  try {
    const { chatId, text } = req.body;
    const senderId = req.user.id;

    // console.log("sendMsg",req.body)
    
    const message = await Message.create({
      chatId,
      sender: senderId,
      text
    });

    
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
      updatedAt: Date.now()
    });

    
    const io = getIO()
    io.to(chatId).emit("newMessage", message);

    res.json({ success: true, message });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Message failed",err:error.message });
  }
}


async function getMessage (req, res)  {
  try {
    const chatId = req.params.chatId;

    const messages = await Message.find({ chatId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to load messages" });
  }
};

module.exports = {
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
}

