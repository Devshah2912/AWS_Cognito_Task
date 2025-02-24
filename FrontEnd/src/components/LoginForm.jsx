/* eslint-disable react/no-unescaped-entities */
// import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "@aws-amplify/auth";
import "./LoginForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Logging in user...");
      const { email, password } = loginData;
      const user = await signIn({
        username: email,
        password,
        options: {
          authFlowType: "USER_SRP_AUTH",
        },
      });

      if (user) {
        console.log("Login successful", user);
        // Show success toast when user registers
        toast.success("User successfully Logged In!", {
          position: "top-right",
          autoClose: 2000,
        });
        localStorage.setItem("email", loginData.email);

        setTimeout(() => {
          navigate("/welcome"); // Redirect to welcome page
        }, 2000);
      }
    } catch (error) {
      console.error("Login error", error);
      //wrong creddentials
      toast.error("Credentials are wrong", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          <span className="trying">Email</span>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={loginData.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          <span className="trying">Password</span>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={loginData.password}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          <button type="submit" className="submit_button">
            Submit
          </button>
          <Link to="/">Don't have an Account?</Link>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};
