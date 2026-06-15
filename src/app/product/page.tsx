'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/chat/Chatbot';
import ProductCard from '@/components/product/ProductCard';
import seedData from '@/data/seedData.json';
import { useLang } from '@/context/LangContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Grid, 
  List, 
  SlidersHorizontal, 
  X, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Sliders,
  Check
} from 'lucide-react';

// Main page component wrapped in Suspense
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-primary-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <ShopCatalogContent />
    </Suspense>
  );
}

function ShopCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLang();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist, user } = useAuth();

  // Get queries from URL
  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';
  const urlSort = searchParams.get('sort') || 'default';

  // Component States
  const [productsList, setProductsList] = useState<any[]>(seedData.products);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [priceRange, setPriceRange] = useState<number>(65000); // Max price in seed is 64999
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [selectedSort, setSelectedSort] = useState(urlSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Load products from LocalStorage if they exist
  useEffect(() => {
    const localProducts = localStorage.getItem('ky_local_products');
    if (localProducts) {
      try {
        setProductsList(JSON.parse(localProducts));
      } catch (e) {
        console.error("Error parsing local products", e);
      }
    } else {
      localStorage.setItem('ky_local_products', JSON.stringify(seedData.products));
    }
  }, []);

  // Sync state with URL parameter changes
  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setSelectedSort(urlSort);
  }, [urlSort]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, priceRange, selectedRating, selectedSort]);

  // Handle price slider change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(Number(e.target.value));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange(65000);
    setSelectedRating('all');
    setSelectedSort('default');
    router.push('/product');
  };

  // AI query parser simulation
  // Parses queries like "laptops under 50000" or "headphones"
  const parseQuery = (query: string) => {
    const q = query.toLowerCase();
    let parsedText = `"${query}"`;
    let aiActive = false;
    let aiDetails: string[] = [];

    // Check for price constraints
    const underMatch = q.match(/under\s*(?:rs\.?|inr|₹)?\s*(\d+)/) || q.match(/less\s*than\s*(?:rs\.?|inr|₹)?\s*(\d+)/);
    let maxPriceLimit = 65000;
    if (underMatch) {
      maxPriceLimit = parseInt(underMatch[1]);
      aiActive = true;
      aiDetails.push(`Max Price: ₹${maxPriceLimit.toLocaleString()}`);
    }

    // Check for category keywords
    let catFilter = selectedCategory;
    if (q.includes('laptop') || q.includes('pc') || q.includes('computer') || q.includes('gaming setup')) {
      catFilter = 'electronics';
      aiActive = true;
      aiDetails.push('Category: Electronics');
    } else if (q.includes('headphone') || q.includes('earphone') || q.includes('audio')) {
      catFilter = 'electronics';
      aiActive = true;
      aiDetails.push('Category: Electronics');
    } else if (q.includes('watch') || q.includes('powerbank') || q.includes('charger') || q.includes('accessory')) {
      catFilter = 'mobile-accessories';
      aiActive = true;
      aiDetails.push('Category: Mobile Accessories');
    } else if (q.includes('sneaker') || q.includes('shoe') || q.includes('footwear')) {
      catFilter = 'footwear';
      aiActive = true;
      aiDetails.push('Category: Footwear');
    } else if (q.includes('clothing') || q.includes('hoodie') || q.includes('fashion') || q.includes('shirt')) {
      catFilter = 'fashion';
      aiActive = true;
      aiDetails.push('Category: Fashion');
    } else if (q.includes('chair') || q.includes('furniture') || q.includes('office')) {
      catFilter = 'furniture';
      aiActive = true;
      aiDetails.push('Category: Furniture');
    }

    return { aiActive, aiDetails, maxPriceLimit, catFilter };
  };

  const parsed = searchQuery ? parseQuery(searchQuery) : { aiActive: false, aiDetails: [], maxPriceLimit: 65000, catFilter: selectedCategory };

  // Filter products logic
  const filteredProducts = productsList.filter(product => {
    // 1. Category check (either manually selected or AI extracted)
    const categoryToMatch = searchQuery ? parsed.catFilter : selectedCategory;
    if (categoryToMatch !== 'all' && product.category !== categoryToMatch) return false;

    // 2. Search text check (excluding AI markers like "under 50000" to keep search fuzzy)
    if (searchQuery) {
      const cleanSearchQuery = searchQuery
        .replace(/under\s*(?:rs\.?|inr|₹)?\s*\d+/gi, '')
        .replace(/less\s*than\s*(?:rs\.?|inr|₹)?\s*\d+/gi, '')
        .trim()
        .toLowerCase();
      
      if (cleanSearchQuery) {
        const matchesTitle = product.title.toLowerCase().includes(cleanSearchQuery);
        const matchesDesc = product.description.toLowerCase().includes(cleanSearchQuery);
        const matchesSpecs = Object.entries(product.specs || {}).some(([key, val]: [string, any]) => 
          key.toLowerCase().includes(cleanSearchQuery) || String(val).toLowerCase().includes(cleanSearchQuery)
        );
        if (!matchesTitle && !matchesDesc && !matchesSpecs) return false;
      }
    }

    // 3. Price check (checks manually slider OR AI constraint, whichever is lower)
    const effectiveMaxPrice = Math.min(priceRange, parsed.maxPriceLimit);
    if (product.price > effectiveMaxPrice) return false;

    // 4. Rating check
    if (selectedRating !== 'all' && product.rating < selectedRating) return false;

    return true;
  });

  // Sort products logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === 'price-low') {
      return a.price - b.price;
    } else if (selectedSort === 'price-high') {
      return b.price - a.price;
    } else if (selectedSort === 'rating') {
      return b.rating - a.rating;
    } else if (selectedSort === 'name') {
      return a.title.localeCompare(b.title);
    } else {
      return 0; // Default
    }
  });

  // Pagination Logic
  const itemsPerPage = 8;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const handleWishlist = (productId: string) => {
    if (!user) {
      alert("Please login to manage your wishlist.");
      return;
    }
    toggleWishlist(productId);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* SHOP PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t('navShop')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Browse through our collection of premium quality products with smart filter choices.
            </p>
          </div>

          {/* AI query status overlay */}
          {parsed.aiActive && (
            <div className="glass flex items-center gap-2.5 px-4 py-2 border border-primary-blue-500/20 rounded-2xl animate-fadeIn">
              <span className="p-1.5 bg-primary-blue-500 text-white rounded-full">
                <Sparkles className="h-4 w-4 text-orange-300" />
              </span>
              <div className="text-xs">
                <p className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  AI Smart Filter Active
                </p>
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {parsed.aiDetails.map((detail, idx) => (
                    <span key={idx} className="bg-primary-blue-50 dark:bg-primary-blue-950/40 text-primary-blue-600 dark:text-primary-blue-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"
                aria-label="Clear Search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* CATALOG CONTENT GRID */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* SIDEBAR FILTERS (DESKTOP) */}
          <aside className="w-full lg:w-64 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm shrink-0 hidden lg:block sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4 mb-6">
              <span className="font-extrabold text-sm flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <SlidersHorizontal className="h-4 w-4 text-primary-blue-500" />
                Filters
              </span>
              {(selectedCategory !== 'all' || searchQuery !== '' || priceRange < 65000 || selectedRating !== 'all') && (
                <button 
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-accent-orange-500 hover:text-accent-orange-600 hover:underline transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Category</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`text-left text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-primary-blue-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  All Categories
                </button>
                {seedData.categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left text-sm px-3 py-1.5 rounded-lg font-medium transition-all flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-primary-blue-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] ${selectedCategory === cat.id ? 'text-slate-100' : 'text-slate-400'}`}>
                      {cat.itemCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6 border-t border-slate-50 dark:border-slate-700/50 pt-5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Max Price</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="300"
                  max="65000"
                  step="500"
                  value={priceRange}
                  onChange={handlePriceChange}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-blue-500"
                />
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>₹300</span>
                  <span className="bg-primary-blue-50 dark:bg-primary-blue-950/40 text-primary-blue-600 dark:text-primary-blue-400 px-2 py-1 rounded">
                    ₹{priceRange.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6 border-t border-slate-50 dark:border-slate-700/50 pt-5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Customer Rating</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedRating('all')}
                  className={`text-left text-xs px-3 py-2 rounded-lg font-medium transition-all ${
                    selectedRating === 'all'
                      ? 'bg-primary-blue-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  All Ratings
                </button>
                {[4.5, 4.0, 3.0].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setSelectedRating(stars)}
                    className={`text-left text-xs px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      selectedRating === stars
                        ? 'bg-primary-blue-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex text-amber-400 shrink-0">
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <span>{stars} & Up</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* MAIN PRODUCT CATALOG VIEW */}
          <div className="flex-grow w-full">
            
            {/* CATALOG TOOLBAR (Sort, layout grid, items count) */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Showing <span className="text-slate-900 dark:text-white font-extrabold">{indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)}</span> of <span className="text-slate-900 dark:text-white font-extrabold">{sortedProducts.length}</span> Results
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                {/* Mobile Filters trigger */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  <Sliders className="h-4 w-4" />
                  Filters
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">Sort By:</span>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 focus:outline-none"
                  >
                    <option value="default">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>

                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-900/60 shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-800 shadow-sm text-primary-blue-500'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-slate-800 shadow-sm text-primary-blue-500'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    aria-label="List view"
                  >
                    <List className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ACTIVE FILTER CHIPS */}
            {(selectedCategory !== 'all' || searchQuery !== '' || priceRange < 65000 || selectedRating !== 'all') && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mr-1">Active Filters:</span>
                
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700">
                    Category: {selectedCategory.replace('-', ' ')}
                    <button onClick={() => setSelectedCategory('all')}><X className="h-3 w-3 hover:text-red-500" /></button>
                  </span>
                )}
                
                {searchQuery !== '' && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')}><X className="h-3 w-3 hover:text-red-500" /></button>
                  </span>
                )}

                {priceRange < 65000 && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700">
                    Max Price: ₹{priceRange.toLocaleString()}
                    <button onClick={() => setPriceRange(65000)}><X className="h-3 w-3 hover:text-red-500" /></button>
                  </span>
                )}

                {selectedRating !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700">
                    Rating: {selectedRating}★ & Up
                    <button onClick={() => setSelectedRating('all')}><X className="h-3 w-3 hover:text-red-500" /></button>
                  </span>
                )}
              </div>
            )}

            {/* ZERO PRODUCTS STATE */}
            {sortedProducts.length === 0 && (
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-4 animate-fadeIn">
                <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Products Found</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm">
                    We couldn't find any products matching your specific filters. Try loosening filters or resetting search parameters.
                  </p>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-full font-bold text-xs transition-colors shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* PRODUCTS LIST/GRID CONTAINER */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentProducts.map((product) => {
                  const isWishlisted = isInWishlist(product.id);
                  const isAdded = addedItem === product.id;
                  
                  return (
                    <div 
                      key={product.id} 
                      className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row p-4 gap-6"
                    >
                      {/* Left side: Image */}
                      <Link href={`/product/detail?id=${product.id}`} className="relative w-full sm:w-48 h-48 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden shrink-0 block hover:opacity-95">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {product.discountPercent > 0 && (
                          <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-accent-orange-500 to-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full z-10 uppercase tracking-wider">
                            {product.discountPercent}% Off
                          </span>
                        )}
                      </Link>

                      {/* Right side: Info */}
                      <div className="flex-grow flex flex-col min-w-0 py-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {product.category.replace('-', ' ')}
                        </span>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-primary-blue-500 dark:group-hover:text-primary-blue-400 transition-colors mt-0.5 line-clamp-1">
                          <Link href={`/product/detail?id=${product.id}`}>{product.title}</Link>
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mt-2 shrink-0">
                          <div className="flex items-center text-amber-400">
                            <Star className="h-4.5 w-4.5 fill-current" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">({product.reviewsCount} reviews)</span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Specs overview */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {Object.entries(product.specs || {}).slice(0, 3).map(([key, val]: [string, any]) => (
                            <span key={key} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-bold px-2 py-1 rounded">
                              {key}: {val}
                            </span>
                          ))}
                        </div>

                        {/* Price, Wishlist, and Cart CTA */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-700/50 flex-wrap gap-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-slate-900 dark:text-slate-50">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.discountPercent > 0 && (
                              <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleWishlist(product.id)}
                              className={`p-2.5 rounded-xl border transition-colors ${
                                isWishlisted
                                  ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-900/50 dark:bg-red-950/20'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500'
                              }`}
                              aria-label="Wishlist Toggle"
                            >
                              <Star className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>
                            
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                product.stock === 0
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                  : isAdded
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-primary-blue-500 hover:bg-primary-blue-600 text-white'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Added to Cart
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="h-4 w-4" />
                                  Add to Cart
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PAGINATION BAR */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex gap-1.5">
                  {[...Array(totalPages)].map((_, i) => {
                    const pg = i + 1;
                    return (
                      <button
                        key={pg}
                        onClick={() => setCurrentPage(pg)}
                        className={`h-9 w-9 text-xs font-bold rounded-xl transition-all ${
                          currentPage === pg
                            ? 'bg-primary-blue-500 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* MOBILE FILTERS SIDE DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-fadeIn">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
          ></div>
          
          {/* Drawer container */}
          <div className="relative w-80 max-w-full bg-white dark:bg-slate-800 h-full p-6 shadow-2xl flex flex-col overflow-y-auto animate-slideLeft z-10">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4 mb-6">
              <span className="font-extrabold text-sm flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <SlidersHorizontal className="h-4 w-4 text-primary-blue-500" />
                Filters
              </span>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Category</h3>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMobileFiltersOpen(false);
                  }}
                  className={`text-left text-sm px-3 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-primary-blue-500 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {seedData.categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setMobileFiltersOpen(false);
                    }}
                    className={`text-left text-sm px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-primary-blue-500 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-slate-400">{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6 border-t border-slate-50 dark:border-slate-700/50 pt-5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Max Price</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="300"
                  max="65000"
                  step="500"
                  value={priceRange}
                  onChange={handlePriceChange}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-blue-500"
                />
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>₹300</span>
                  <span className="bg-primary-blue-50 dark:bg-primary-blue-950/40 text-primary-blue-600 dark:text-primary-blue-400 px-2 py-1 rounded">
                    ₹{priceRange.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-8 border-t border-slate-50 dark:border-slate-700/50 pt-5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Customer Rating</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSelectedRating('all');
                    setMobileFiltersOpen(false);
                  }}
                  className={`text-left text-xs px-3 py-2.5 rounded-lg font-medium transition-all ${
                    selectedRating === 'all'
                      ? 'bg-primary-blue-500 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  All Ratings
                </button>
                {[4.5, 4.0, 3.0].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => {
                      setSelectedRating(stars);
                      setMobileFiltersOpen(false);
                    }}
                    className={`text-left text-xs px-3 py-2.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      selectedRating === stars
                        ? 'bg-primary-blue-500 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <span>{stars} & Up</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleClearFilters}
              className="w-full mt-auto py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <Footer />
      <Chatbot />
    </>
  );
}
