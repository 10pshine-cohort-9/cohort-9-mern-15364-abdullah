import React from "react";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const {user,logout} = useAuth();

  function handleLogout() {
    (logout(), navigate("/login"));
  }

  return (
    <div>
      <h1> DASHBOARD </h1>
      <h3>Welcome, {user?.full_name}!</h3>
      <h3>Email: {user?.email}</h3>
      <h3>
        <button onClick={handleLogout}>Logout</button>
      </h3>
    </div>
  );
};

export default Dashboard;
