'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LangContext';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    discountPercent: number;
    image: string;
    category: string;
    rating: number;
    reviewsCount: number;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const { addToCart } = useCart();
  const { t } = useLang();
  
  const [added, setAdded] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to manage your wishlist.");
      return;
    }
    toggleWishlist(product.id);
  };

  return (
    <div className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      
      {/* Discount Badge */}
      {product.discountPercent > 0 && (
        <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-accent-orange-500 to-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full z-10 shadow-sm uppercase tracking-wider">
          {product.discountPercent}% Off
        </span>
      )}

      {/* Wishlist Toggle Button */}
      <button 
        onClick={handleWishlist}
        className={`absolute top-3.5 right-3.5 p-2 rounded-full shadow-sm z-10 transition-all duration-200 ${
          isWishlisted 
            ? 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400' 
            : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-white dark:hover:bg-slate-900'
        }`}
        aria-label="Add to Wishlist"
      >
        <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image */}
      <Link href={`/product/detail?id=${product.id}`} className="block relative pt-[100%] bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
        <img 
          src={product.image} 
          alt={product.title} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
              Out of stock
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Category Label */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 block">
          {product.category.replace('-', ' ')}
        </span>

        {/* Title */}
        <Link href={`/product/detail?id=${product.id}`}>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm group-hover:text-primary-blue-500 dark:group-hover:text-primary-blue-400 line-clamp-2 min-h-[40px] mb-2 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating Section */}
        <div className="flex items-center gap-1.5 mb-3 shrink-0">
          <div className="flex items-center text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">({product.reviewsCount})</span>
        </div>

        {/* Price & Cart CTA */}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-slate-50 dark:border-slate-700/50 shrink-0">
          <div className="flex flex-col">
            {product.discountPercent > 0 && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-base font-extrabold text-slate-900 dark:text-slate-50">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 ${
              product.stock === 0
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : added
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-primary-blue-500 text-white hover:bg-primary-blue-600 shadow-sm hover:shadow-md'
            }`}
            aria-label="Add to Cart"
          >
            {added ? <Check className="h-4.5 w-4.5" /> : <ShoppingCart className="h-4.5 w-4.5" />}
          </button>
        </div>

      </div>

    </div>
  );
}
