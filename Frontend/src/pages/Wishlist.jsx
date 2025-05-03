import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiTrash2, FiShoppingCart, FiHeart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  return (
<>

<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-3">
                <FiHeart className="text-red-500 text-2xl" />
                <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
              </div>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {wishlist.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-gray-200 text-7xl mb-6">
                  <FiHeart className="inline" />
                </div>
                <h3 className="text-2xl font-medium text-gray-700 mb-3">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-8">Save your favorite items for later</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/products" 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    Discover Products
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {wishlist.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="flex items-start space-x-5 w-full sm:w-auto">
                        <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={item.productImage || "https://via.placeholder.com/150"}
                            alt={item.productTitle}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{item.productTitle}</h3>
                          <p className="text-indigo-600 font-medium mt-1">₹{item.productPrice.toLocaleString()}</p>
                          <div className="mt-4 sm:hidden">
                            <div className="flex space-x-3">
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => addToCart(item)}
                                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700"
                              >
                                <FiShoppingCart className="mr-2" />
                                Add
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => removeFromWishlist(item._id)}
                                className="flex items-center justify-center p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                              >
                                <FiTrash2 />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center space-x-4 mt-4 sm:mt-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(item)}
                          className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 hover:shadow-md"
                        >
                          <FiShoppingCart className="mr-2" />
                          Add to Cart
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromWishlist(item._id)}
                          className="p-2.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                          title="Remove"
                        >
                          <FiTrash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {wishlist.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 p-6">
              <div className="max-w-md mx-auto text-center">
                <p className="text-gray-600 mb-4">Loved your selections? Don't wait too long!</p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/products"
                    className="inline-flex items-center px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-100 hover:shadow-sm transition-all"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
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

export default Wishlist;