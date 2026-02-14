import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "../style/chat.css";
import Navbar from "../components/Nav";

const socket = io("http://localhost:3000", { withCredentials: true });

const ChatUI = () => {
  const { friendId } = useParams();
  const [chatId, setChatId] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null); 

  // Fetch logged-in user ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/single-user", {
          withCredentials: true,
        });
        if (res.data.success) {
          setUserId(res.data.data._id);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  
  useEffect(() => {
    async function fetchChat() {
      if (!userId) return; 

      try {
        const res = await axios.get(`http://localhost:3000/chat/${friendId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const id = res.data.chat._id;
          setChatId(id);
          fetchMessages(id);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchChat();
  }, [friendId, userId]);

  
  
    // ✅ Fetch messages
    async function fetchMessages(id) {
      try {
        const res = await axios.get(`http://localhost:3000/get-messages/${id}`, {
          withCredentials: true,
        });
  
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    }
    
  useEffect(() => {
    if (!chatId) return;

    socket.emit("joinChat", chatId);

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("newMessage");
  }, [chatId]);

  // ✅ Send message
  async function handleSend() {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/send-message",
        { chatId, text },
        { withCredentials: true }
      );

      if (res.data.success) {
        setText("");
      }
    } catch (error) {
      console.log("send:", error);
    }
  }

 return (
  <div className="chat-page">
    <Navbar />

    <div className="chat-container">
      <div className="chat-section">
        <div className="chat-header">
          <span>Friend</span>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <p style={{ color: "#aaa", textAlign: "center", marginTop: "20px" }}>
              No messages yet...
            </p>
          ) : (
            messages.map((msg) => {
              
              const isSent = msg.sender === userId || msg.sender?._id === userId;

              
              const senderName =
                msg.sender?.name || (isSent ? "You" : "Friend");

              return (
                <div
                  key={msg._id}
                  className={`message ${isSent ? "sent" : "received"}`}
                >
                  <strong>{senderName}: </strong>
                  <span>{msg.text}</span>
                </div>
              );
            })
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  </div>
);

};

export default ChatUI;
