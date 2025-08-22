import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
      {},
      { withCredentials: true }
    );

    // Token / cookie clear
    document.cookie =
      "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    navigate("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};


  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;