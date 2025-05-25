import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiUser, FiCalendar, FiLock, FiEdit, FiShoppingBag, FiChevronDown, FiUpload } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", password: "", profileImage: "" });
  const [activeTab, setActiveTab] = useState("profile");
  const [imageFile, setImageFile] = useState(null);
  const backendURL = process.env.REACT_APP_BACKEND_URL;


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, ordersRes] = await Promise.all([
          axios.get(`${backendURL}/api/users/profile`, { withCredentials: true }),
          axios.get(`${backendURL}/api/orders`, { withCredentials: true }),
        ]);
        setUser(profileRes.data.data);
        setFormData({ name: profileRes.data.data.name, password: "", profileImage: profileRes.data.data.profileImage || "" });
        setOrders(ordersRes.data.data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleError = (err) => {
    const message = err.response?.data?.message || "Network error or server not responding";
    toast.error(message);
    if (err.response?.status === 401) navigate("/login");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result }); // Preview image locally
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return formData.profileImage; // Return existing image URL if no new file

    const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dbmsdibhu/image/upload"; // Replace YOUR_CLOUD_NAME
    const uploadPreset = "ml_default"; // Replace with your unsigned upload preset

    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(cloudinaryUrl, data);
      return response.data.secure_url; // Return the uploaded image URL
    } catch (err) {
      toast.error("Image upload failed");
      throw err;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = await uploadImageToCloudinary();
      const updatedFormData = { ...formData, profileImage: imageUrl };

      await axios.put(`${backendURL}/api/users/profile`, updatedFormData, {
        withCredentials: true,
      });
      toast.success(
        <div className="flex items-center">
          <FaCheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span>Profile updated successfully</span>
        </div>,
        { position: "bottom-right" }
      );
      setUser({ ...user, name: updatedFormData.name, profileImage: imageUrl });
      setFormData({ ...updatedFormData, password: "" });
      setImageFile(null); // Clear file input
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-10"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.div whileHover={{ scale: 1.05 }} className="relative mb-8">
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <motion.div
              whileHover={{ rotate: 90 }}
              className="absolute -bottom-3 -right-3 bg-white p-2 rounded-full shadow-md border border-gray-200"
            >
              <FiEdit className="text-indigo-600 w-5 h-5" />
            </motion.div>
          </motion.div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {user?.name || "Loading..."}
          </h1>
          <p className="text-lg text-gray-600">{user?.email || "user@example.com"}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1 shadow-lg border border-gray-100">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("profile")}
              className={`px-8 py-3 rounded-full font-semibold text-lg transition-all ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiUser className="inline mr-2 w-5 h-5" /> Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("orders")}
              className={`px-8 py-3 rounded-full font-semibold text-lg transition-all ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiShoppingBag className="inline mr-2 w-5 h-5" /> Orders
            </motion.button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-indigo-500 border-gray-200 rounded-full"
              />
            </div>
          ) : (
            <>
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-8 lg:p-12"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center">
                    <FiUser className="mr-3 text-indigo-600 w-7 h-7" /> Personal Information
                  </h2>

                  <form onSubmit={handleUpdate} className="space-y-8 max-w-xl mx-auto">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 text-lg shadow-sm"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed text-lg shadow-sm"
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                      <div className="relative">
                        <FiUpload className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full pl-12 pr-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 text-lg shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">New Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 text-lg shadow-sm"
                          placeholder="Leave blank to keep current password"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg text-lg disabled:opacity-50"
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Orders Tab (unchanged) */}
              {activeTab === "orders" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-8 lg:p-12"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center">
                    <FiShoppingBag className="mr-3 text-indigo-600 w-7 h-7" /> Order History
                  </h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-16">
                      <FiShoppingBag className="mx-auto text-6xl text-gray-300 mb-6" />
                      <h3 className="text-2xl font-medium text-gray-800 mb-3">No Orders Yet</h3>
                      <p className="text-gray-500 mb-8 text-lg">
                        You haven't placed any orders yet.
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to="/products"
                          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg text-lg"
                        >
                          Start Shopping
                          <FiChevronDown className="ml-2 w-5 h-5 transform rotate-90" />
                        </Link>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {orders.map((order) => (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          whileHover={{ y: -5 }}
                          className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all bg-white"
                        >
                          <div className="p-6 bg-gray-50 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Order #{order._id.substring(0, 8).toUpperCase()}
                                </p>
                                <p className="font-semibold text-gray-900 text-lg flex items-center">
                                  <FiCalendar className="mr-2 w-5 h-5 text-indigo-500" />
                                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <div className="flex flex-col items-start sm:items-end">
                                <span
                                  className={`px-4 py-1 rounded-full text-sm font-medium shadow-sm ${
                                    order.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "processing"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <p className="text-xl font-bold text-gray-900 mt-2">
                                  ₹{order.totalPrice.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <h4 className="font-semibold text-gray-900 mb-5 text-lg">Items Ordered</h4>
                            <div className="space-y-6">
                              {order.items.map((item) => (
                                <div key={item._id} className="flex items-start">
                                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                                    <img
                                      src={item.productImage || "https://via.placeholder.com/150"}
                                      alt={item.productTitle}
                                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                  </div>
                                  <div className="ml-5 flex-1">
                                    <h5 className="font-medium text-gray-900 text-lg line-clamp-2">
                                      {item.productTitle}
                                    </h5>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                  </div>
                                  <div className="ml-auto font-semibold text-gray-900 text-lg">
                                    ₹{(item.productPrice * item.quantity).toLocaleString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                              <Link
                                to={`/orders/${order._id}`}
                                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-md"
                              >
                                View Details
                                <FiChevronDown className="ml-2 w-5 h-5 transform rotate-90" />
                              </Link>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Footer (unchanged) */}
      <footer className="bg-gray-900 text-white pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-extrabold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  BazaarHub
                </span>
              </h3>
              <p className="text-gray-400 mb-6 text-lg">
                Your premier destination for quality products and exceptional shopping experiences.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h4 className="text-xl font-semibold mb-6 text-gray-200">Shop</h4>
              <ul className="space-y-4">
                {["All Products", "Electronics", "Clothing", "Home & Kitchen"].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/products${item === "All Products" ? "" : `/${item.toLowerCase().replace(" & ", "-")}`}`}
                      className="text-gray-400 hover:text-white transition-colors text-lg hover:pl-2"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h4 className="text-xl font-semibold mb-6 text-gray-200">Support</h4>
              <ul className="space-y-4">
                {["Contact Us", "FAQs", "Shipping", "Returns"].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className="text-gray-400 hover:text-white transition-colors text-lg hover:pl-2"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h4 className="text-xl font-semibold mb-6 text-gray-200">Newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-5 py-3 rounded-l-xl bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg shadow-md"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-r-xl hover:from-indigo-700 hover:to-purple-700 transition-colors text-lg shadow-md"
                >
                  Subscribe
                </motion.button>
              </form>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-500 text-lg"
          >
            <p>© {new Date().getFullYear()} BazaarHub. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;