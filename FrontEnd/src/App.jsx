import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { LoginForm } from "./components/LoginForm";
import { RegistrationForm } from "./components/RegistrationForm";
import { Welcome } from "./components/Welcome";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Configure AWS Amplify
Amplify.configure({
  Auth: awsExports.Auth,
});

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const userEmail = localStorage.getItem("email"); // Check if user email exists
  return userEmail ? children : <Navigate to="/login" />; // Redirect if not logged in
};

// Define Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <RegistrationForm />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/welcome",
    element: (
      <ProtectedRoute>
        <Welcome />
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
