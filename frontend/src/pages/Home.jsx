import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/home.css";
import Navbar from "../components/Nav";
import { io } from "socket.io-client";

// ✅ Stable single socket connection
const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"],
});

const Home = () => {
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/home", {
          withCredentials: true,
        });

        if (res.data.success) {
          const loginUserId = res.data.loggedInUserId;

       
          socket.emit("addUser", loginUserId);
          // console.log("🟢 Socket user added:", loginUserId);

          setSentRequests(res.data.sentRequests || []);

          const filteredUsers = res.data.data.filter(
            (u) => u._id.toString() !== loginUserId
          );

          setUsers(filteredUsers);
        } else {
          window.location.href = "/";
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response && err.response.status === 401) {
          window.location.href = "/";
        }
      }
    };

    fetchUsers();

    
  }, []);

  // 🟢 Handle Send Request
  const handleRequest = async (id) => {
    try {
      setSentRequests((prev) => [...prev, id]);

      const res = await axios.get(`http://localhost:3000/send-request/${id}`, {
        withCredentials: true,
      });

      if (!res.data.success) {
        setSentRequests((prev) => prev.filter((reqId) => reqId !== id));
        alert(res.data.msg || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request", error);
      setSentRequests((prev) => prev.filter((reqId) => reqId !== id));
      alert("Failed to send request");
    }
  };

  // 🟡 Handle Cancel Request
  const handleCancelRequest = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/cancel-request/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setSentRequests((prev) => prev.filter((reqId) => reqId !== id));
      } else {
        alert(res.data.msg || "Failed to cancel request");
      }
    } catch (error) {
      console.error("Error canceling request", error);
      alert("Failed to cancel request");
    }
  };

  // 🔴 Logout (disconnect socket here)
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/logout", { withCredentials: true });
      socket.disconnect(); // ✅ disconnect on logout only
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-card">
        <div className="home-header">
          <h2>People You May Know</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="user-list">
          {users.length > 0 ? (
            users.map((user) => {
              const userId = user._id;

              return (
                <div key={userId} className="user-card">
                  <div className="user-info">
                    <img
                      src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${user.name}`}
                      alt="avatar"
                      className="avatar"
                    />
                    <span className="user-name">{user.name}</span>
                  </div>

                  <button
                    className={`${
                      sentRequests.includes(userId)
                        ? "request-btn-sent"
                        : "request-btn"
                    }`}
                    onClick={() =>
                      sentRequests.includes(userId)
                        ? handleCancelRequest(userId)
                        : handleRequest(userId)
                    }
                  >
                    {sentRequests.includes(userId)
                      ? "Cancel Request"
                      : "Send Request"}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="no-users">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
