import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FiHeart, FiShoppingCart, FiEye, FiX, FiChevronLeft, FiChevronRight, FiFilter, FiStar } from "react-icons/fi";
const backendURL = process.env.REACT_APP_BACKEND_URL;

const CategoryPage = () => {
  const { slug } = useParams();
  const { addToCart, addToWishlist, cartItems, wishlist } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("price-asc");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const [sortField, sortOrder] = sort.split("-");
        const res = await axios.get(`${backendURL}/api/products`, {
          params: {
            category: slug,
            limit: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
            sortField,
            sortOrder,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
          },
        });
        setProducts(res.data.data.products || []);
        setTotalPages(Math.ceil((res.data.data.total || 0) / itemsPerPage));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch category products:", err);
        toast.error("Failed to load products");
        setProducts([]);
        setTotalPages(1);
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [slug, page, sort, priceRange]);

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

  const sortOptions = [
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Most Popular", value: "popularity-desc" },
    { label: "Newest First", value: "createdAt-desc" },
    { label: "Best Rated", value: "rating-desc" },
  ];

  const isInCart = (productId) => {
    return cartItems?.some(item => item._id === productId) || false;
  };

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
                    onClick={() => handleAddToWishlist(product)}
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
    <>
    
    
    
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <Link to="/products" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">Products</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 capitalize">{slug}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 capitalize">{slug}</span> Collection
            </h2>
            <p className="text-lg text-gray-600">Discover our premium selection of {slug} products</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FiFilter className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>
            
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm font-medium"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Refine Your Search</h3>
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Price Range</h4>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-gray-600">₹{priceRange[0].toLocaleString()}</span>
                  <span className="text-gray-600">₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Filters</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setPriceRange([0, 1000])}
                    className={`px-6 py-3 rounded-xl border-2 text-center font-medium transition-all ${
                      priceRange[1] <= 1000 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Under ₹1,000
                  </button>
                  <button 
                    onClick={() => setPriceRange([1000, 5000])}
                    className={`px-6 py-3 rounded-xl border-2 text-center font-medium transition-all ${
                      priceRange[0] >= 1000 && priceRange[1] <= 5000
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ₹1,000 - ₹5,000
                  </button>
                  <button 
                    onClick={() => setPriceRange([5000, 10000])}
                    className={`px-6 py-3 rounded-xl border-2 text-center font-medium transition-all ${
                      priceRange[0] >= 5000 && priceRange[1] <= 10000
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ₹5,000 - ₹10,000
                  </button>
                  <button 
                    onClick={() => setPriceRange([10000, 20000])}
                    className={`px-6 py-3 rounded-xl border-2 text-center font-medium transition-all ${
                      priceRange[0] >= 10000
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Over ₹10,000
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(itemsPerPage)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-6"></div>
                <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded-full w-1/2 mb-6"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-2xl font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-500 text-lg">Try adjusting your filters or search term</p>
            <button
              onClick={() => {
                setPriceRange([0, 10000]);
                setSort("price-asc");
              }}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg mt-6 text-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const isWishlisted = wishlist.some(item => item._id === product._id);
              return (
                <div
                  key={product._id}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-2"
                >
                  <div className="relative mb-6">
                    <div className="aspect-square overflow-hidden rounded-xl bg-gray-50">
                      <img
                        src={product.productImage || "https://via.placeholder.com/500"}
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
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <FiHeart className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
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

                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-3">
                    <Link to={`/products/${product._id}`} className="hover:text-blue-600 transition-colors">
                      {product.productTitle}
                    </Link>
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

                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all text-lg ${
                        isInCart(product._id)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                      }`}
                    >
                      {isInCart(product._id) ? 'Added to Cart' : 'Add to Cart'}
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

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-16 gap-6">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * itemsPerPage, products.length + (page - 1) * itemsPerPage)}</span> of{' '}
              <span className="font-medium">{(totalPages * itemsPerPage).toLocaleString()}</span> results
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
              >
                <FiChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>
              
              <div className="hidden md:flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
              >
                Next
                <FiChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
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

export default CategoryPage;