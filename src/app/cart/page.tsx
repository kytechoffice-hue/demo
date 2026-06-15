'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/chat/Chatbot';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LangContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Percent, 
  ShieldCheck, 
  Truck, 
  Tag, 
  X,
  Sparkles
} from 'lucide-react';

export default function CartPage() {
  const { t } = useLang();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    coupon, 
    couponError, 
    applyCoupon, 
    removeCoupon, 
    subtotal, 
    discountAmount, 
    shippingFee, 
    taxAmount, 
    securityDepositTotal,
    total 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    const success = applyCoupon(couponInput);
    if (success) {
      setSuccessMsg(`Coupon ${couponInput.toUpperCase()} applied successfully!`);
      setCouponInput('');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Shipping progress indicator (Free shipping threshold is ₹1000)
  const shippingThreshold = 1000;
  const progressToFreeShipping = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remainingForFreeShipping = shippingThreshold - subtotal;

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full bg-slate-50 dark:bg-slate-900/40">
        
        {/* Cart Title Banner */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="h-7 w-7 text-primary-blue-500" />
            {t('cartTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review and adjust items in your cart before checking out.
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-3xl p-12 text-center shadow-sm max-w-md mx-auto my-12 flex flex-col items-center gap-5 animate-fadeIn">
            <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-450 text-slate-400">
              <ShoppingBag className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Cart is Empty</h2>
              <p className="text-sm text-slate-400 mt-1.5">
                Looks like you haven't added any products to your shopping cart yet.
              </p>
            </div>
            <Link 
              href="/product"
              className="w-full py-3 bg-primary-blue-500 hover:bg-primary-blue-600 text-white font-bold rounded-full text-sm transition-all hover:scale-102 flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* ACTIVE CART FLOW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 1. Items List (Left Grid Column) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free Shipping Alert Bar */}
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl p-5 shadow-sm">
                {subtotal >= shippingThreshold ? (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Truck className="h-4.5 w-4.5 animate-bounce" />
                    Congratulations! You qualify for **Free Delivery** across India.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-350">
                      Add <span className="font-extrabold text-accent-orange-500">₹{remainingForFreeShipping.toLocaleString()}</span> more to unlock **Free Shipping**.
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-accent-orange-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${progressToFreeShipping}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Items Card List */}
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-750">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    
                    {/* Item Image */}
                    <Link href={`/product/detail?id=${item.id.split('-')[0]}`} className="relative h-20 w-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shrink-0 hover:opacity-90 block">
                      <img src={item.image} alt={item.title} className="object-cover h-full w-full" />
                    </Link>

                    {/* Item Info */}
                    <div className="flex-grow min-w-0 text-center sm:text-left space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.category}</span>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-150 truncate hover:text-primary-blue-500">
                        <Link href={`/product/detail?id=${item.id.split('-')[0]}`}>{item.title}</Link>
                      </h3>
                      
                      {/* Price Breakdown */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                          ₹{item.price.toLocaleString()}
                          {item.rentalPeriod && <span className="text-[10px] text-slate-400 font-semibold lowercase"> / {item.rentalPeriod}</span>}
                        </span>
                        {item.originalPrice > item.price && !item.rentalPeriod && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                        )}
                      </div>

                      {/* Rental duration & security deposit badge info */}
                      {item.rentalPeriod && (
                        <div className="flex flex-col gap-1 mt-1 text-[10px]">
                          <span className="bg-orange-50 dark:bg-orange-950/20 text-accent-orange-500 font-black px-2 py-0.5 rounded border border-orange-100 dark:border-orange-900/30 w-fit uppercase tracking-wider">
                            Rental Listing
                          </span>
                          {item.securityDeposit && (
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                              Security Deposit: <strong className="text-slate-700 dark:text-slate-200">₹{item.securityDeposit.toLocaleString()}</strong>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quantity Selector & Action Controls */}
                    <div className="flex items-center gap-6 shrink-0 flex-wrap justify-center mt-3 sm:mt-0">
                      
                      {/* Qty Box */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-900/60">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-800 transition-colors"
                          aria-label="Reduce Quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-extrabold px-3 text-slate-800 dark:text-slate-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-800 transition-colors"
                          aria-label="Increase Quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Total cost of line item */}
                      <span className="text-sm font-black text-slate-950 dark:text-slate-50 w-20 text-center hidden sm:block">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Delete button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                        aria-label="Remove Item"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>

                    </div>

                  </div>
                ))}
              </div>

              {/* Coupon input form */}
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  Have a Promo Code?
                </h3>
                
                <form onSubmit={handleApplyCoupon} className="flex gap-2.5 max-w-sm">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. KYESTORE)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-grow px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-blue-500/50 uppercase font-semibold text-slate-700 dark:text-slate-200"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-950 dark:bg-slate-750 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm"
                  >
                    Apply
                  </button>
                </form>

                {/* Status messages */}
                {couponError && <p className="text-xs text-red-500 font-medium">{couponError}</p>}
                {successMsg && <p className="text-xs text-emerald-600 font-medium">{successMsg}</p>}

                {/* Coupon tags */}
                <div className="text-xs space-y-1 pt-1">
                  <p className="text-slate-400">Available codes to try:</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["WELCOME10", "KYESTORE", "FLASH20"].map((code) => (
                      <button
                        key={code}
                        onClick={() => {
                          applyCoupon(code);
                          setSuccessMsg(`Coupon ${code} applied successfully!`);
                          setTimeout(() => setSuccessMsg(''), 4500);
                        }}
                        className="bg-primary-blue-50 dark:bg-primary-blue-950/20 text-primary-blue-600 dark:text-primary-blue-400 hover:bg-primary-blue-100 hover:scale-102 border border-primary-blue-100 dark:border-primary-blue-900/50 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all uppercase flex items-center gap-1"
                      >
                        <Percent className="h-3 w-3" />
                        {code}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* 2. Order Summary (Right Grid Column) */}
            <div className="lg:col-span-4 space-y-4 sticky top-24">
              
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="font-extrabold text-sm border-b border-slate-100 dark:border-slate-700/50 pb-3 text-slate-800 dark:text-slate-100">
                  Order Summary
                </h3>

                {/* Prices list */}
                <div className="space-y-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-slate-800 dark:text-slate-200">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-450 animate-fadeIn">
                      <span className="flex items-center gap-1">
                        Promo: {coupon.code} ({coupon.discountPercent}%)
                        <button onClick={removeCoupon} className="p-0.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded"><X className="h-3 w-3" /></button>
                      </span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Estimated Shipping</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {shippingFee === 0 ? <span className="text-emerald-600 font-extrabold uppercase">Free</span> : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>GST (5%)</span>
                    <span className="text-slate-800 dark:text-slate-200">₹{taxAmount.toLocaleString()}</span>
                  </div>

                  {securityDepositTotal > 0 && (
                    <div className="flex justify-between items-center text-slate-655 text-slate-600 dark:text-slate-400">
                      <span>Security Deposit (Refundable)</span>
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold">₹{securityDepositTotal.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-4 text-slate-900 dark:text-slate-50">
                    <span className="text-sm font-extrabold">Order Total</span>
                    <span className="text-lg font-black">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link 
                  href="/checkout"
                  className="w-full py-3.5 bg-accent-orange-500 hover:bg-accent-orange-600 text-white font-extrabold rounded-full text-xs transition-all hover:scale-102 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 mt-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="border-t border-slate-50 dark:border-slate-700/50 pt-4 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                    <ShieldCheck className="h-4.5 w-4.5 text-primary-blue-500" />
                    Secure Transaction protection active
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
      <Chatbot />
    </>
  );
}
