import React, { useEffect, useState } from "react";
import logo from "../assets/Login/LoginImage.jpg";
import img1 from "../assets/Login/BrowserLogo.png";
import { useNavigate } from "react-router-dom";
import {  login } from "../services";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        

        const loginData = {
          email,
          password,
          role,
          latitude,
          longitude,
        };

        console.log("Login Data:", loginData);

        login(loginData)
          .then((response) => {
            console.log("Login Response:", response);

            if (response.data.status === true) {
              localStorage.setItem("authToken", response.data.data.token);
              const role = response.data.data.role.name
              setEmail("");
              setPassword("");
              setRole(role);

              console.log("User Role:", role);

              if (role === "SuperAdmin") {
                navigate("/sidebar/dashboard");
              } else if (role === "Admin") {
                navigate("/admin");
              } else if (role === "Employee") {
                navigate("/trainersidebar/dashboard");
              } else if (role === "Trainee") {
                navigate("/traineesidebar/dashboard");
              } else {
                navigate("/");
              }
            } else {
              alert(response.message || "Invalid credentials");
            }
          })
          .catch((error) => {
            console.error("Login failed:", error);
            alert(error.response.data.message);
          });
      },

      (error) => {
        console.error("Failed to fetch location:", error);
        alert("alert ta iru");
      },
      {
        enableHighAccuracy: true, 
            
      }
    );
  };

 

 

 

  return (
    <div className="h-screen flex justify-center">
      <div className="flex w-full justify-center items-center gap-12">
        <img src={logo} alt="Login Logo" className="rounded-3xl" width={450} />
        <div className="flex flex-col justify-center items-center space-y-1">
          <img
            src={img1}
            alt="Browser Logo"
            className="rounded-full"
            width={55}
          />
          <h1 className="text-2xl font-semibold">Why Global Services</h1>
          <h1 className="text-lg font-medium">Please enter your details</h1>
          <form onSubmit={handleSubmit} className="mt-3">
            <div className="flex flex-col gap-5">
              <input
                className="border-orange-200 border-b-2 mt-3 outline-none p-1"
                placeholder="User ID or Mail ID"
                type="text"
                size="35"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="border-orange-200 border-b-2 mt-2 outline-none p-1"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* <select
                className="border-orange-200 border-b-2 mt-2 outline-none p-1 bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="SuperAdmin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
                <option value="Trainee">Trainee</option>
              </select> */}
            </div>
            <div className="text-center ">
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
