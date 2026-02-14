import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "../style/nav.css";

const socket = io("http://localhost:3000");

const Navbar = () => {
  const location = useLocation();
  const [requestCount, setRequestCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  // ✅ Fetch logged-in user
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/single-user", {
        withCredentials: true,
      });
      if (res.data.success) {
        setUserName(res.data.data.name);
        setUserId(res.data.data._id);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // 🔹 Fetch friend requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:3000/friend-request", {
        withCredentials: true,
      });
      if (res.data.success) {
        setRequestCount(res.data.requests.length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRequests();
  }, []);

  useEffect(() => {
    if (userId) {
      socket.emit("addUser", userId);
      socket.on("getNotification", (data) => {
        if (data.type === "friend_request") {
          setRequestCount((prev) => prev + 1);
        }
      });
    }
    return () => socket.off("getNotification");
  }, [userId]);

  useEffect(() => {
    if (location.pathname === "/requests") {
      setRequestCount(0);
    }
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Friends", path: "/friend" },
    { name: "Requests", path: "/requests", badge: requestCount },
    { name: "Notifications", path: "/notification" },
    { name: "Block Users", path: "/block-user" },
  ];

  return (
    <nav className="nav-container">
      {/* 🔹 Avatar + Username */}
      <div className="nav-logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${userName}`}
          alt="avatar"
          className="avatar"
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <span>{userName ? userName : "Chat-App"}</span>
      </div>

      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.name}
              {item.badge > 0 && (
                <span className="badge-circle">{item.badge}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
