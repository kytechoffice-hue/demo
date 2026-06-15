'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/chat/Chatbot';
import ProductCard from '@/components/product/ProductCard';
import seedData from '@/data/seedData.json';
import { useLang } from '@/context/LangContext';
import { 
  Laptop, 
  Shirt, 
  Apple, 
  Smartphone, 
  Tv, 
  Sparkles, 
  Footprints, 
  BookOpen, 
  Gamepad2, 
  Sofa,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Star,
  Download,
  Mail,
  CheckCircle2
} from 'lucide-react';

// Map icon names to Lucide icons
const iconMap: { [key: string]: any } = {
  Laptop,
  Shirt,
  Apple,
  Smartphone,
  Tv,
  Sparkles,
  Footprints,
  BookOpen,
  Gamepad2,
  Sofa
};

export default function HomePage() {
  const { t, lang } = useLang();
  
  // Timer state for Flash Sale (Set it to end in 12 hours from now)
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });
  
  // Newsletter subscription state
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Hero banner index
  const [activeBanner, setActiveBanner] = useState(0);

  // Products state (loads from localStorage if available, falls back to seedData.products)
  const [productsList, setProductsList] = useState<any[]>(seedData.products);

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

  // Banners data
  const banners = [
    {
      title: t('tagline'),
      subtitle: t('subtagline'),
      actionText: t('shopNow'),
      link: "/product",
      bgClass: "from-slate-900 via-primary-blue-700/80 to-accent-orange-700/30",
      accentColor: "border-accent-orange-500",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "Elevate Your Gaming Setup",
      subtitle: "Get up to 30% off on advanced gaming accessories, laptops, and ultra-high-speed routers.",
      actionText: "Explore Clearance",
      link: "/product?category=electronics",
      bgClass: "from-slate-900 via-slate-800 to-primary-blue-900/60",
      accentColor: "border-primary-blue-500",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  // Rotate banner every 7 seconds
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setActiveBanner(prev => (prev === 0 ? 1 : 0));
    }, 7000);
    return () => clearInterval(bannerTimer);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const targetTime = new Date().getTime() + 12 * 60 * 60 * 1000; // 12 hours
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Get products based on flags
  const flashSaleProducts = productsList.filter(p => p.flashSale).slice(0, 4);
  const bestSellerProducts = productsList.filter(p => p.bestSeller).slice(0, 4);
  const trendingProducts = productsList.filter(p => p.trending).slice(0, 4);

  // Reviews Data
  const reviews = [
    {
      id: 1,
      name: "Aarav Sharma",
      role: "Verified Buyer",
      rating: 5,
      comment: "Superb experience! Ordered the KY gaming laptop and got it in Noida within 24 hours. The packaging was top-notch and the laptop is blazing fast. Highly recommended!",
      avatar: "AS"
    },
    {
      id: 2,
      name: "Elena Rodriguez",
      role: "Tech Enthusiast",
      rating: 5,
      comment: "The AI chat support is actually useful. It suggested the Noise-Cancelling headphones which were exactly within my budget. Toggling dark mode makes browsing at night extremely smooth.",
      avatar: "ER"
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Frequent Shopper",
      rating: 4,
      comment: "Applied the WELCOME10 coupon code and saved a neat ₹500 on my sneakers. The website loads very quickly on my phone. Very clean UI and checkout took under 20 seconds.",
      avatar: "PP"
    }
  ];

  return (
    <>
      <Navbar />
      
      <main className="flex-grow">

        {/* HERO SECTION */}
        <section className="relative w-full overflow-hidden bg-slate-950 min-h-[500px] flex items-center">
          {/* Slides */}
          {banners.map((banner, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 flex items-center ${
                index === activeBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Image Overlay */}
              <div className="absolute inset-0">
                <img 
                  src={banner.image} 
                  alt="Promo background" 
                  className="w-full h-full object-cover opacity-30 select-none pointer-events-none" 
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgClass}`}></div>
              </div>

              {/* Banner Content */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
                <div className="max-w-2xl text-left border-l-4 pl-6 sm:pl-8 py-4 bg-black/25 backdrop-blur-[2px] rounded-r-2xl border-accent-orange-500">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-orange-500/10 text-accent-orange-500 text-xs font-bold uppercase tracking-wider mb-4 border border-accent-orange-500/20">
                    <Sparkles className="h-3.5 w-3.5" />
                    Special Promotion
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-lg text-slate-200 mb-8 leading-relaxed max-w-xl">
                    {banner.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      href={banner.link}
                      className="px-8 py-3.5 rounded-full bg-accent-orange-500 hover:bg-accent-orange-600 text-white font-bold transition-all hover:scale-105 shadow-lg shadow-orange-500/20 flex items-center gap-2"
                    >
                      {banner.actionText}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link 
                      href="#categories"
                      className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 hover:border-white/40 transition-all flex items-center"
                    >
                      {t('exploreCats')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveBanner(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeBanner ? 'w-8 bg-accent-orange-500' : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section id="categories" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-blue-500 to-accent-orange-500 bg-clip-text text-transparent">
              {t('categories')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Browse our large collection of products structured into convenient smart categories.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {seedData.categories.slice(0, 10).map((cat) => {
              const IconComponent = iconMap[cat.icon] || Laptop;
              return (
                <Link
                  key={cat.id}
                  href={`/product?category=${cat.id}`}
                  className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 text-center hover:border-primary-blue-500 dark:hover:border-primary-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center justify-center"
                >
                  <div className="p-4 bg-primary-blue-50 dark:bg-primary-blue-950/30 text-primary-blue-500 dark:text-primary-blue-400 rounded-full group-hover:bg-accent-orange-500 group-hover:text-white transition-all duration-300 mb-4">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm group-hover:text-primary-blue-500 dark:group-hover:text-primary-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
                    {cat.itemCount} Items
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* FLASH SALE SECTION */}
        <section className="py-12 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,115,0,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4 text-center md:text-left flex-wrap justify-center">
                <span className="p-3 bg-accent-orange-500 rounded-2xl text-white animate-pulse">
                  <Zap className="h-6 w-6 fill-current" />
                </span>
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">{t('flashSale')}</h2>
                  <p className="text-sm text-slate-400">Exclusive limited time offers. Ends soon!</p>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="bg-slate-800 border border-slate-700 text-2xl font-black rounded-xl h-14 w-14 flex items-center justify-center text-accent-orange-500">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Hrs</span>
                </div>
                <span className="text-2xl font-bold text-slate-600">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-slate-800 border border-slate-700 text-2xl font-black rounded-xl h-14 w-14 flex items-center justify-center text-accent-orange-500">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Min</span>
                </div>
                <span className="text-2xl font-bold text-slate-600">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-slate-800 border border-slate-700 text-2xl font-black rounded-xl h-14 w-14 flex items-center justify-center text-accent-orange-500">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Sec</span>
                </div>
              </div>
            </div>

            {/* Flash Sale Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {flashSaleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* BEST SELLERS SECTION */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary-blue-500 dark:text-primary-blue-400 mb-1">
                <Award className="h-4 w-4" /> Top Demanded
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {t('bestSellers')}
              </h2>
            </div>
            <Link 
              href="/product?sort=rating" 
              className="group font-bold text-sm text-primary-blue-500 hover:text-primary-blue-600 flex items-center gap-1 hover:underline transition-all"
            >
              See All Best Sellers <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* PROMOTIONAL OFFER BANNER */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 py-16 px-8 sm:px-16 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop" 
                alt="Offer Background" 
                className="w-full h-full object-cover opacity-25" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-blue-600/90 to-accent-orange-600/40"></div>
            </div>

            <div className="relative z-10 max-w-xl text-left">
              <span className="text-xs font-extrabold text-orange-300 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">
                Exclusive Deal
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 leading-tight">
                Enhance Your Comfort with Handcrafted Sneakers
              </h2>
              <p className="text-slate-100 mt-2 text-sm sm:text-base leading-relaxed">
                Handcrafted minimal sneakers using genuine Italian leather. memory foam insoles, and anti-skid outsoles. Extra 10% off with WELCOME10 coupon.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <Link 
                href="/product?category=footwear"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-extrabold rounded-full transition-all hover:scale-105 shadow-xl"
              >
                Shop Footwear
                <ArrowRight className="h-5 w-5 text-accent-orange-500" />
              </Link>
            </div>
          </div>
        </section>

        {/* TRENDING PRODUCTS SECTION */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary-blue-500 dark:text-primary-blue-400 mb-1">
                <TrendingUp className="h-4 w-4" /> What's Hot
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {t('trending')}
              </h2>
            </div>
            <Link 
              href="/product?sort=price-high" 
              className="group font-bold text-sm text-primary-blue-500 hover:text-primary-blue-600 flex items-center gap-1 hover:underline transition-all"
            >
              See All Trending <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* CUSTOMER REVIEWS */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/40 border-t border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-orange-500">Testimonials</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                {t('customerReviews')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                See what our valued shoppers say about their delivery, product quality, and support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 text-amber-400 mb-4">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic mb-6">
                      "{rev.comment}"
                    </p>
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                    <div className="h-10 w-10 bg-primary-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {rev.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{rev.name}</h4>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{rev.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MOBILE APP SECTION */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-blue-500/10 to-accent-orange-500/10 dark:from-primary-blue-950/20 dark:to-accent-orange-950/10 rounded-3xl p-8 sm:p-12 border border-primary-blue-500/10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {t('mobileAppTitle')}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                {t('mobileAppDesc')}
              </p>
              
              {/* Feature Bullets */}
              <ul className="grid grid-cols-2 gap-3 mt-6">
                <li className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-accent-orange-500 shrink-0" />
                  Instant notifications
                </li>
                <li className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-accent-orange-500 shrink-0" />
                  Voice search capability
                </li>
                <li className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-accent-orange-500 shrink-0" />
                  AI-powered visual search
                </li>
                <li className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-accent-orange-500 shrink-0" />
                  Express 1-click checkout
                </li>
              </ul>

              {/* Badges */}
              <div className="flex flex-wrap gap-4 mt-8">
                <a href="#" className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl font-semibold text-sm transition-all shadow-md">
                  <Download className="h-4 w-4 text-accent-orange-500" />
                  Google Play
                </a>
                <a href="#" className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl font-semibold text-sm transition-all shadow-md">
                  <Download className="h-4 w-4 text-primary-blue-500" />
                  App Store
                </a>
              </div>
            </div>

            {/* Mock Image Representation */}
            <div className="relative w-full max-w-[280px] h-[340px] flex items-center justify-center shrink-0">
              {/* Creative vector stack to represent mobile app */}
              <div className="absolute w-[220px] h-[320px] bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between p-3 select-none">
                {/* Speaker/Camera bar */}
                <div className="h-4 w-28 bg-slate-800 rounded-full mx-auto mb-2 relative flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-950 absolute left-3"></span>
                </div>
                {/* Inside screen */}
                <div className="flex-grow bg-slate-950 rounded-xl p-2.5 flex flex-col justify-between border border-slate-800">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                    <span className="text-[10px] font-black text-white tracking-widest uppercase">KY eStore</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="flex-grow flex items-center justify-center py-4 text-center flex-col gap-2">
                    <div className="p-3 bg-white/10 rounded-full text-accent-orange-500">
                      <Zap className="h-7 w-7" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300">Shop Smarter & Faster</span>
                    <span className="text-[8px] text-slate-500">Scan QR to Install App</span>
                  </div>
                  <div className="h-6 w-full bg-primary-blue-500 hover:bg-primary-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white uppercase">Install App</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* NEWSLETTER SUBSCRIPTION */}
        <section className="py-16 bg-slate-900 text-white relative border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex p-3 bg-slate-800 rounded-full text-accent-orange-500 mb-4">
              <Mail className="h-6 w-6 animate-bounce" />
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
              {t('newsletterTitle')}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base mb-8">
              {t('newsletterSubtitle')}
            </p>

            {subscribed ? (
              <div className="glass max-w-md mx-auto p-6 rounded-2xl flex flex-col items-center gap-3 border border-emerald-500/20 animate-fadeIn">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Successfully Subscribed!</h4>
                <p className="text-xs text-slate-300">Thank you for subscribing. We have sent a confirmation email containing an extra **10% coupon code** to your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-grow px-5 py-3 rounded-full bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange-500/50"
                />
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-accent-orange-500 hover:bg-accent-orange-600 text-white text-sm font-bold transition-all hover:scale-105 shrink-0 shadow-lg shadow-orange-500/20"
                >
                  {t('subscribe')}
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      <Footer />
      <Chatbot />
    </>
  );
}
