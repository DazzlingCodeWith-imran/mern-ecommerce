import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for footer
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiLock, FiMapPin, FiArrowRight } from "react-icons/fi";

const Checkout = ({ cartItems }) => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("https://mern-ecommerce-2-o31y.onrender.com/api/users/check-auth", {
          withCredentials: true,
        });
        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate("/login");
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const total = cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  const handlePayment = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed");
      navigate("/login");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter a valid address");
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    try {
      const amountInPaise = total * 100;

      const response = await axios.post(
        "https://mern-ecommerce-2-o31y.onrender.com/api/payments/create-order",
        { amount: amountInPaise, address, items: cartItems },
        { withCredentials: true }
      );

      const orderId = response.data.order.id;
      const verifyResponse = await axios.post(
        "https://mern-ecommerce-2-o31y.onrender.com/api/payments/verify",
        { orderId },
        { withCredentials: true }
      );

      if (verifyResponse.data.success) {
        toast.success("Payment successful (dummy mode)!");
        navigate("/payment-success");
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Network error or server not responding");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
        {/* Background Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="p-8 md:p-12">
            {/* Header */}
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-extrabold text-gray-900 mb-8 text-center"
            >
              Checkout
            </motion.h2>

            {/* Cart Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 p-6 rounded-xl mb-8 shadow-inner"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center border-b border-gray-100 pb-3"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.productImage || "https://via.placeholder.com/50"}
                          alt={item.productTitle}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{item.productTitle}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-700">
                        ₹{(item.productPrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-lg font-bold text-indigo-600">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Address Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-28"
                />
              </div>
            </motion.div>

            {/* Pay Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={handlePayment}
                disabled={isLoading || !isAuthenticated || !address.trim()}
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 transition-all duration-300 ${
                  isLoading || !isAuthenticated || !address.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
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
                    Processing...
                  </>
                ) : (
                  <>
                    <FiLock className="text-xl" />
                    <span>Pay Now</span>
                    <FiArrowRight className="text-xl" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Security Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-gray-500 mt-6 text-sm"
            >
              <FiLock className="inline mr-1" /> Secured with SSL Encryption
            </motion.p>
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
    </>
  );
};

export default Checkout;