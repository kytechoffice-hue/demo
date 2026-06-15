'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'hi' | 'es';

const translations = {
  en: {
    logoText: "KY eStore",
    tagline: "Smart Shopping Starts Here",
    subtagline: "Buy quality products at the best price with secure online delivery.",
    shopNow: "Shop Now",
    exploreCats: "Explore Categories",
    searchPlaceholder: "Search products (e.g. laptop under 50000)...",
    navHome: "Home",
    navAbout: "About Us",
    navShop: "Shop",
    navDashboard: "Dashboard",
    categories: "Categories",
    flashSale: "Flash Sale",
    bestSellers: "Best Sellers",
    trending: "Trending Products",
    featured: "Featured Products",
    customerReviews: "Customer Reviews",
    newsletterTitle: "Subscribe to our Newsletter",
    newsletterSubtitle: "Stay updated with latest offers, sales and product launches.",
    subscribe: "Subscribe",
    mobileAppTitle: "KY eStore Mobile App",
    mobileAppDesc: "Download our mobile app to shop faster and get exclusive discount codes on your phone.",
    footerLinks: "Quick Links",
    contactInfo: "Contact Info",
    cartTitle: "Shopping Cart",
    checkoutBtn: "Proceed to Checkout",
    searchBtn: "Search",
    chatbotGreeting: "Hi! I am KY-Bot. How can I help you today? You can ask me to recommend products, track an order, or answer FAQs!",
    chatbotPlaceholder: "Ask KY-Bot...",
    adminPanel: "Admin Dashboard",
    myOrders: "My Orders",
    wishlist: "Wishlist"
  },
  hi: {
    logoText: "केवाई ई-स्टोर",
    tagline: "स्मार्ट शॉपिंग की शुरुआत यहाँ से",
    subtagline: "सुरक्षित ऑनलाइन डिलीवरी के साथ सर्वोत्तम मूल्य पर गुणवत्तापूर्ण उत्पाद खरीदें।",
    shopNow: "अभी खरीदें",
    exploreCats: "श्रेणियाँ देखें",
    searchPlaceholder: "उत्पाद खोजें (जैसे कि 50000 के तहत लैपटॉप)...",
    navHome: "होम",
    navAbout: "हमारे बारे में",
    navShop: "दुकान",
    navDashboard: "डैशबोर्ड",
    categories: "श्रेणियाँ",
    flashSale: "फ्लैश सेल",
    bestSellers: "बेस्ट सेलर्स",
    trending: "ट्रेंडिंग उत्पाद",
    featured: "विशेष उत्पाद",
    customerReviews: "ग्राहक समीक्षाएं",
    newsletterTitle: "हमारे न्यूज़लेटर की सदस्यता लें",
    newsletterSubtitle: "नवीनतम ऑफ़र, सेल और उत्पाद लॉन्च के साथ अपडेट रहें।",
    subscribe: "सदस्यता लें",
    mobileAppTitle: "केवाई ई-स्टोर मोबाइल ऐप",
    mobileAppDesc: "तेजी से खरीदारी करने और अपने फोन पर विशेष छूट कोड प्राप्त करने के लिए हमारा मोबाइल ऐप डाउनलोड करें।",
    footerLinks: "त्वरित लिंक",
    contactInfo: "संपर्क जानकारी",
    cartTitle: "शॉपिंग कार्ट",
    checkoutBtn: "चेकआउट के लिए आगे बढ़ें",
    searchBtn: "खोजें",
    chatbotGreeting: "नमस्ते! मैं केवाई-बॉट हूँ। आज मैं आपकी क्या मदद कर सकता हूँ? आप मुझसे उत्पाद सुझाव, ऑर्डर ट्रैक करने या सामान्य प्रश्न पूछ सकते हैं!",
    chatbotPlaceholder: "केवाई-बॉट से पूछें...",
    adminPanel: "एडमिन डैशबोर्ड",
    myOrders: "मेरे ऑर्डर्स",
    wishlist: "विशलिस्ट"
  },
  es: {
    logoText: "KY eStore",
    tagline: "Las Compras Inteligentes Comienzan Aquí",
    subtagline: "Compre productos de calidad al mejor precio con entrega segura en línea.",
    shopNow: "Comprar Ahora",
    exploreCats: "Explorar Categorías",
    searchPlaceholder: "Buscar productos (ej. laptop de menos de 50000)...",
    navHome: "Inicio",
    navAbout: "Nosotros",
    navShop: "Tienda",
    navDashboard: "Panel",
    categories: "Categorías",
    flashSale: "Venta Flash",
    bestSellers: "Los Más Vendidos",
    trending: "Productos de Tendencia",
    featured: "Productos Destacados",
    customerReviews: "Opiniones de Clientes",
    newsletterTitle: "Suscríbete a nuestro boletín",
    newsletterSubtitle: "Manténgase actualizado con las últimas ofertas, ventas y lanzamientos.",
    subscribe: "Suscribirse",
    mobileAppTitle: "KY eStore Aplicación Móvil",
    mobileAppDesc: "Descarga nuestra aplicación móvil para comprar más rápido y obtener códigos de descuento exclusivos en tu teléfono.",
    footerLinks: "Enlaces Rápidos",
    contactInfo: "Información de Contacto",
    cartTitle: "Carrito de Compras",
    checkoutBtn: "Proceder al Pago",
    searchBtn: "Buscar",
    chatbotGreeting: "¡Hola! Soy KY-Bot. ¿Cómo puedo ayudarte hoy? ¡Puedes pedirme recomendaciones, rastrear tu pedido o hacer preguntas frecuentes!",
    chatbotPlaceholder: "Pregúntale a KY-Bot...",
    adminPanel: "Panel de Admin",
    myOrders: "Mis Pedidos",
    wishlist: "Lista de Deseos"
  }
};

interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as Language;
    if (storedLang && (storedLang === 'en' || storedLang === 'hi' || storedLang === 'es')) {
      setLangState(storedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key: keyof typeof translations['en']): string => {
    return translations[lang][key] || translations['en'][key] || String(key);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};
