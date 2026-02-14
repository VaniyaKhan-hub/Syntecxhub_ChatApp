import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/home.css";
import Navbar from "../components/Nav";

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:3000/friend-request", {
          withCredentials: true,
        });

        if (res.data.success) {
          setRequests(res.data.requests || []);
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
  }, []);

 
  async function handleAccept(id) {
    try {
      const res = await axios.get(`http://localhost:3000/accept-request/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        alert("Request accepted successfully");
        setRequests((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (error) {
      alert("Failed to accept request");
      console.log(error);
    }
  }

 
  async function handleReject(id) {
    try {
      const res = await axios.get(`http://localhost:3000/reject-request/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        alert("Request rejected successfully");
        setRequests((prev) => prev.filter((r) => r._id !== id));
        // setRequests(requests.filter((r) => r._id !== id));

      }
    } catch (error) {
      console.log(error);
      alert("Failed to reject request");
    }
  }

 
  async function handleBlock(id) {    
    try {
      const res = await axios.get(`http://localhost:3000/block-user/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        alert("User blocked successfully");
        
        setRequests((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block user");
    }
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-card">
        <div className="home-header">
          <h2>Friend Requests</h2>
        </div>

        {requests.length > 0 ? (
          <div className="user-list">
            {requests.map((req) => (
              <div key={req._id} className="user-card">
                <div className="user-info">
                  <img
                    src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${req.name}`}
                    alt="avatar"
                    className="avatar"
                  />
                  <div>
                    <p className="user-name">{req.name}</p>
                    <p style={{ color: "#aaa", fontSize: "13px" }}>{req.email}</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="request-btn" onClick={() => handleAccept(req._id)}>
                    Accept
                  </button>
                  <button className="reject-btn" onClick={() => handleReject(req._id)}>
                    Reject
                  </button>
                  <button
                    className="block-btn"
                    
                    onClick={() => handleBlock(req._id)}
                  >
                    Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-users">No friend requests yet</p>
        )}
      </div>
    </div>
  );
};

export default Requests;