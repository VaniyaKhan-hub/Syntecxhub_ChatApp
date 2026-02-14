import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/home.css";
import Navbar from "../components/Nav";

const BlockedUsers = () => {
  const [blocked, setBlocked] = useState([]);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/block-users", {
          withCredentials: true,
        });

        if (res.data.success) {
          setBlocked(res.data.blockedUsers || []);
        } else {
          alert("Failed to fetch blocked users");
        }
      } catch (err) {
        console.error("Error fetching blocked users:", err);
      }
    };

    fetchBlockedUsers();
  }, []);

  //  Unblock function
  async function handleUnblock(id) {
    try {
      const res = await axios.get(`http://localhost:3000/unblock/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        alert("User unblocked successfully");
        setBlocked(blocked.filter((b) => b._id !== id));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to unblock user");
    }
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-card">
        <div className="home-header">
          <h2>Blocked Users</h2>
        </div>

        {blocked.length > 0 ? (
          <div className="user-list">
            {blocked.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-info">
                  <img
                    src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${user.name}`}
                    alt="avatar"
                    className="avatar"
                  />
                  <div>
                    <p className="user-name">{user.name}</p>
                    <p style={{ color: "#aaa", fontSize: "13px" }}>
                      {user.email}
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    className="reject-btn"
                    onClick={() => handleUnblock(user._id)}
                  >
                    Unblock
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-users">No blocked users yet 🙂</p>
        )}
      </div>
    </div>
  );
};

export default BlockedUsers;
