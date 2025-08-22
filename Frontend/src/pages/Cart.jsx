import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiMapPin } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, setCart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/check-auth`, {
  withCredentials: true,
});
        setIsLoggedIn(response.data.success);
      } catch (error) {
        setIsLoggedIn(false);
        toast.error("Please login to view cart");
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const totalPrice = cart.reduce((total, item) => total + item.productPrice * item.quantity, 0);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to proceed with checkout");
      navigate("/login");
      return;
    }

    if (!address.trim()) {
      setError("Please enter your address");
      return;
    }

    setLoading(true);
    try {
     const orderRes = await axios.post(
  `${import.meta.env.VITE_BACKEND_URL}/orders`,
  {
    items: cart.map((item) => ({
      productId: item._id,
      productTitle: item.productTitle,
      productPrice: item.productPrice,
      quantity: item.quantity,
    })),
    totalPrice,
    address,
    paymentMethod: "Cash on Delivery",
    status: "Pending",
  },
  { withCredentials: true }
);


      if (orderRes.data.success) {
        setIsCheckoutComplete(true);
        setCart([]);
        localStorage.removeItem("cart");
        toast.success("Order placed successfully! You'll pay on delivery.");
        setTimeout(() => navigate("/orders"), 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (isCheckoutComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="inline-block mb-6"
          >
            <FaCheckCircle className="text-green-500 text-7xl" />
          </motion.div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Order Confirmed!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Your order has been placed successfully. Pay cash on delivery.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/orders"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-lg transition-all"
            >
              Track Order <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
        {/* Background Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/5 left-1/5 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/5 right-1/5 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Cart Items Section */}
            <div className="p-8 lg:p-12 bg-white">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-10"
              >
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Cart</h1>
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </span>
              </motion.div>

              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-20"
                >
                  <div className="text-gray-300 text-8xl mb-6 animate-bounce">🛒</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    Your Cart is Empty
                  </h3>
                  <p className="text-gray-500 mb-8 text-lg">
                    Explore our collection and add something amazing!
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/products"
                      className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      Start Shopping
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all shadow-sm"
                      >
                        <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg shadow-md">
                          <img
                            src={item.productImage}
                            alt={item.productTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {item.productTitle}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-gray-400 hover:text-red-500 transition-all duration-300"
                            >
                              <FiTrash2 size={20} />
                            </button>
                          </div>
                          <p className="text-indigo-600 font-semibold mt-1">
                            ₹{item.productPrice.toLocaleString()}
                          </p>
                          <div className="mt-3 flex items-center">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className={`p-2 rounded-full ${
                                item.quantity <= 1
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              <FiMinus size={18} />
                            </motion.button>
                            <span className="mx-4 text-gray-700 w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="p-2 rounded-full text-gray-600 hover:bg-gray-200"
                            >
                              <FiPlus size={18} />
                            </motion.button>
                            <div className="ml-auto font-semibold text-gray-800">
                              ₹{(item.productPrice * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Checkout Summary */}
            {cart.length > 0 && (
              <div className="p-8 lg:p-12 bg-gray-50 border-l border-gray-200">
                <motion.h2
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  Order Summary
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4 mb-8"
                >
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-indigo-600">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Address
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-4 text-gray-400" />
                    <textarea
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setError("");
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        error ? "border-red-300" : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-28`}
                      placeholder="Enter your complete shipping address"
                    />
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </motion.div>

                <motion.button
                  onClick={handleCheckout}
                  disabled={loading || !isLoggedIn || !address}
                  whileHover={!loading && isLoggedIn && address ? { scale: 1.05 } : {}}
                  whileTap={!loading && isLoggedIn && address ? { scale: 0.95 } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center transition-all duration-300 ${
                    loading || !isLoggedIn || !address
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Placing Order
                    </div>
                  ) : (
                    "Place COD Order"
                  )}
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 flex items-center justify-center space-x-2 text-gray-500"
                >
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-sm">Cash on Delivery Available</span>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Premium Footer */}
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
                {["All Products", "Electronics", "Clothing", "Home & Kitchen", "Beauty"].map(
                  (category) => (
                    <li key={category}>
                      <Link
                        to={`/products${category === "All Products" ? "" : `/${category.toLowerCase()}`}`}
                        className="text-gray-400 hover:text-white transition-all duration-300 text-lg hover:pl-2"
                      >
                        {category}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-gray-200">Customer Service</h4>
              <ul className="space-y-4">
                {["Contact Us", "FAQs", "Shipping Policy", "Returns & Exchanges", "Privacy Policy"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        to={`/${item.toLowerCase().replace(/ & /g, "-").replace(" ", "")}`}
                        className="text-gray-400 hover:text-white transition-all duration-300 text-lg hover:pl-2"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
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
    </>
  );
};

export default Cart;