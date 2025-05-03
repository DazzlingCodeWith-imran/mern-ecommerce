import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Corrected import
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiPackage, FiCalendar, FiCheckCircle, FiClock, FiTruck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";

// Global context for orders
export const OrdersContext = React.createContext();

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token || !user) {
        console.log("No token or user found, redirecting to login");
        setOrders([]);
        setLoading(false);
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const processedOrders = (res.data.data || []).map((order) => ({
        ...order,
        createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
        formattedDate: order.createdAt
          ? moment(order.createdAt).format("MMMM D, YYYY h:mm A")
          : "Date not available",
        items: order.items.map((item) => ({
          ...item,
          productId: item.productId || {},
          productTitle: item.productId?.productTitle || "Unknown Product",
          productPrice: item.productId?.productPrice || 0,
          productImage: item.productId?.productImage || "https://via.placeholder.com/150",
          quantity: item.quantity || 1,
        })),
      })).sort((a, b) => b.createdAt - a.createdAt);

      setOrders(processedOrders);
    } catch (err) {
      console.error("Fetch orders error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Session expired, please login again");
        navigate("/login");
      } else {
        toast.error("Failed to fetch orders. Please try again later.");
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
      navigate("/login");
    }
  }, [isLoggedIn, user, navigate]);

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? true : order.status.toLowerCase() === filter.toLowerCase()
  );

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <FiCheckCircle className="text-green-500 text-xl" />;
      case "processing":
        return <FiClock className="text-yellow-500 text-xl" />;
      case "shipped":
        return <FiTruck className="text-blue-500 text-xl" />;
      default:
        return <FiPackage className="text-gray-500 text-xl" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <>
      <OrdersContext.Provider value={{ orders, fetchOrders }}>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
          {/* Background Decorations */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/5 left-1/5 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
            <div className="absolute bottom-1/5 right-1/5 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="p-8 md:p-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center space-x-4 mb-6 md:mb-0"
                  >
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full shadow-md">
                      <FiPackage className="text-white text-2xl" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                      Order History
                    </h1>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex space-x-2 bg-gray-100 p-1 rounded-full shadow-inner"
                  >
                    {["all", "processing", "shipped", "completed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-5 py-2 text-sm font-semibold rounded-full capitalize transition-all duration-300 ${
                          filter === status
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </motion.div>
                </div>

                {/* Orders or No Orders */}
                {filteredOrders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-20"
                  >
                    <FiPackage className="text-gray-300 text-8xl mx-auto mb-6 animate-bounce" />
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                      {filter === "all" ? "No Orders Yet" : `No ${filter} Orders`}
                    </h3>
                    <p className="text-gray-500 mb-8 text-lg">
                      {filter === "all"
                        ? "Start exploring our collection to place your first order!"
                        : `You don’t have any ${filter} orders at the moment.`}
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button
                        onClick={() => navigate("/products")}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        Shop Now
                      </button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    <AnimatePresence>
                      {filteredOrders.map((order) => (
                        <motion.div
                          key={order._id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                        >
                          <div className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                {getStatusIcon(order.status)}
                                <div>
                                  <span className="font-semibold text-gray-800 capitalize text-lg">
                                    {order.status || "Unknown"}
                                  </span>
                                  <p className="text-sm text-gray-500">
                                    Order #{order._id?.substring(0, 8).toUpperCase() || "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col sm:items-end">
                                <div className="flex items-center text-gray-600 mb-1">
                                  <FiCalendar className="mr-2" />
                                  <span className="text-sm">{order.formattedDate}</span>
                                </div>
                                <div className="text-lg font-bold text-indigo-600">
                                  ₹{order.totalPrice?.toLocaleString() || "N/A"}
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-inner">
                              <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                                Order Items
                              </h4>
                              <div className="space-y-4">
                                {order.items.map((item) => (
                                  <motion.div
                                    key={item._id || item.productId?._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0"
                                  >
                                    <div className="flex items-center space-x-4">
                                      <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                                        <img
                                          src={item.productImage}
                                          alt={item.productTitle}
                                          className="w-full h-full object-cover"
                                          onError={(e) =>
                                            (e.target.src = "https://via.placeholder.com/150")
                                          }
                                        />
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {item.productTitle}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          Qty: {item.quantity} × ₹
                                          {item.productPrice.toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="font-semibold text-gray-700">
                                      ₹{(item.productPrice * item.quantity).toLocaleString()}
                                    </p>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Footer */}
        <footer className="bg-gray-900 text-white pt-16 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <h3 className="text-3xl font-extrabold mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    BazaarHub
                  </span>
                </h3>
                <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                  Your ultimate destination for premium products and seamless shopping.
                </p>
                <div className="flex space-x-6">
                  {["facebook", "twitter", "instagram"].map((platform) => (
                    <a
                      key={platform}
                      href="#"
                      className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                    >
                      <svg
                        className="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        {platform === "facebook" && (
                          <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                          />
                        )}
                        {platform === "twitter" && (
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        )}
                        {platform === "instagram" && (
                          <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clipRule="evenodd"
                          />
                        )}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-6 text-gray-200">Shop</h4>
                <ul className="space-y-4">
                  {[
                    "All Products",
                    "Electronics",
                    "Clothing",
                    "Home & Kitchen",
                    "Beauty",
                  ].map((category) => (
                    <li key={category}>
                      <Link
                        to={`/products${category === "All Products" ? "" : `/${category.toLowerCase()}`}`}
                        className="text-gray-400 hover:text-white transition-all duration-300 text-lg hover:pl-2"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-6 text-gray-200">
                  Customer Service
                </h4>
                <ul className="space-y-4">
                  {["Contact Us", "FAQs", "Shipping Policy", "Returns & Exchanges", "Privacy Policy"].map((item) => (
                    <li key={item}>
                      <Link
                        to={`/${item.toLowerCase().replace(/ & /g, "-").replace(" ", "")}`}
                        className="text-gray-400 hover:text-white transition-all duration-300 text-lg hover:pl-2"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-6 text-gray-200">Newsletter</h4>
                <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                  Stay updated with exclusive offers and new arrivals.
                </p>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-grow px-5 py-3 rounded-l-xl bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-r-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-lg"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-lg">
              <p>© {new Date().getFullYear()} BazaarHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </OrdersContext.Provider>
    </>
  );
};

export default Orders;