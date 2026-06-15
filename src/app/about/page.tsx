'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/chat/Chatbot';
import { useLang } from '@/context/LangContext';
import { 
  Heart, 
  Target, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  Truck, 
  Award, 
  Users,
  ChevronRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const { t } = useLang();

  const corePillars = [
    {
      icon: Cpu,
      title: "Technology Driven",
      desc: "Leveraging state-of-the-art AI search matching and personalized recommender systems to guide you to your ideal purchases."
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkouts",
      desc: "Fully encrypted transaction routes integrating certified Stipe, PayPal, and Razorpay payment gateways."
    },
    {
      icon: Truck,
      title: "Express Deliveries",
      desc: "Strategic warehousing ensuring dispatch speeds of under 24 hours for Delhi NCR and expedited nationwide shipping."
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      desc: "Every listed item passes stringent multi-point QC benchmarks, ensuring premium materials and genuine products."
    }
  ];

  const milestones = [
    { year: "2024", title: "KY eStore Founded", desc: "Started as a vision to create a secure, fast, and tech-driven e-commerce hub." },
    { year: "2025", title: "AI-Bot Integration", desc: "Rolled out our interactive conversational assistant bot for 24/7 client care." },
    { year: "2026", title: "Serving 100k+ Customers", desc: "Expanding catalogs across 10 categories, supporting multi-lingual and dark themes." }
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow">
        
        {/* HERO HEADER */}
        <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(0,75,147,0.35),rgba(255,255,255,0))]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent-orange-500/10 text-accent-orange-500 text-xs font-bold uppercase tracking-wider mb-4 border border-accent-orange-500/20">
              <Compass className="h-3.5 w-3.5" />
              Our Journey
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              About KY eStore
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We focus on technology-driven shopping experiences with AI-powered recommendations and customer-first service.
            </p>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Mission Statement */}
            <div className="space-y-6">
              <div className="inline-flex p-3 bg-primary-blue-50 dark:bg-primary-blue-950/30 text-primary-blue-500 dark:text-primary-blue-400 rounded-2xl">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Redefining the Shopping Experience
              </h2>
              <p className="text-slate-600 dark:text-slate-350 leading-relaxed">
                KY eStore is a modern online shopping platform designed to provide customers with quality products, affordable pricing, secure payments, and fast delivery.
              </p>
              <p className="text-slate-600 dark:text-slate-350 leading-relaxed">
                We believe that shopping should be intuitive, safe, and tailored. By blending robust logistics with natural language search assistants, we remove the friction between browsing and owning.
              </p>
              
              <div className="pt-4">
                <Link 
                  href="/product"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue-500 hover:bg-primary-blue-600 text-white font-bold rounded-full transition-all hover:scale-105 shadow-md shadow-blue-500/20 text-sm"
                >
                  Start Exploring
                  <ChevronRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>

            {/* Graphics Illustration */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
                alt="KY eStore team collaboration" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <span className="text-xs font-bold text-orange-300 uppercase tracking-widest">KY eStore Headquarters</span>
                <h3 className="font-bold text-lg mt-0.5">Where Commerce Meets Technology</h3>
              </div>
            </div>

          </div>
        </section>

        {/* CORE PILLARS SECTION */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/40 border-t border-b border-slate-100 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-orange-500">Core Foundations</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                Why Shop with KY eStore?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                We place quality, speed, security, and smart features at the center of our development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {corePillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="p-3 bg-primary-blue-50 dark:bg-primary-blue-950/30 text-primary-blue-500 dark:text-primary-blue-400 rounded-xl w-fit mb-4">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* COMPANY MILESTONES / TIMELINE */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-orange-500">Roadmap</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Milestones Achieved
            </h2>
          </div>

          <div className="relative border-l border-slate-200 dark:border-slate-700 max-w-xl mx-auto text-left pl-6 space-y-8 py-2">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="relative">
                {/* Timeline node */}
                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-primary-blue-500 bg-white dark:bg-slate-900 flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-blue-500"></span>
                </span>
                <span className="text-xs font-extrabold text-accent-orange-500 bg-accent-orange-50 dark:bg-accent-orange-950/30 px-2 py-0.5 rounded">
                  {milestone.year}
                </span>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-1.5">
                  {milestone.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {milestone.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
      <Chatbot />
    </>
  );
}
