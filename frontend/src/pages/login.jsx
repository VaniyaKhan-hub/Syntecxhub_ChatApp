import React, { useState } from "react";
import "../style/login.css"; 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData,
         [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
   const res = await axios.post("http://localhost:3000/login", formData, {
  withCredentials: true, 
})
    if(res.data.success){
      navigate("/home")
      
    }else{
      alert("login failed try again")
      navigate("/")
      
    }
  } catch (error) {
    console.log(error)
     alert("something went wrong")
    
   }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>

       
        <div className="link-container">
          <Link to="/register" className="register-link">
            Don’t have an account? <span>Register</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
