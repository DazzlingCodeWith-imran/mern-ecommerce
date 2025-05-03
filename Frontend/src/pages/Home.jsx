import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { FiHeart, FiShoppingCart, FiEye, FiChevronLeft, FiChevronRight, FiStar, FiX } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const { cartItems = [], wishlist = [], addToCart, addToWishlist } = useContext(CartContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState(
    JSON.parse(localStorage.getItem("recentlyViewed")) || []
  );
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get("https://mern-ecommerce-2-o31y.onrender.com/api/products", {
          params: { limit: 12, sortField: "popularity", sortOrder: "desc" }
        });
        setFeaturedProducts(res.data.data.products || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast.error("Failed to load products");
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);
  

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(
      <div className="flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>{product.productTitle} added to cart!</span>
      </div>,
      {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      }
    );
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    const isWishlisted = wishlist.some(item => item._id === product._id);
    toast.info(
      <div className="flex items-center">
        {isWishlisted ? (
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
        <span>{product.productTitle} {isWishlisted ? "removed from wishlist" : "added to wishlist"}</span>
      </div>,
      { position: "bottom-right" }
    );
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
    appendDots: dots => (
      <div className="mt-8">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-gray-300 rounded-full hover:bg-blue-500 transition-colors"></div>
    ),
  };

  const categories = [
    { name: "Electronics", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80", slug: "electronics" },
    { name: "Fashion", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80", slug: "clothing" },
    { name: "Home Decor", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80", slug: "home-decor" },
    { name: "Books", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80", slug: "books" },
  ];

  const QuickViewModal = ({ product, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all z-10"
          aria-label="Close quick view"
        >
          <FiX className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="p-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-[450px]">
                <img 
                  src={product.productImage || "https://via.placeholder.com/800"}
                  alt={product.productTitle}
                  className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all">
                    <img
                      src={product.productImage || "https://via.placeholder.com/200"}
                      alt={`Product variant ${i}`}
                      className="w-full h-24 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-3">
                  {product.category || "Premium"}
                </span>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">{product.productTitle}</h2>
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-400 mr-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar 
                        key={star} 
                        className={`w-6 h-6 ${star <= (product.rating || 4) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews || 24} reviews)</span>
                  <span className="mx-3 text-gray-300">|</span>
                  <span className="text-green-600 text-sm font-medium">
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{(product.productPrice * (1 - (product.discount || 0) / 100)).toLocaleString()}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through ml-3">
                        ₹{product.productPrice.toLocaleString()}
                      </span>
                      <span className="ml-4 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        Save {product.discount}%
                      </span>
                    </>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description || "Premium quality product with excellent features and durability. Designed for comfort and long-lasting performance."}
                </p>

                {product.colorOptions && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Color</h4>
                    <div className="flex space-x-3">
                      {['Black', 'White', 'Blue', 'Red'].map(color => (
                        <button 
                          key={color}
                          className="w-10 h-10 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          style={{ backgroundColor: color.toLowerCase() }}
                          aria-label={`Select ${color} color`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {product.sizeOptions && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Size</h4>
                    <div className="flex flex-wrap gap-3">
                      {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <button
                          key={size}
                          className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-5">
                <div className="flex space-x-5">
                  <button
                    onClick={() => {
                      handleAddToCart(product);
                      onClose();
                    }}
                    className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all ${
                      isInCart(product._id)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isInCart(product._id) ? '✓ Added to Cart' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => {
                      handleAddToWishlist(product);
                    }}
                    className="p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <FiHeart className={`w-6 h-6 ${wishlist.some(item => item._id === product._id) ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
                  </button>
                </div>

                <Link
                  to={`/products/${product._id}`}
                  className="block text-center py-4 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors text-lg"
                  onClick={onClose}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen max-h-[800px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/40 to-transparent z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video> 
        <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Welcome to BazaarHub
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              Discover premium products with exclusive deals and fast delivery
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
              >
                Shop Now
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
              >
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Free Shipping",
                desc: "On all orders over ₹500",
                icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
                color: "from-blue-500 to-indigo-600"
              },
              {
                title: "Easy Returns",
                desc: "30-day return policy",
                icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
                color: "from-purple-500 to-indigo-600"
              },
              {
                title: "Secure Payments",
                desc: "100% protected transactions",
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                color: "from-green-500 to-teal-600"
              },
            ].map((highlight, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${highlight.color} flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={highlight.icon}></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{highlight.title}</h3>
                <p className="text-gray-600 text-lg">{highlight.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through our wide range of product categories
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 h-80"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <span className="inline-flex items-center text-lg font-medium text-blue-200 group-hover:text-white transition-colors">
                    Shop Now
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Trending</span> Now
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular products this week
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
                  <div className="w-full aspect-square bg-gray-200 rounded-xl mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-1/2 mb-6"></div>
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-2xl font-medium text-gray-900">No trending products</h3>
              <p className="mt-2 text-gray-500 text-lg">Check back later for our latest products</p>
            </div>
          ) : (
            <div className="relative">
              <Slider ref={sliderRef} {...sliderSettings} className="py-4">
                {featuredProducts.slice(0, 8).map((product) => {
                  const isWishlisted = wishlist.some(item => item._id === product._id);
                  return (
                    <div key={product._id} className="px-4">
                      <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-100 group">
                        <div className="relative mb-6 flex-grow">
                          <div className="aspect-square overflow-hidden rounded-xl bg-gray-50">
                            <img
                              src={product.productImage || "https://via.placeholder.com/500"}
                              alt={product.productTitle}
                              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>

                          {product.isNew && (
                            <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                              New
                            </span>
                          )}
                          {product.discount > 0 && (
                            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{product.discount}%
                            </span>
                          )}

                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 rounded-xl">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToWishlist(product);
                              }}
                              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors mr-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                              aria-label="Add to wishlist"
                            >
                              <FiHeart className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuickViewProduct(product);
                              }}
                              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                              aria-label="Quick view"
                            >
                              <FiEye className="w-6 h-6 text-gray-700" />
                            </button>
                          </div>
                        </div>

                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-3 h-16">
                            {product.productTitle}
                          </h3>

                          <div className="flex items-center mb-3">
                            <div className="flex text-yellow-400 mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FiStar
                                  key={star}
                                  className={`w-5 h-5 ${star <= (product.rating || 4) ? 'fill-current' : ''}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">({product.reviews || 24})</span>
                          </div>

                          <div className="mb-6">
                            <span className="text-xl font-bold text-gray-900">
                              ₹{(product.productPrice * (1 - (product.discount || 0) / 100)).toLocaleString()}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-lg text-gray-500 line-through ml-2">
                                ₹{product.productPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`w-full py-3 rounded-xl font-medium transition-colors text-lg ${
                            isInCart(product._id)
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                          }`}
                        >
                          {isInCart(product._id) ? '✓ Added to Cart' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </Slider>

              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 p-3 bg-white rounded-full shadow-xl hover:bg-gray-100 transition-colors hidden md:block"
                aria-label="Previous"
              >
                <FiChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 p-3 bg-white rounded-full shadow-xl hover:bg-gray-100 transition-colors hidden md:block"
                aria-label="Next"
              >
                <FiChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Featured
              </span>{" "}
              Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Carefully curated selection of our best products
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-pulse"
                >
                  <div className="w-full aspect-square bg-gray-200 rounded-xl mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-1/2 mb-6"></div>
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-2xl font-medium text-gray-900">
                No featured products
              </h3>
              <p className="mt-2 text-gray-500 text-lg">
                Check back later for our featured collection
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(4, 8).map((product) => {
                const isWishlisted = wishlist.some((item) => item._id === product._id);
                return (
                  <div
                    key={product._id}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group transform hover:-translate-y-2"
                  >
                    <div className="relative mb-6">
                      <div className="aspect-square overflow-hidden rounded-xl bg-gray-50">
                        <img
                          src={
                            product.productImage || "https://via.placeholder.com/500"
                          }
                          alt={product.productTitle}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>

                      {product.isNew && (
                        <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          New
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      )}

                      <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleAddToWishlist(product)}
                          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                          aria-label={
                            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                          }
                        >
                          <FiHeart
                            className={`w-6 h-6 ${
                              isWishlisted ? "text-red-500 fill-current" : "text-gray-700"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                          aria-label="Quick view"
                        >
                          <FiEye className="w-6 h-6 text-gray-700" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-3 h-16">
                      {product.productTitle}
                    </h3>

                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`w-5 h-5 ${
                              star <= (product.rating || 4) ? "fill-current" : ""
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product.reviews || 24})
                      </span>
                    </div>

                    <div className="mb-6">
                      <span className="text-xl font-bold text-gray-900">
                        ₹
                        {(
                          product.productPrice *
                          (1 - (product.discount || 0) / 100)
                        ).toLocaleString()}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-lg text-gray-500 line-through ml-2">
                          ₹{product.productPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all text-lg ${
                          isInCart(product._id)
                            ? "bg-green-100 text-green-700"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        }`}
                      >
                        {isInCart(product._id) ? "Added to Cart" : "Add to Cart"}
                      </button>
                      <Link
                        to={`/products/${product._id}`}
                        className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <FiEye className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              to="/products"
              className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
            >
              View All Products
              <svg
                className="ml-3 w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Recently{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Viewed
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your recently browsed products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentlyViewed.slice(0, 4).map((product) => {
                const isWishlisted = wishlist.some(
                  (item) => item._id === product._id
                );
                return (
                  <div
                    key={product._id}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group transform hover:-translate-y-2"
                  >
                    <div className="relative mb-6">
                      <div className="aspect-square overflow-hidden rounded-xl bg-gray-50">
                        <img
                          src={
                            product.productImage || "https://via.placeholder.com/500"
                          }
                          alt={product.productTitle}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>

                      {product.discount > 0 && (
                        <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      )}

                      <button
                        onClick={() => handleAddToWishlist(product)}
                        className="absolute top-4 left-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        aria-label={
                          isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                        }
                      >
                        <FiHeart
                          className={`w-6 h-6 ${
                            isWishlisted ? "text-red-500 fill-current" : "text-gray-700"
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-3 h-16">
                      {product.productTitle}
                    </h3>

                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`w-5 h-5 ${
                              star <= (product.rating || 4) ? "fill-current" : ""
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product.reviews || 24})
                      </span>
                    </div>

                    <div className="mb-6">
                      <span className="text-xl font-bold text-gray-900">
                        ₹
                        {(
                          product.productPrice *
                          (1 - (product.discount || 0) / 100)
                        ).toLocaleString()}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-lg text-gray-500 line-through ml-2">
                          ₹{product.productPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all text-lg ${
                          isInCart(product._id)
                            ? "bg-green-100 text-green-700"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        }`}
                      >
                        {isInCart(product._id) ? "Added to Cart" : "Add to Cart"}
                      </button>
                      <Link
                        to={`/products/${product._id}`}
                        className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <FiEye className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Customers</span> Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Amit Sharma",
                role: "Regular Customer",
                text: "The quality of products is exceptional and delivery is always on time. Highly recommended!",
                rating: 5,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              },
              {
                name: "Priya Patel",
                role: "First-time Buyer",
                text: "Great shopping experience with excellent customer support. Will definitely shop again!",
                rating: 4,
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              },
              {
                name: "Rahul Gupta",
                role: "Premium Member",
                text: "The exclusive deals for members are amazing. Saved over ₹5000 this year already!",
                rating: 5,
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400 mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`w-6 h-6 ${star <= testimonial.rating ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 italic text-lg mb-8">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xl">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-10 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
              <h3 className="text-3xl font-bold mb-4">Summer Sale</h3>
              <p className="text-xl mb-6">Up to 50% OFF on selected items</p>
              <Link
                to="/products/sale"
                className="inline-flex items-center px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
              >
                Shop Now
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-10 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
              <h3 className="text-3xl font-bold mb-4">Free Shipping</h3>
              <p className="text-xl mb-6">On all orders over ₹500</p>
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
              >
                Shop Now
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
            
            <div className="relative z-10 px-8 py-12 sm:p-16 text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Join Our Newsletter
                </h3>
                <p className="text-indigo-100 text-xl mb-8">
                  Stay updated with exclusive offers, new arrivals, and insider deals. Plus, get <span className="font-semibold text-white">10% off</span> your first order!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-gray-900 placeholder-gray-500 text-lg"
                    aria-label="Email address"
                  />
                  <button 
                    className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl whitespace-nowrap text-lg"
                  >
                    Subscribe Now
                    <svg 
                      className="w-5 h-5 ml-2 inline" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>
                
                <p className="text-indigo-100 text-sm mt-6">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brands Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Leading Brands</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We partner with the best brands to bring you quality products
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-12 items-center">
            {[
              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Apple_logo_grey.svg/1200px-Apple_logo_grey.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/2048px-HP_logo_2012.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sony_logo.png/800px-Sony_logo.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Levi%27s_logo.svg/2560px-Levi%27s_logo.svg.png",
            ].map((brandLogo, index) => (
              <img
                key={index}
                src={brandLogo}
                alt={`Brand ${index + 1}`}
                className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>
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

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
};

export default Home;