import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom"; // Added Link import
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify"; // Added toast
const backendURL = process.env.REACT_APP_BACKEND_URL;


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // For redirect
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Auth state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/products/${id}`);
        const productData = res.data.data;
        setProduct(productData);
        setError("");

        // Update recently viewed in localStorage
        const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        const updatedViewed = [
          productData,
          ...recentlyViewed.filter((p) => p._id !== productData._id),
        ].slice(0, 10);
        localStorage.setItem("recentlyViewed", JSON.stringify(updatedViewed));
      } catch (err) {
        if (err.response && err.response.data) {
          setError(err.response.data.message || "Failed to fetch product");
        } else {
          setError("Network error or server not responding");
        }
      }
    };

    const checkAuth = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/users/check-auth`, {
          withCredentials: true,
        });
        setIsLoggedIn(response.data.success);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    fetchProduct();
    checkAuth();
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success("Item added to cart!");
  };

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row">
          <img
            src={product.productImage}
            alt={product.productTitle}
            className="w-full md:w-1/2 h-64 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{product.productTitle}</h2>
            <p className="text-gray-600 mb-4">{product.productDesc}</p>
            <p className="text-gray-800 font-bold mb-2">₹{product.productPrice}</p>
            <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
            <p className="text-sm text-gray-500 mb-4">Brand: {product.brand}</p>
            <button
              onClick={handleAddToCart}
              disabled={!isLoggedIn}
              className={`px-4 py-2 rounded text-white ${
                isLoggedIn ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 animate-fade-in">BazaarHub</h3>
            <p className="text-gray-400">
              Your one-stop shop for the best products at unbeatable prices.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-400 transition">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-400 transition">Cart</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-400 transition">Profile</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-400">Email: support@ecommerceapp.com</p>
            <p className="text-gray-400">Phone: +91 123-456-7890</p>
            <p className="text-gray-400">Address: 123 Shopping Lane, India</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">
          <p>© 2025 E-commerce App. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default ProductDetails;
