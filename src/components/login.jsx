import React, { useState } from "react";
import logo from "../assets/Login/LoginImage.jpg";
import img1 from "../assets/Login/BrowserLogo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginCred, setLoginCred] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for each role individually
    if (loginCred === "superadmin" && password === "super123") {
      navigate("/sidebar");
    } else if (loginCred === "admin" && password === "admin123") {
      navigate("/admin");
    } else if (loginCred === "trainer" && password === "trainer123") {
      navigate("/trainer");
    } else if (loginCred === "trainee" && password === "trainee123") {
      navigate("/trainee");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="flex w-full justify-center items-center gap-8">
        <img src={logo} alt="Login Logo" className="rounded-3xl" width={450} />
        <div className="flex flex-col justify-center items-center space-y-1">
          <img src={img1} alt="Browser Logo" className="rounded-full" width={55} />
          <h1 className="text-2xl font-semibold">Why Global Services</h1>
          <h1 className="text-lg font-medium">Please enter your details</h1>
          <form onSubmit={handleSubmit} className="mt-3">
            <div className="flex flex-col gap-5">
              <input
                className="border-orange-200 border-b-2 mt-3 outline-none p-1"
                placeholder="User ID or Mail ID"
                type="text"
                size="35"
                name="loginCred"
                value={loginCred}
                onChange={(e) => setLoginCred(e.target.value)}
              />
              <input
                className="border-orange-200 border-b-2 mt-2 outline-none p-1"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="py-1 px-3 mt-9 bg-orange-400 font-bold text-white rounded-md hover:bg-orange-500 transition"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
