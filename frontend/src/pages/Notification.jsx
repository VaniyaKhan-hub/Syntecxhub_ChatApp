import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/home.css";
import Navbar from "../components/Nav";
import { io } from "socket.io-client";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:3000/notifications", {
          withCredentials: true,
        });
        if (res.data.success) {
          setNotifications(res.data.notifications || []);
          setUserId(res.data.loggedInUserId);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  // Initialize socket once userId is available
  useEffect(() => {
    if (userId) {
      const newSocket = io("http://localhost:3000", {
        withCredentials: true,
        transports: ["websocket"],
      });

      newSocket.emit("addUser", userId);

      newSocket.on("getNotification", (data) => {
        console.log(" New notification received:", data);
        setNotifications((prev) => [data, ...prev]);
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [userId]);

  // mark as read function remains same
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-card">
        <div className="home-header">
          <h2>Notifications</h2>
        </div>
        {notifications.length > 0 ? (
          <div className="user-list">
            {notifications.map((notif, idx) => (
              <div
                key={idx}
                className={`user-card ${notif.isRead ? "read" : "unread"}`}
              >
                <p>{notif.content}</p>
                <small>{new Date(notif.createdAt).toLocaleString()}</small>
                {!notif.isRead && (
                  <button
                    className="request-btn"
                    onClick={() => markAsRead(notif._id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-users">No notifications yet</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;