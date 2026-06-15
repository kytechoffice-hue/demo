'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  products?: any[]; // Recommended products
  orderLink?: string;
}

export default function Chatbot() {
  const { t } = useLang();
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: t('chatbotGreeting'),
        timestamp: new Date()
      }
    ]);
  }, [t]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking and responding
    setTimeout(() => {
      const response = generateBotResponse(text);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 900);
  };

  const generateBotResponse = (query: string): Message => {
    const text = query.toLowerCase().trim();
    const botMsgId = `msg-${Date.now()}-bot`;
    const now = new Date();

    // 1. FAQ - Order Tracking
    if (text.includes('track') || text.includes('order') || text.includes('where is my')) {
      // Look for a number
      const match = text.match(/\d+/);
      const orderId = match ? match[0] : '';
      
      if (orderId === '88123' || text.includes('88123')) {
        return {
          id: botMsgId,
          sender: 'bot',
          text: "🔍 **Order Found:** Order **#KY-ORD-88123** is currently **Processing**.\n\n* **Placed:** 25 May 2026\n* **Subtotal:** ₹48,999\n* **Status:** The admin is preparing your gaming laptop for shipment.\n\nYou can track details in your profile dashboard.",
          timestamp: now,
          orderLink: "/dashboard"
        };
      } else if (orderId) {
        return {
          id: botMsgId,
          sender: 'bot',
          text: `I couldn't find an order with ID **#KY-ORD-${orderId}** in your profile. Please check the order number and try again. For testing, type: *track order 88123*.`,
          timestamp: now
        };
      } else {
        return {
          id: botMsgId,
          sender: 'bot',
          text: "To track your order, please type your order ID (e.g., *track order 88123*) or click the link below to visit your dashboard order list.",
          timestamp: now,
          orderLink: "/dashboard"
        };
      }
    }

    // 2. Product Recommendations
    if (text.includes('recommend') || text.includes('suggest') || text.includes('show') || text.includes('buy') || text.includes('laptop') || text.includes('watch') || text.includes('sneaker') || text.includes('headphone') || text.includes('fryer')) {
      
      if (text.includes('laptop') || text.includes('gaming')) {
        const laptop = {
          id: "prod-1",
          title: "KY-Volt Gaming Laptop 15.6\"",
          price: 48999,
          originalPrice: 64999,
          image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop",
          category: "electronics",
          rating: 4.6
        };
        return {
          id: botMsgId,
          sender: 'bot',
          text: "💻 I found the perfect gaming laptop for you! It's under ₹50,000 and comes with high-performance specs:",
          timestamp: now,
          products: [laptop]
        };
      }

      if (text.includes('headphone') || text.includes('audio') || text.includes('noise')) {
        const headphone = {
          id: "prod-2",
          title: "Noise-Cancelling Wireless Headphones pro-9",
          price: 4499,
          originalPrice: 8999,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
          category: "electronics",
          rating: 4.8
        };
        return {
          id: botMsgId,
          sender: 'bot',
          text: "🎧 Here is a highly recommended noise-cancelling headphone with a 50% discount:",
          timestamp: now,
          products: [headphone]
        };
      }

      // Default recommendations
      const recommendations = [
        {
          id: "prod-2",
          title: "Noise-Cancelling Wireless Headphones pro-9",
          price: 4499,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
          category: "electronics",
          rating: 4.8
        },
        {
          id: "prod-3",
          title: "Smart Watch KY-Fit v2",
          price: 2999,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
          category: "mobile-accessories",
          rating: 4.3
        }
      ];
      return {
        id: botMsgId,
        sender: 'bot',
        text: "🛍️ Here are some of our trending and best-selling products that you might like:",
        timestamp: now,
        products: recommendations
      };
    }

    // 3. Coupon FAQ
    if (text.includes('coupon') || text.includes('discount') || text.includes('offer') || text.includes('promo')) {
      return {
        id: botMsgId,
        sender: 'bot',
        text: "🏷️ You can use these active coupon codes at checkout:\n\n* **WELCOME10:** 10% off (Min. purchase ₹500)\n* **KYESTORE:** 15% off (Min. purchase ₹1,000)\n* **FLASH20:** 20% off (Min. purchase ₹2,000)\n\nJust enter the code in your shopping cart before proceeding to checkout!",
        timestamp: now
      };
    }

    // 4. Return Policy FAQ
    if (text.includes('return') || text.includes('replace') || text.includes('refund')) {
      return {
        id: botMsgId,
        sender: 'bot',
        text: "🔄 **Hassle-Free Returns:** We offer a **7-day return policy** on most items. The product must be unused, in its original packaging, and with all tags intact. You can initiate a return directly from your dashboard under My Orders.",
        timestamp: now
      };
    }

    // 5. Contact FAQ
    if (text.includes('contact') || text.includes('support') || text.includes('phone') || text.includes('email') || text.includes('help')) {
      return {
        id: botMsgId,
        sender: 'bot',
        text: "📞 **Contact Support:**\n* **Email:** support@kyestore.com\n* **Phone:** +91 120 456 7890\n* **Address:** IT Tech Park, Sector 62, Noida, India.\n\nWe are available Mon-Sat, 9 AM - 6 PM.",
        timestamp: now
      };
    }

    // 6. Generic welcome/greeting
    if (text === 'hi' || text === 'hello' || text === 'hey' || text === 'namaste') {
      return {
        id: botMsgId,
        sender: 'bot',
        text: `Hello ${user ? user.name : 'there'}! How can I help you today? Ask me about products, tracking your packages, or special offers.`,
        timestamp: now
      };
    }

    // Default Fallback
    return {
      id: botMsgId,
      sender: 'bot',
      text: "I'm not sure I fully understand. I'm a smart bot, so you can ask me questions like:\n\n* *'Recommend a gaming laptop'* \n* *'Track order 88123'*\n* *'Show discount coupons'*\n* *'What is your return policy?'*",
      timestamp: now
    };
  };

  const suggestions = [
    "Track order 88123",
    "Show laptop under 50000",
    "Active coupons",
    "Return policy details"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[380px] h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden animate-slideUp mb-4">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary-blue-500 to-primary-blue-700 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <Bot className="h-6 w-6 text-orange-300" />
              </div>
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-1.5">
                  KY-Bot 
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[10px] text-slate-200">AI Assistant • Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/60">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                  msg.sender === 'user' 
                    ? 'bg-accent-orange-500' 
                    : 'bg-primary-blue-500'
                }`}>
                  {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div className={`p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-accent-orange-500 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Render Product recommendations if any */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="grid gap-2 mt-2">
                      {msg.products.map((p) => (
                        <div key={p.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-2.5 flex gap-2.5 shadow-sm">
                          <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0">
                            <img src={p.image} alt={p.title} className="object-cover h-full w-full" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold truncate text-slate-800 dark:text-slate-100">{p.title}</h4>
                            <p className="text-xs font-bold text-primary-blue-500 dark:text-primary-blue-400 mt-0.5">₹{p.price.toLocaleString()}</p>
                            <Link 
                              href={`/product/detail?id=${p.id}`}
                              onClick={() => setIsOpen(false)}
                              className="text-[10px] font-bold text-accent-orange-500 hover:text-accent-orange-600 flex items-center gap-0.5 mt-1 transition-colors"
                            >
                              View details <ArrowRight className="h-2.5 w-2.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Order Dashboard link */}
                  {msg.orderLink && (
                    <Link 
                      href={msg.orderLink}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-blue-500 dark:text-primary-blue-400 hover:underline mt-1"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Go to My Orders
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="h-8 w-8 rounded-full bg-primary-blue-500 flex items-center justify-center text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions chips */}
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="text-[10px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-blue-50 dark:hover:bg-primary-blue-950/20 hover:text-primary-blue-500 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap shadow-sm transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }} 
            className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder={t('chatbotPlaceholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue-500/50"
            />
            <button
              type="submit"
              className="p-2 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-full transition-colors flex items-center justify-center shrink-0 shadow-md"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-gradient-to-tr from-primary-blue-500 to-primary-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:-rotate-12 transition-all duration-300 focus:outline-none border-2 border-white dark:border-slate-800 relative group"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-accent-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse border border-white">
              AI
            </span>
          </>
        )}
      </button>

    </div>
  );
}
