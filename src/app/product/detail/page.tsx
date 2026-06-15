'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/chat/Chatbot';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LangContext';
import seedData from '@/data/seedData.json';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  ChevronLeft, 
  Calendar, 
  Info, 
  Check, 
  AlertTriangle,
  Plus,
  Minus,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-primary-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  );
}

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLang();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist, user } = useAuth();

  const productId = searchParams.get('id');
  
  // States
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedRentalPeriod, setSelectedRentalPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [productCategory, setProductCategory] = useState<'buy' | 'rent'>('buy');

  // Load product details
  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const localProducts = localStorage.getItem('ky_local_products');
    let loadedProduct = null;

    if (localProducts) {
      try {
        const parsed = JSON.parse(localProducts);
        loadedProduct = parsed.find((p: any) => p.id === productId);
      } catch (e) {
        console.error("Error parsing local products in detail page", e);
      }
    }

    if (!loadedProduct) {
      loadedProduct = seedData.products.find((p: any) => p.id === productId);
    }

    if (loadedProduct) {
      setProduct(loadedProduct);
      setProductCategory(loadedProduct.listingType || 'buy');
    }

    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-primary-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Product Not Found</h2>
          <p className="text-sm text-slate-400 max-w-xs">We couldn't locate the item you are looking for. It may have been removed or deleted.</p>
          <Link href="/product" className="px-6 py-2.5 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-full font-bold text-xs shadow-md">
            Return to Store
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  // Fallbacks for rental prices
  const priceDay = product.rentalPriceDay || Math.round(product.price * 0.05);
  const priceWeek = product.rentalPriceWeek || Math.round(product.price * 0.25);
  const priceMonth = product.rentalPriceMonth || Math.round(product.price * 0.80);
  const deposit = product.securityDeposit || Math.round(product.price * 0.30);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    
    const productToAdd = {
      ...product,
      // If renting, price reflects selected period
      price: productCategory === 'rent' 
        ? (selectedRentalPeriod === 'day' ? priceDay : selectedRentalPeriod === 'week' ? priceWeek : priceMonth)
        : product.price,
      rentalPeriod: productCategory === 'rent' ? selectedRentalPeriod : undefined,
      securityDeposit: productCategory === 'rent' ? deposit : undefined
    };

    addToCart(productToAdd, productCategory === 'rent' ? 1 : quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    if (!user) {
      alert("Please login to manage your wishlist.");
      return;
    }
    toggleWishlist(product.id);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* BACK NAVIGATION */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-blue-500 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </button>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {/* Left Column: Image showcase */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative pt-[85%] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-750/30 rounded-2xl overflow-hidden shadow-sm group">
              <img 
                src={product.image} 
                alt={product.title} 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-103" 
              />
              {productCategory === 'buy' && product.discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-accent-orange-500 to-red-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full z-10 shadow-sm uppercase tracking-wider">
                  {product.discountPercent}% Off
                </span>
              )}
              {productCategory === 'rent' && (
                <span className="absolute top-4 left-4 bg-primary-blue-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full z-10 shadow-sm uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Rental Listing
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Information & checkout widget */}
          <div className="md:col-span-6 space-y-6">
            
            {/* Header: Title, Category, Rating */}
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-blue-500 dark:text-primary-blue-400 bg-primary-blue-50 dark:bg-primary-blue-950/40 px-2.5 py-1 rounded-md border border-primary-blue-100 dark:border-primary-blue-900/40 w-fit block">
                {product.category.replace('-', ' ')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-2 pt-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 4.5) ? 'fill-current' : 'opacity-30'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.rating || 4.5}</span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-400 font-semibold">({product.reviewsCount || 12} Verified Customer Reviews)</span>
              </div>
            </div>

            {/* Product Category Selector Option */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Product Category</label>
              <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl gap-1.5 border border-slate-200/50 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setProductCategory('buy')}
                  className={`py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    productCategory === 'buy'
                      ? 'bg-white dark:bg-slate-800 text-primary-blue-500 dark:text-primary-blue-400 shadow-sm border border-slate-200/20 dark:border-slate-700/55'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  BUY PRODUCT
                </button>
                <button
                  type="button"
                  onClick={() => setProductCategory('rent')}
                  className={`py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    productCategory === 'rent'
                      ? 'bg-white dark:bg-slate-800 text-accent-orange-500 dark:text-accent-orange-400 shadow-sm border border-slate-200/20 dark:border-slate-700/55'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  RENTAL PRODUCT
                </button>
              </div>
            </div>

            {/* PRICING CONDITIONS ACCORDING TO USER BUSINESS TYPE RULES */}
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4 text-left">
              
              {productCategory === 'buy' ? (
                /* BUY PRODUCT VIEW */
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="text-sm text-slate-400 line-through">
                          MRP: ₹{product.originalPrice.toLocaleString()}
                        </span>
                        <span className="bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-400 font-black uppercase text-[9px] px-2 py-0.5 rounded border border-red-100 dark:border-red-900/40">
                          Save {product.discountPercent}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Availability Status */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-extrabold text-slate-450 text-slate-400">Availability Status:</span>
                    {product.stock > 0 ? (
                      <span className="text-emerald-600 font-black uppercase text-[10px] bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/35">
                        In Stock ({product.stock} left)
                      </span>
                    ) : (
                      <span className="text-red-500 font-black uppercase text-[10px] bg-red-50 dark:bg-red-950/30 px-2.5 py-0.5 rounded border border-red-100 dark:border-red-900/35">
                        Out Of Stock
                      </span>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  {product.stock > 0 && (
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-xs font-extrabold text-slate-450 text-slate-400">Quantity Selector:</span>
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-white dark:bg-slate-800">
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-slate-500"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-extrabold px-3 text-slate-800 dark:text-slate-200">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock))}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-slate-500"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* RENTAL PRODUCT VIEW */
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRentalPeriod('day')}
                      className={`p-3 border rounded-xl flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                        selectedRentalPeriod === 'day'
                          ? 'border-primary-blue-500 bg-primary-blue-500/5 text-slate-900 dark:text-white font-extrabold ring-1 ring-primary-blue-500'
                          : 'border-slate-200 dark:border-slate-750 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider font-extrabold">Rental Price Per Day</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">₹{priceDay.toLocaleString()}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRentalPeriod('week')}
                      className={`p-3 border rounded-xl flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                        selectedRentalPeriod === 'week'
                          ? 'border-primary-blue-500 bg-primary-blue-500/5 text-slate-900 dark:text-white font-extrabold ring-1 ring-primary-blue-500'
                          : 'border-slate-200 dark:border-slate-750 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider font-extrabold">Rental Price Per Week</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">₹{priceWeek.toLocaleString()}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRentalPeriod('month')}
                      className={`p-3 border rounded-xl flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                        selectedRentalPeriod === 'month'
                          ? 'border-primary-blue-500 bg-primary-blue-500/5 text-slate-900 dark:text-white font-extrabold ring-1 ring-primary-blue-500'
                          : 'border-slate-200 dark:border-slate-750 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider font-extrabold">Rental Price Per Month</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">₹{priceMonth.toLocaleString()}</span>
                    </button>
                  </div>

                  {/* Security Deposit information */}
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-xs flex justify-between items-center text-slate-655">
                    <span className="font-extrabold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-amber-500" />
                      Security Deposit
                    </span>
                    <span className="font-black text-slate-900 dark:text-white">₹{deposit.toLocaleString()}</span>
                  </div>

                  {/* Availability Status */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-extrabold text-slate-450 text-slate-405 text-slate-450">Availability Status:</span>
                    {product.stock > 0 ? (
                      <span className="text-emerald-600 font-black uppercase text-[10px] bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/35">
                        Available for Rent
                      </span>
                    ) : (
                      <span className="text-red-500 font-black uppercase text-[10px] bg-red-50 dark:bg-red-950/30 px-2.5 py-0.5 rounded border border-red-100 dark:border-red-900/35">
                        Currently Rented Out
                      </span>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Description details */}
            <div className="space-y-2 text-left">
              <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">Product Description</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {product.description || "No description provided for this catalog listing. Premium built structures and custom features align with KY Store parameters."}
              </p>
            </div>

            {/* Action buttons (Add to Cart / Rent, Add to Wishlist) */}
            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-grow py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  product.stock === 0
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                    : added
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : productCategory === 'rent'
                    ? 'bg-accent-orange-500 hover:bg-accent-orange-600 text-white shadow-orange-500/20'
                    : 'bg-primary-blue-500 hover:bg-primary-blue-600 text-white shadow-blue-500/20'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    {productCategory === 'rent' ? 'Rental Booked & Added' : 'Added to Cart'}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4.5 w-4.5" />
                    {productCategory === 'rent' ? 'Rent this Product' : 'Buy Now / Add to Cart'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className={`p-3.5 border rounded-xl transition-all cursor-pointer ${
                  isWishlisted
                    ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-950/20 dark:bg-red-950/10'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-50/20'
                }`}
                aria-label="Toggle Favorites Wishlist"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Spec Details list */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-700/50 text-left">
                <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(product.specs).map(([key, val]: [string, any]) => (
                    <div key={key} className="flex justify-between items-center py-2 px-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <span className="font-extrabold text-slate-400">{key}</span>
                      <span className="font-black text-slate-850 dark:text-slate-200">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />
      <Chatbot />
    </>
  );
}
