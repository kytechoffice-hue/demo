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
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Settings, 
  RotateCcw, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Eye,
  DollarSign,
  Edit3
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-primary-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLang();
  const { user, logout, toggleWishlist, addAddress, updateAddress, deleteAddress, updateProfile } = useAuth();
  const { addToCart } = useCart();

  // Selected tab parameter (defaults to 'orders')
  const urlTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(urlTab);

  // Profile forms state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });
  
  // Password change simulation
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passFeedback, setPassFeedback] = useState({ type: '', text: '' });

  // Address creation form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  // Customer Info
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrAltPhone, setAddrAltPhone] = useState('');
  const [addrEmail, setAddrEmail] = useState('');
  const [addrGstn, setAddrGstn] = useState('');
  const [addrWebsite, setAddrWebsite] = useState('');
  // Shipping Address
  const [addrHouseNum, setAddrHouseNum] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrDistrict, setAddrDistrict] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrCountry, setAddrCountry] = useState('India');
  const [addrDefault, setAddrDefault] = useState(false);

  // Return request simulation state
  const [returnOrderId, setReturnOrderId] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnFeedback, setReturnFeedback] = useState('');
  const [returnRequestsList, setReturnRequestsList] = useState<any[]>([
    {
      id: "RET-99012",
      orderId: "KY-ORD-85420",
      reason: "Size did not fit properly",
      status: "Approved",
      refundAmount: 1299,
      date: new Date(Date.now() - 15 * 24 * 3600000).toISOString() // 15 days ago
    }
  ]);

  // Orders state - load orders from localStorage or fallback to seeded order in db.ts
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  // Products state (loads from localStorage if available, falls back to seedData.products)
  const [productsList, setProductsList] = useState<any[]>(seedData.products);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setProfileName(user.name);
      setProfileEmail(user.email);
      
      // Load products
      const localProducts = localStorage.getItem('ky_local_products');
      if (localProducts) {
        try {
          setProductsList(JSON.parse(localProducts));
        } catch (e) {
          console.error("Error parsing local products in dashboard", e);
        }
      }

      // Load orders
      const storedLocalOrders = localStorage.getItem('ky_local_orders');
      if (storedLocalOrders) {
        try {
          const allOrders = JSON.parse(storedLocalOrders);
          const userOrders = allOrders.filter((o: any) => o.userId === user.id);
          setCustomerOrders(userOrders);
        } catch (e) {}
      } else {
        // Mock fallback containing seeded order
        setCustomerOrders([
          {
            id: "KY-ORD-88123",
            items: [
              {
                productId: "prod-1",
                title: "KY-Volt Gaming Laptop 15.6\"",
                price: 48999,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop"
              }
            ],
            paymentMethod: "Stripe",
            paymentStatus: "Paid",
            orderStatus: "Processing",
            total: 53409,
            createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
            timeline: [
              { status: "Order Placed", date: new Date(Date.now() - 36 * 3600000).toISOString(), comment: "Your order has been logged." },
              { status: "Paid", date: new Date(Date.now() - 35.8 * 3600000).toISOString(), comment: "Payment completed successfully via Stripe." },
              { status: "Processing", date: new Date(Date.now() - 30 * 3600000).toISOString(), comment: "Admin is preparing the package." }
            ]
          }
        ]);
      }
    }
  }, [user, router]);

  // Sync tab with search parameters
  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  if (!user) return null;

  // Tabs layout data
  const tabs = [
    { id: 'orders', label: t('myOrders'), icon: ShoppingBag },
    { id: 'wishlist', label: t('wishlist'), icon: Heart },
    { id: 'addresses', label: 'Shipping Addresses', icon: MapPin },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'returns', label: 'Return Requests', icon: RotateCcw }
  ];

  // Profile Update Submission
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) return;

    updateProfile(profileName, profileEmail);
    setFeedbackMsg({ type: 'success', text: 'Profile details updated successfully!' });
    setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
  };

  // Password Update Submission
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass.trim() || !newPass.trim()) return;

    setPassFeedback({ type: 'success', text: 'Password simulated changes completed successfully!' });
    setOldPass('');
    setNewPass('');
    setTimeout(() => setPassFeedback({ type: '', text: '' }), 4000);
  };

  // Address Addition / Update Submission
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addrName.trim() || 
      !addrPhone.trim() || 
      !addrEmail.trim() || 
      !addrHouseNum.trim() || 
      !addrStreet.trim() || 
      !addrArea.trim() || 
      !addrCity.trim() || 
      !addrDistrict.trim() || 
      !addrState.trim() || 
      !addrZip.trim()
    ) {
      alert("Please fill in all required address fields.");
      return;
    }

    const addressData = {
      name: addrName,
      phone: addrPhone,
      altPhone: addrAltPhone,
      email: addrEmail,
      gstn: addrGstn,
      website: addrWebsite,
      houseNum: addrHouseNum,
      street: addrStreet,
      area: addrArea,
      landmark: addrLandmark,
      city: addrCity,
      district: addrDistrict,
      state: addrState,
      zipCode: addrZip,
      country: addrCountry,
      isDefault: addrDefault
    };

    if (editingAddressId) {
      updateAddress(editingAddressId, addressData);
    } else {
      addAddress(addressData);
    }

    // Reset Address form
    setAddrName('');
    setAddrPhone('');
    setAddrAltPhone('');
    setAddrEmail('');
    setAddrGstn('');
    setAddrWebsite('');
    setAddrHouseNum('');
    setAddrStreet('');
    setAddrArea('');
    setAddrLandmark('');
    setAddrCity('');
    setAddrDistrict('');
    setAddrState('');
    setAddrZip('');
    setAddrDefault(false);
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleEditAddressClick = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.name);
    setAddrPhone(addr.phone);
    setAddrAltPhone(addr.altPhone || '');
    setAddrEmail(addr.email);
    setAddrGstn(addr.gstn || '');
    setAddrWebsite(addr.website || '');
    setAddrHouseNum(addr.houseNum);
    setAddrStreet(addr.street);
    setAddrArea(addr.area);
    setAddrLandmark(addr.landmark || '');
    setAddrCity(addr.city);
    setAddrDistrict(addr.district);
    setAddrState(addr.state);
    setAddrZip(addr.zipCode);
    setAddrCountry(addr.country || 'India');
    setAddrDefault(addr.isDefault);
    setShowAddressForm(true);
  };

  // Return request submission
  const handleRequestReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderId.trim() || !returnReason.trim()) return;

    const matchedOrder = customerOrders.find(o => o.id === returnOrderId);
    if (!matchedOrder) {
      setReturnFeedback("I couldn't find an order with this ID. Please input a valid order ID.");
      return;
    }

    const newRequest = {
      id: `RET-${Math.floor(10000 + Math.random() * 90000)}`,
      orderId: returnOrderId,
      reason: returnReason,
      status: "Pending",
      refundAmount: Math.round(matchedOrder.total * 0.9), // Less tax/shipping
      date: new Date().toISOString()
    };

    setReturnRequestsList(prev => [newRequest, ...prev]);
    setReturnOrderId('');
    setReturnReason('');
    setReturnFeedback(`Return request ${newRequest.id} has been filed successfully. Pending administrator verification.`);
    setTimeout(() => setReturnFeedback(''), 6000);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full bg-slate-50 dark:bg-slate-900/40">
        
        {/* DASHBOARD HEADER */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary-blue-500 to-accent-orange-500 text-white flex items-center justify-center text-2xl font-black uppercase shadow-lg shadow-blue-500/10">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{user.email} • {user.role === 'admin' ? 'Administrator' : 'Customer Account'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {user.role === 'admin' && (
              <Link 
                href="/admin" 
                className="px-6 py-2.5 rounded-full bg-accent-orange-500 hover:bg-accent-orange-600 text-white font-bold text-xs shadow-md transition-all"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* CONTAINER LAYOUT: Tabs left, Content right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* TAB INDICATOR BUTTONS */}
          <nav className="lg:col-span-3 space-y-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 p-4 rounded-2xl shadow-sm">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    router.push(`/dashboard?tab=${tab.id}`);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                    activeTab === tab.id
                      ? 'bg-primary-blue-500 text-white shadow-md shadow-blue-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/40 hover:text-slate-900'
                  }`}
                >
                  <TabIcon className="h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* ACTIVE TAB CONTENT DISPLAY */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-sm">
            
            {/* 1. MY ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-50 dark:border-slate-700 pb-4">
                  <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Order Logs & Tracking</h2>
                  <p className="text-xs text-slate-450 text-slate-400 mt-0.5">Check order status history and tracking progress timelines.</p>
                </div>

                {customerOrders.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center gap-3">
                    <ShoppingBag className="h-10 w-10 text-slate-300" />
                    <p className="text-sm text-slate-450 text-slate-400">You haven't placed any orders yet.</p>
                    <Link href="/product" className="text-xs font-bold text-primary-blue-500 hover:underline">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="border border-slate-100 dark:border-slate-700/60 rounded-2xl overflow-hidden p-5 space-y-5">
                        
                        {/* Order Header info */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-50 dark:border-slate-700 text-xs">
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-slate-100">Order ID: #{order.id}</span>
                            <span className="text-slate-400 mx-2">|</span>
                            <span className="text-slate-450 text-slate-400">Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                                : 'bg-primary-blue-50 dark:bg-primary-blue-950/20 text-primary-blue-600'
                            }`}>
                              {order.orderStatus}
                            </span>
                            <span className="font-black text-slate-900 dark:text-slate-50">Total: ₹{order.total.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Order Items list */}
                        <div className="space-y-4">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <div className="h-14 w-14 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 dark:border-slate-700 shrink-0">
                                <img src={item.image} alt={item.title} className="object-cover h-full w-full" />
                              </div>
                              <div className="min-w-0 flex-grow text-xs">
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</h4>
                                <p className="text-slate-400 mt-0.5">Qty: {item.quantity} • Price: ₹{item.price.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* VISUAL STATUS TIMELINE TRACKER */}
                        <div className="pt-4 border-t border-slate-50 dark:border-slate-700/60">
                          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-5">Order Progress Timeline</h4>
                          
                          <div className="grid grid-cols-4 gap-2 relative">
                            {/* Connector line */}
                            <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-100 dark:bg-slate-700/80 z-0"></div>

                            {[
                              { label: "Placed", check: true },
                              { label: "Paid", check: order.paymentStatus === 'Paid' },
                              { label: "Shipped", check: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' },
                              { label: "Delivered", check: order.orderStatus === 'Delivered' }
                            ].map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center text-center relative z-10">
                                <span className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${
                                  step.check
                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-750 text-slate-300'
                                }`}>
                                  {step.check ? <CheckCircle2 className="h-4 w-4 fill-emerald-500 stroke-white" /> : <Clock className="h-4.5 w-4.5" />}
                                </span>
                                <span className={`text-[10px] font-extrabold mt-2 ${
                                  step.check ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Return buttons or status comments */}
                        {order.timeline && order.timeline.length > 0 && (
                          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 text-xs text-slate-655 text-slate-500 dark:text-slate-400 flex items-start gap-2 border border-slate-100 dark:border-slate-750/30">
                            <Clock className="h-4.5 w-4.5 text-primary-blue-500 shrink-0 mt-0.5" />
                            <span>
                              **Latest Update:** {order.timeline[order.timeline.length - 1].comment}
                            </span>
                          </div>
                        )}

                        {order.orderStatus !== 'Delivered' && (
                          <div className="flex justify-end gap-2.5">
                            <button
                              onClick={() => {
                                setReturnOrderId(order.id);
                                setActiveTab('returns');
                              }}
                              className="text-xs font-bold text-accent-orange-500 hover:text-accent-orange-600 hover:underline"
                            >
                              File Return Claim
                            </button>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-50 dark:border-slate-700 pb-4">
                  <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Favorites Wishlist</h2>
                  <p className="text-xs text-slate-450 text-slate-400 mt-0.5">List of items you marked as favorites. Quick add to cart.</p>
                </div>

                {user.wishlist.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center gap-3">
                    <Heart className="h-10 w-10 text-slate-300" />
                    <p className="text-sm text-slate-450 text-slate-400">Your wishlist is currently empty.</p>
                    <Link href="/product" className="text-xs font-bold text-primary-blue-500 hover:underline">Explore Store</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {productsList
                      .filter((p) => user.wishlist.includes(p.id))
                      .map((product) => (
                        <div key={product.id} className="relative group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between h-full">
                          
                          {/* Remove button */}
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="absolute top-2.5 right-2.5 p-2 bg-white/85 dark:bg-slate-850 hover:bg-red-50 text-red-500 rounded-full shadow-sm z-10 transition-all"
                            aria-label="Remove from Wishlist"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>

                          {/* Image */}
                          <Link href={`/product/detail?id=${product.id}`} className="relative pt-[100%] bg-slate-100 block hover:opacity-95 overflow-hidden">
                            <img src={product.image} alt={product.title} className="absolute inset-0 h-full w-full object-cover" />
                          </Link>

                          {/* Info details */}
                          <div className="p-4 flex flex-col flex-grow">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 mt-0.5 line-clamp-1 hover:text-primary-blue-500 transition-colors">
                              <Link href={`/product/detail?id=${product.id}`}>{product.title}</Link>
                            </h4>
                            <p className="text-xs font-black text-slate-950 dark:text-slate-50 mt-1">₹{product.price.toLocaleString()}</p>
                            
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="w-full mt-4 py-2 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                            >
                              <Plus className="h-4 w-4" /> Add to Cart
                            </button>
                          </div>

                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. SHIPPING ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-700 pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Shipping Addresses</h2>
                    <p className="text-xs text-slate-450 text-slate-400 mt-0.5">Manage billing and shipping delivery coordinates.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (showAddressForm) {
                        setAddrName('');
                        setAddrPhone('');
                        setAddrAltPhone('');
                        setAddrEmail('');
                        setAddrGstn('');
                        setAddrWebsite('');
                        setAddrHouseNum('');
                        setAddrStreet('');
                        setAddrArea('');
                        setAddrLandmark('');
                        setAddrCity('');
                        setAddrDistrict('');
                        setAddrState('');
                        setAddrZip('');
                        setAddrDefault(false);
                        setEditingAddressId(null);
                      }
                      setShowAddressForm(!showAddressForm);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-950 dark:bg-slate-750 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {showAddressForm ? 'Cancel' : (
                      <>
                        <Plus className="h-4 w-4" /> Add Address
                      </>
                    )}
                  </button>
                </div>

                {/* ADDRESS ADD FORM CONTAINER */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-6 max-w-2xl animate-fadeIn">
                    
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      {editingAddressId ? 'Edit Saved Address' : 'Add New Address'}
                    </h3>

                    {/* Customer Information Section */}
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-xs uppercase tracking-wider text-primary-blue-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">Customer Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Full Name <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. John Doe"
                            value={addrName} onChange={(e) => setAddrName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Mobile Number <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. +91 9876543210"
                            value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Alternate Mobile (Optional)</label>
                          <input
                            type="text" placeholder="e.g. +91 9876543211"
                            value={addrAltPhone} onChange={(e) => setAddrAltPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Email Address <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="email" required placeholder="e.g. john@example.com"
                            value={addrEmail} onChange={(e) => setAddrEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">GSTN No</label>
                          <input
                            type="text" placeholder="e.g. 07AAAAA1111A1Z1"
                            value={addrGstn} onChange={(e) => setAddrGstn(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Website</label>
                          <input
                            type="url" placeholder="e.g. https://example.com"
                            value={addrWebsite} onChange={(e) => setAddrWebsite(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address Section */}
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-xs uppercase tracking-wider text-accent-orange-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">Shipping Address</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">House/Flat/Building Number <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Flat 4B, Building C"
                            value={addrHouseNum} onChange={(e) => setAddrHouseNum(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Street/Road Name <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Tech Park Road"
                            value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Area/Locality <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Sector 62"
                            value={addrArea} onChange={(e) => setAddrArea(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Landmark (Optional)</label>
                          <input
                            type="text" placeholder="e.g. Near Metro Pillar 124"
                            value={addrLandmark} onChange={(e) => setAddrLandmark(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Village/Town/City <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Noida"
                            value={addrCity} onChange={(e) => setAddrCity(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">District <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Gautam Buddha Nagar"
                            value={addrDistrict} onChange={(e) => setAddrDistrict(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">State <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Uttar Pradesh"
                            value={addrState} onChange={(e) => setAddrState(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">PIN Code <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. 201301"
                            value={addrZip} onChange={(e) => setAddrZip(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Country <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. India"
                            value={addrCountry} onChange={(e) => setAddrCountry(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox" id="default-check"
                        checked={addrDefault} onChange={(e) => setAddrDefault(e.target.checked)}
                        className="rounded accent-primary-blue-500 cursor-pointer"
                      />
                      <label htmlFor="default-check" className="text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer">Set as default shipping address</label>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      {editingAddressId ? 'Update Address Details' : 'Save Address Coordinates'}
                    </button>
                  </form>
                )}

                {/* ADDRESSES CARD SHOWCASE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user && user.addresses && user.addresses.map((addr: any) => (
                    <div key={addr.id} className="border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 space-y-4 relative text-xs bg-white dark:bg-slate-800 shadow-sm flex flex-col justify-between">
                      
                      {/* Actions */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditAddressClick(addr)}
                          className="p-1.5 text-slate-400 hover:text-primary-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded transition-all cursor-pointer"
                          aria-label="Edit Address"
                          type="button"
                        >
                          <Edit3 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="p-1.5 text-slate-400 hover:text-red-550 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-all cursor-pointer"
                          aria-label="Delete Address"
                          type="button"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* Customer Info Section */}
                        <div className="space-y-1 pr-6 border-b border-slate-50 dark:border-slate-700 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-800 dark:text-slate-150 text-sm">{addr.name}</span>
                            {addr.isDefault && (
                              <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-bold uppercase border border-emerald-100 dark:border-emerald-900/40">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-slate-700 dark:text-slate-350">Phone: {addr.phone} {addr.altPhone ? `| Alt: ${addr.altPhone}` : ''}</p>
                          <p className="text-slate-500 dark:text-slate-400">Email: {addr.email}</p>
                          {addr.gstn && <p className="text-slate-500 dark:text-slate-400">GSTN: <span className="font-bold uppercase text-primary-blue-500">{addr.gstn}</span></p>}
                          {addr.website && <p className="text-slate-500 dark:text-slate-400">Website: <a href={addr.website} target="_blank" rel="noopener noreferrer" className="text-primary-blue-500 hover:underline">{addr.website}</a></p>}
                        </div>

                        {/* Shipping Address Section */}
                        <div className="space-y-1 text-slate-500 dark:text-slate-400 font-medium pt-1">
                          <p className="font-bold text-slate-700 dark:text-slate-300">Shipping Destination:</p>
                          <p className="text-slate-600 dark:text-slate-350">{addr.houseNum}, {addr.street}</p>
                          <p className="text-slate-600 dark:text-slate-350">{addr.area} {addr.landmark ? `(Landmark: ${addr.landmark})` : ''}</p>
                          <p className="text-slate-600 dark:text-slate-350">{addr.city}, {addr.district}</p>
                          <p className="text-slate-600 dark:text-slate-350">{addr.state} - {addr.zipCode}</p>
                          <p className="font-bold uppercase tracking-wider text-[10px] text-slate-400 mt-1">{addr.country}</p>
                        </div>
                      </div>

                    </div>
                  ))}
                  {(!user || !user.addresses || user.addresses.length === 0) && (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-sm text-slate-450">No saved addresses found. Click "Add Address" to store one.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 4. PROFILE SETTINGS TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Profile fields */}
                <div className="space-y-6">
                  <div className="border-b border-slate-50 dark:border-slate-700 pb-4">
                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Personal Information</h2>
                    <p className="text-xs text-slate-450 text-slate-400 mt-0.5">Edit credentials matching your profile account.</p>
                  </div>

                  {feedbackMsg.text && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/45 text-emerald-600 text-xs font-semibold">
                      {feedbackMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                      <input
                        type="text" required
                        value={profileName} onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                      <input
                        type="email" required
                        value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-xl font-bold transition-all shadow-md"
                    >
                      Save Profile Details
                    </button>
                  </form>
                </div>

                {/* Password field */}
                <div className="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-700/60">
                  <div className="border-b border-slate-50 dark:border-slate-700 pb-4">
                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Change Password</h2>
                    <p className="text-xs text-slate-455 text-slate-400 mt-0.5">Edit password settings to preserve account safety.</p>
                  </div>

                  {passFeedback.text && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/45 text-emerald-600 text-xs font-semibold">
                      {passFeedback.text}
                    </div>
                  )}

                  <form onSubmit={handleUpdatePassword} className="max-w-md space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Current Password</label>
                      <input
                        type="password" required placeholder="••••••••"
                        value={oldPass} onChange={(e) => setOldPass(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">New Password</label>
                      <input
                        type="password" required placeholder="••••••••"
                        value={newPass} onChange={(e) => setNewPass(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-950 dark:bg-slate-750 dark:hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* 5. RETURN REQUESTS TAB */}
            {activeTab === 'returns' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-slate-50 dark:border-slate-700 pb-4">
                  <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Return & Refund Requests</h2>
                  <p className="text-xs text-slate-450 text-slate-400 mt-0.5">File return requests for items or view status updates of previous claims.</p>
                </div>

                {/* Return request filing helper */}
                <form onSubmit={handleRequestReturn} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4 max-w-xl text-xs font-semibold">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">File a New Claim</h3>
                  
                  {returnFeedback && (
                    <div className={`p-3 rounded-xl border ${
                      returnFeedback.includes('successfully')
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-red-50 border-red-100 text-red-500'
                    }`}>
                      {returnFeedback}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Order ID</label>
                      <input
                        type="text" required placeholder="e.g. KY-ORD-88123"
                        value={returnOrderId} onChange={(e) => setReturnOrderId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800 font-bold uppercase"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Pre-filed Options</label>
                      <select
                        onChange={(e) => setReturnOrderId(e.target.value)}
                        value={returnOrderId}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                      >
                        <option value="">Select order to return</option>
                        {customerOrders.map(o => (
                          <option key={o.id} value={o.id}>Order #{o.id} (₹{o.total})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Reason for Return</label>
                    <textarea
                      required rows={3} placeholder="Please explain why you want to return or replace the product (e.g. damage, size, performance, etc.)."
                      value={returnReason} onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800 font-medium"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-accent-orange-500 hover:bg-accent-orange-600 text-white rounded-xl font-bold transition-all shadow-md"
                  >
                    Submit Return Request
                  </button>
                </form>

                {/* Returns list */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-450 text-slate-400 border-b border-slate-50 dark:border-slate-700/50 pb-2">Return History</h3>
                  
                  {returnRequestsList.map((req) => (
                    <div key={req.id} className="border border-slate-100 dark:border-slate-700 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800 dark:text-slate-100">Claim ID: {req.id}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-450 text-slate-450">Order ID: #{req.orderId}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 italic font-medium">Reason: "{req.reason}"</p>
                        <p className="text-[10px] text-slate-400 mt-1">Submitted on {new Date(req.date).toLocaleDateString()}</p>
                      </div>

                      <div className="flex flex-col items-end shrink-0 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                          req.status === 'Approved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                            : 'bg-primary-blue-50 dark:bg-primary-blue-950/20 text-primary-blue-600'
                        }`}>
                          {req.status}
                        </span>
                        <span className="font-black text-slate-900 dark:text-slate-50 mt-2 flex items-center gap-0.5">
                          Refund: <span className="text-emerald-600">₹{req.refundAmount.toLocaleString()}</span>
                        </span>
                      </div>

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
