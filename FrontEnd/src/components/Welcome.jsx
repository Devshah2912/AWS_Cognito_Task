import { signOut } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Welcome = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("Successfully signed out");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("User registration failed!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="welcome-container">
      <h1>Welcome! You are Successfully Logged in</h1>
      <button onClick={handleSignOut} className="signout-button">
        Sign Out
      </button>
      <ToastContainer />
    </div>
  );
};
