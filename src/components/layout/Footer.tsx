'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/context/LangContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RefreshCw 
} from 'lucide-react';

export default function Footer() {
  const { t } = useLang();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800">
      
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-full text-accent-orange-500">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Free & Fast Delivery</h4>
              <p className="text-sm text-slate-400">On all orders above ₹1,000 across India.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-full text-accent-orange-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Secure Payments</h4>
              <p className="text-sm text-slate-400">100% secure payments via SSL certificate protection.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-full text-accent-orange-500">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Easy Returns</h4>
              <p className="text-sm text-slate-400">7-day hassle-free return and refund policy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-white p-0.5">
                <Image 
                  src="/logo-icon.png" 
                  alt="KY Logo" 
                  fill 
                  className="object-contain"
                  sizes="36px"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {t('logoText')}
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              KY eStore is a modern online shopping platform designed to provide customers with quality products, affordable pricing, secure payments, and fast delivery.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary-blue-500 hover:text-white rounded-full transition-colors flex items-center justify-center h-8 w-8" aria-label="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary-blue-500 hover:text-white rounded-full transition-colors flex items-center justify-center h-8 w-8" aria-label="Twitter">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-accent-orange-500 hover:text-white rounded-full transition-colors flex items-center justify-center h-8 w-8" aria-label="Instagram">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.796.056 1.03.047 1.766.213 2.396.458a4.902 4.902 0 011.77 1.151c.548.549.882 1.143 1.151 1.77.245.63.41 1.366.457 2.397.047 1.012.057 1.367.057 3.796s-.01 2.784-.056 3.796c-.047 1.03-.213 1.766-.458 2.396a4.902 4.902 0 01-1.151 1.77a4.902 4.902 0 01-1.77 1.151c-.63.245-1.366.41-2.397.457-1.012.047-1.367.057-3.796.057s-2.784-.01-3.796-.056c-1.03-.047-1.766-.213-2.396-.458a4.902 4.902 0 01-1.77-1.151a4.902 4.902 0 01-1.151-1.77c-.245-.63-.41-1.366-.457-2.397C2.01 14.784 2 14.43 2 12s.01-2.784.056-3.796c.047-1.03.213-1.766.458-2.396a4.902 4.902 0 011.151-1.77a4.902 4.902 0 011.77-1.151c.63-.245 1.366-.41 2.397-.457C9.216 2.01 9.566 2 12.315 2zm0 1.935c-2.385 0-2.67.009-3.606.052c-.864.04-1.332.184-1.644.306a3.224 3.224 0 00-1.205.784a3.224 3.224 0 00-.784 1.205c-.122.311-.266.78-.306 1.644c-.043.937-.052 1.222-.052 3.606s.009 2.67.052 3.606c.04.864.184 1.332.306 1.644c.196.5.474.919.87 1.314c.396.396.814.674 1.314.87c.311.122.78.266 1.644.306c.937.043 1.222.052 3.606.052s2.67-.009 3.606-.052c.864-.04 1.332-.184 1.644-.306a3.224 3.224 0 001.205-.784c.36-.36.634-.778.784-1.205c.122-.311.266-.78.306-1.644c.043-.937.052-1.222.052-3.606s-.009-2.67-.052-3.606c-.04-.864-.184-1.332-.306-1.644a3.224 3.224 0 00-.784-1.205a3.224 3.224 0 00-1.205-.784c-.311-.122-.78-.266-1.644-.306c-.937-.043-1.222-.052-3.606-.052zm0 2.929a5.136 5.136 0 100 10.272a5.136 5.136 0 000-10.272zm0 8.337a3.201 3.201 0 110-6.402a3.201 3.201 0 010 6.402zm4.888-8.977a1.2 1.2 0 100-2.4a1.2 1.2 0 000 2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary-blue-500 hover:text-white rounded-full transition-colors flex items-center justify-center h-8 w-8" aria-label="Linkedin">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white uppercase tracking-wider text-sm mb-4">{t('footerLinks')}</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">{t('navHome')}</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">{t('navAbout')}</Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-white transition-colors">{t('navShop')}</Link>
              </li>
              <li>
                <Link href="/about#privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/about#terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="font-semibold text-white uppercase tracking-wider text-sm mb-4">Shop Categories</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/product?category=electronics" className="hover:text-white transition-colors">Electronics</Link>
              </li>
              <li>
                <Link href="/product?category=fashion" className="hover:text-white transition-colors">Fashion</Link>
              </li>
              <li>
                <Link href="/product?category=mobile-accessories" className="hover:text-white transition-colors">Mobile Accessories</Link>
              </li>
              <li>
                <Link href="/product?category=home-appliances" className="hover:text-white transition-colors">Home Appliances</Link>
              </li>
              <li>
                <Link href="/product?category=beauty" className="hover:text-white transition-colors">Beauty Products</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-white uppercase tracking-wider text-sm mb-4">{t('contactInfo')}</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-accent-orange-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  456 Innovation Highway, IT Tech Park, Sector 62, Noida, Uttar Pradesh, 201301, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-accent-orange-500 shrink-0" />
                <span className="text-slate-400">+91 120 456 7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-accent-orange-500 shrink-0" />
                <span className="text-slate-400">support@kyestore.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-950 text-slate-500 py-6 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>&copy; {currentYear} KY eStore. All rights reserved. Made with ❤️ in India.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">Sitemap</a>
            <a href="#" className="hover:text-slate-400">Robots.txt</a>
            <a href="#" className="hover:text-slate-400">Security</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
