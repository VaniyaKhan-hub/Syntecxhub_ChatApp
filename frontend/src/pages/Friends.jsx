import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/home.css";
import Navbar from "../components/Nav";
import { useNavigate } from "react-router-dom"; // 🔹 Add this for navigation

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate(); // 🔹 for redirecting to chat page

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("http://localhost:3000/friend-list", {
          withCredentials: true,
        });

        if (res.data.success) {
          setFriends(res.data.friends || []);
        } else {
          alert("Failed to fetch friends");
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    fetchFriends();
  }, []);

  async function handleUnfriend(id) {
    try {
      const res = await axios.get(`http://localhost:3000/unfriend/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        alert("Unfriend successful");
        setFriends((prev) => prev.filter((f) => f._id !== id));
      }
    } catch (error) {
      console.log(error);
      alert("Failed to unfriend");
    }
  }


  function handleChat(friendId) {

    navigate(`/chat/${friendId}`);
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-card">
        <div className="home-header">
          <h2>My Friends</h2>
        </div>

        {friends.length > 0 ? (
          <div className="user-list">
            {friends.map((friend) => (
              <div key={friend._id} className="user-card">
                <div className="user-info">
                  <img
                    src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${friend.name}`}
                    alt="avatar"
                    className="avatar"
                  />
                  <div>
                    <p className="user-name">{friend.name}</p>
                    <p style={{ color: "#aaa", fontSize: "13px" }}>
                      {friend.email}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>

                  <button
                    className="request-btn"
                    onClick={() => handleChat(friend._id)}
                  >
                    message
                  </button>


                  <button
                    className="reject-btn"
                    onClick={() => handleUnfriend(friend._id)}
                  >
                    Unfriend
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-users">You have no friends yet 😢</p>
        )}
      </div>
    </div>
  );
};

export default Friends;
