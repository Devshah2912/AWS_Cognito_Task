import { useState } from "react";
import "./RegistrationForm.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordErrorFromAws, setPasswordErrorFromAws] = useState(true);
  // const [userExistError, setUserExistError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password === formData.confirmPassword) {
      setPasswordMatch(true);
      try {
        console.log("Form submitted", formData);
        const res = await axios.post(
          "http://localhost:8000/user/createUser",
          formData
        );

        console.log(res.data.message);

        //  success
        toast.success("User successfully registered!", {
          position: "top-right",
          autoClose: 3000,
        });
        localStorage.setItem("email", formData.email);

        setTimeout(() => {
          navigate("/welcome"); // Redirect to welcome page
        }, 3000);
      } catch (error) {
        console.error("Error:", error.response);

        if (
          error.response.data.detail ===
          "An error occurred (InvalidPasswordException) when calling the SignUp operation: Password did not conform with policy: Password not long enough"
        ) {
          setPasswordErrorFromAws(false);
          toast.error("Password does not meet security requirements!", {
            position: "top-right",
            autoClose: 3000,
          });
        }

        if (
          error.response.data.detail ===
          "User already exists Please try with different Email"
        ) {
          toast.error("User already exists! Try a different email.", {
            position: "top-right",
            autoClose: 3000,
          });
        }

        toast.error("User registration failed!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      console.log("Check Password Again");
      setPasswordMatch(false);
      setPasswordErrorFromAws(true);
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Register</h2>
        <span className="trying">Full Name</span>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <span className="trying">Email Address</span>
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <span className="trying">Phone Number</span>
        <input
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
          pattern="\d{10}"
          title="Please enter a 10-digit phone number"
          required
        />
        <span className="trying">Password</span>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="off"
          required
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
          title="Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
        />
        <span className="trying">Confirm Password</span>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        {!passwordMatch && (
          <p className="manage-password">Password is not matching</p>
        )}
        {!passwordErrorFromAws && (
          <p className="manage-password">
            The password must be a combination of capital letters, small
            letters, and special symbols.
          </p>
        )}
        <button type="submit">Submit</button>
        <Link to="/login">Already have an account?</Link>
      </form>

      <ToastContainer />
    </div>
  );
};
