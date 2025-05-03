import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("https://mern-ecommerce-2-o31y.onrender.com/api/users/logout", {}, { withCredentials: true });
      document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Client-side clear
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;