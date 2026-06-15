'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/chat/Chatbot';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import seedData from '@/data/seedData.json';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  ClipboardList, 
  Tag, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  DollarSign, 
  Check, 
  X,
  FileText,
  Percent,
  MapPin,
  Building,
  Truck
} from 'lucide-react';

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-primary-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}

function AdminContent() {
  const router = useRouter();
  const { user, addAddress, updateAddress, deleteAddress } = useAuth();
  const { t } = useLang();

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  // States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [productsList, setProductsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'day' | 'month' | 'year'>('day');

  // Purchase Order states
  const [purchaseOrdersList, setPurchaseOrdersList] = useState<any[]>([]);
  const [showPOForm, setShowPOForm] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any | null>(null);
  
  // PO creator form states
  const [poSupplier, setPoSupplier] = useState('KY Electronics Wholesale');
  const [poItems, setPoItems] = useState<any[]>([]);
  const [poDeliveryPartner, setPoDeliveryPartner] = useState('');
  const [poNotes, setPoNotes] = useState('');
  const [showPoDelivery, setShowPoDelivery] = useState(false);
  const [showPoNotes, setShowPoNotes] = useState(false);
  
  // PO single item selection states
  const [poProdId, setPoProdId] = useState('');
  const [poQty, setPoQty] = useState(1);
  const [poCost, setPoCost] = useState(0);

  // Editor states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  // Product form inputs
  const [prodTitle, setProdTitle] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodOrigPrice, setProdOrigPrice] = useState(0);
  const [prodStock, setProdStock] = useState(0);
  const [prodCat, setProdCat] = useState('electronics');
  const [prodImg, setProdImg] = useState('');
  const [prodListingType, setProdListingType] = useState<'buy' | 'rent'>('buy');
  const [prodRentalDay, setProdRentalDay] = useState(0);
  const [prodRentalWeek, setProdRentalWeek] = useState(0);
  const [prodRentalMonth, setProdRentalMonth] = useState(0);
  const [prodSecurityDeposit, setProdSecurityDeposit] = useState(0);

  // Coupon form inputs
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(15);
  const [couponMin, setCouponMin] = useState(1000);

  // Address form states
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

  // Supplier / Partner Address states
  const [partnerAddressesList, setPartnerAddressesList] = useState<any[]>([]);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [editingPartnerAddressId, setEditingPartnerAddressId] = useState<string | null>(null);
  
  const [partnerName, setPartnerName] = useState('');
  const [partnerContact, setPartnerContact] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerAltPhone, setPartnerAltPhone] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerGstn, setPartnerGstn] = useState('');
  const [partnerWebsite, setPartnerWebsite] = useState('');
  const [partnerHouseNum, setPartnerHouseNum] = useState('');
  const [partnerStreet, setPartnerStreet] = useState('');
  const [partnerArea, setPartnerArea] = useState('');
  const [partnerLandmark, setPartnerLandmark] = useState('');
  const [partnerCity, setPartnerCity] = useState('');
  const [partnerDistrict, setPartnerDistrict] = useState('');
  const [partnerState, setPartnerState] = useState('');
  const [partnerZip, setPartnerZip] = useState('');
  const [partnerCountry, setPartnerCountry] = useState('India');

  // Delivery Partner / Channel states
  const [deliveryPartnersList, setDeliveryPartnersList] = useState<any[]>([]);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [editingDeliveryId, setEditingDeliveryId] = useState<string | null>(null);
  
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryContact, setDeliveryContact] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryAltPhone, setDeliveryAltPhone] = useState('');
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [deliveryGstn, setDeliveryGstn] = useState('');
  const [deliveryWebsite, setDeliveryWebsite] = useState('');
  const [deliveryHouseNum, setDeliveryHouseNum] = useState('');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('');
  const [deliveryLandmark, setDeliveryLandmark] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryDistrict, setDeliveryDistrict] = useState('');
  const [deliveryState, setDeliveryState] = useState('');
  const [deliveryZip, setDeliveryZip] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState('India');

  // Load resources from LocalStorage or seed data
  useEffect(() => {
    // 1. Products
    const localProducts = localStorage.getItem('ky_local_products');
    if (localProducts) {
      setProductsList(JSON.parse(localProducts));
    } else {
      setProductsList(seedData.products);
      localStorage.setItem('ky_local_products', JSON.stringify(seedData.products));
    }

    // 2. Categories
    const localCats = localStorage.getItem('ky_local_categories');
    if (localCats) {
      setCategoriesList(JSON.parse(localCats));
    } else {
      setCategoriesList(seedData.categories);
      localStorage.setItem('ky_local_categories', JSON.stringify(seedData.categories));
    }

    // 3. Coupons
    const localCoupons = localStorage.getItem('ky_local_coupons');
    if (localCoupons) {
      setCouponsList(JSON.parse(localCoupons));
    } else {
      const defaultCoupons = [
        { code: "WELCOME10", discountPercent: 10, minPurchase: 500, active: true },
        { code: "FLASH20", discountPercent: 20, minPurchase: 2000, active: true },
        { code: "KYESTORE", discountPercent: 15, minPurchase: 1000, active: true }
      ];
      setCouponsList(defaultCoupons);
      localStorage.setItem('ky_local_coupons', JSON.stringify(defaultCoupons));
    }

    // 4. Orders
    const localOrders = localStorage.getItem('ky_local_orders');
    if (localOrders) {
      setOrdersList(JSON.parse(localOrders));
    } else {
      const defaultOrders = [
        {
          id: "KY-ORD-88123",
          userId: "usr-buyer",
          email: "buyer@gmail.com",
          items: [
            {
              productId: "prod-1",
              title: "KY-Volt Gaming Laptop 15.6\"",
              price: 48999,
              quantity: 1,
              image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop"
            }
          ],
          total: 53409,
          paymentMethod: "Stripe",
          paymentStatus: "Paid",
          orderStatus: "Processing",
          createdAt: new Date(Date.now() - 36 * 3600000).toISOString()
        }
      ];
      setOrdersList(defaultOrders);
      localStorage.setItem('ky_local_orders', JSON.stringify(defaultOrders));
    }

    // 5. Purchase Orders
    const localPOs = localStorage.getItem('ky_local_purchase_orders');
    if (localPOs) {
      setPurchaseOrdersList(JSON.parse(localPOs));
    } else {
      const defaultPOs = [
        {
          id: "PO-2026-001",
          supplierName: "KY Electronics Wholesale",
          items: [
            { productId: "prod-1", title: "KY-Volt Gaming Laptop 15.6\"", quantity: 10, unitCost: 30000 }
          ],
          totalCost: 354000,
          status: "Received",
          createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
          receivedAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString()
        },
        {
          id: "PO-2026-002",
          supplierName: "Vogue & Fashion Traders",
          items: [
            { productId: "prod-6", title: "Unisex Cotton Casual Hoodie", quantity: 25, unitCost: 800 }
          ],
          totalCost: 23600,
          status: "Sent",
          createdAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString()
        }
      ];
      setPurchaseOrdersList(defaultPOs);
      localStorage.setItem('ky_local_purchase_orders', JSON.stringify(defaultPOs));
    }

    // 6. Partner Addresses
    const localPartnerAddresses = localStorage.getItem('ky_local_partner_addresses');
    if (localPartnerAddresses) {
      setPartnerAddressesList(JSON.parse(localPartnerAddresses));
    } else {
      const defaultPartnerAddresses = [
        {
          id: "partner-addr-1",
          partnerName: "KY Electronics Wholesale",
          contactPerson: "Rajesh Kumar",
          phone: "+91 9988776655",
          altPhone: "",
          email: "wholesale@kyelectronics.com",
          gstn: "07AAAAA1111A1Z1",
          website: "https://wholesale.kyelectronics.com",
          houseNum: "Building A, Tech Park",
          street: "Okhla Industrial Area Phase 3",
          area: "Okhla",
          landmark: "Near NSIC Metro Station",
          city: "New Delhi",
          district: "South Delhi",
          state: "Delhi",
          zipCode: "110020",
          country: "India"
        },
        {
          id: "partner-addr-2",
          partnerName: "Vogue & Fashion Traders",
          contactPerson: "Priya Sharma",
          phone: "+91 8877665544",
          altPhone: "",
          email: "supply@voguefashion.com",
          gstn: "27BBBBB2222B2Z2",
          website: "https://voguefashion.com",
          houseNum: "Shop 45, Fashion Plaza",
          street: "Linking Road",
          area: "Bandra West",
          landmark: "Opposite National College",
          city: "Mumbai",
          district: "Mumbai Suburban",
          state: "Maharashtra",
          zipCode: "400050",
          country: "India"
        }
      ];
      setPartnerAddressesList(defaultPartnerAddresses);
      localStorage.setItem('ky_local_partner_addresses', JSON.stringify(defaultPartnerAddresses));
    }

    // 7. Delivery Partners
    const localDeliveryPartners = localStorage.getItem('ky_local_delivery_partners');
    if (localDeliveryPartners) {
      setDeliveryPartnersList(JSON.parse(localDeliveryPartners));
    } else {
      const defaultDeliveryPartners = [
        {
          id: "delivery-partner-1",
          partnerName: "BlueDart Express",
          contactPerson: "Amit Verma",
          phone: "+91 9898989898",
          altPhone: "",
          email: "support@bluedart.com",
          gstn: "07BDEXP1111A1Z1",
          website: "https://www.bluedart.com",
          houseNum: "Plot 12, Logistics Park",
          street: "Airport Road",
          area: "Palam",
          landmark: "Near IGI Cargo Terminal",
          city: "New Delhi",
          district: "South West Delhi",
          state: "Delhi",
          zipCode: "110037",
          country: "India"
        },
        {
          id: "delivery-partner-2",
          partnerName: "Delhivery Logistics",
          contactPerson: "Sandeep Singh",
          phone: "+91 9797979797",
          altPhone: "",
          email: "corporate@delhivery.com",
          gstn: "27DELIV2222B2Z2",
          website: "https://www.delhivery.com",
          houseNum: "Gate 3, Warehouse 5",
          street: "NH-8, Bilaspur",
          area: "Gurugram",
          landmark: "Near Bilaspur Chowk",
          city: "Gurugram",
          district: "Gurugram",
          state: "Haryana",
          zipCode: "122413",
          country: "India"
        }
      ];
      setDeliveryPartnersList(defaultDeliveryPartners);
      localStorage.setItem('ky_local_delivery_partners', JSON.stringify(defaultDeliveryPartners));
    }
  }, []);

  // Save changes wrapper
  const saveProductsToLocal = (list: any[]) => {
    setProductsList(list);
    localStorage.setItem('ky_local_products', JSON.stringify(list));
  };

  const saveOrdersToLocal = (list: any[]) => {
    setOrdersList(list);
    localStorage.setItem('ky_local_orders', JSON.stringify(list));
  };

  const saveCouponsToLocal = (list: any[]) => {
    setCouponsList(list);
    localStorage.setItem('ky_local_coupons', JSON.stringify(list));
  };

  // Add / Edit Product Submit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodImg.trim()) return;

    if (editingProduct) {
      // Edit
      const updated = productsList.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              title: prodTitle,
              description: prodDesc,
              price: prodPrice,
              originalPrice: prodOrigPrice || prodPrice,
              stock: prodStock,
              category: prodCat,
              image: prodImg,
              discountPercent: prodOrigPrice > prodPrice ? Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100) : 0,
              listingType: prodListingType,
              rentalPriceDay: prodListingType === 'rent' ? prodRentalDay : 0,
              rentalPriceWeek: prodListingType === 'rent' ? prodRentalWeek : 0,
              rentalPriceMonth: prodListingType === 'rent' ? prodRentalMonth : 0,
              securityDeposit: prodListingType === 'rent' ? prodSecurityDeposit : 0
            }
          : p
      );
      saveProductsToLocal(updated);
      setEditingProduct(null);
    } else {
      // Create new
      const newProduct = {
        id: `prod-${Date.now()}`,
        title: prodTitle,
        description: prodDesc,
        price: prodPrice,
        originalPrice: prodOrigPrice || prodPrice,
        discountPercent: prodOrigPrice > prodPrice ? Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100) : 0,
        image: prodImg,
        category: prodCat,
        rating: 4.5,
        reviewsCount: 1,
        stock: prodStock,
        specs: { "Brand": "KY Store", "Status": "New" },
        featured: false,
        bestSeller: false,
        trending: true,
        flashSale: false,
        listingType: prodListingType,
        rentalPriceDay: prodListingType === 'rent' ? prodRentalDay : 0,
        rentalPriceWeek: prodListingType === 'rent' ? prodRentalWeek : 0,
        rentalPriceMonth: prodListingType === 'rent' ? prodRentalMonth : 0,
        securityDeposit: prodListingType === 'rent' ? prodSecurityDeposit : 0
      };
      saveProductsToLocal([newProduct, ...productsList]);
    }

    // Reset Form
    setProdTitle('');
    setProdDesc('');
    setProdPrice(0);
    setProdOrigPrice(0);
    setProdStock(0);
    setProdImg('');
    setProdListingType('buy');
    setProdRentalDay(0);
    setProdRentalWeek(0);
    setProdRentalMonth(0);
    setProdSecurityDeposit(0);
    setShowProductForm(false);
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updated = productsList.filter(p => p.id !== id);
      saveProductsToLocal(updated);
    }
  };

  // Open Edit Form
  const handleEditProductClick = (product: any) => {
    setEditingProduct(product);
    setProdTitle(product.title);
    setProdDesc(product.description || '');
    setProdPrice(product.price);
    setProdOrigPrice(product.originalPrice || product.price);
    setProdStock(product.stock);
    setProdCat(product.category);
    setProdImg(product.image);
    setProdListingType(product.listingType || 'buy');
    setProdRentalDay(product.rentalPriceDay || 0);
    setProdRentalWeek(product.rentalPriceWeek || 0);
    setProdRentalMonth(product.rentalPriceMonth || 0);
    setProdSecurityDeposit(product.securityDeposit || 0);
    setShowProductForm(true);
  };

  // Change Order Status
  const handleOrderStatusChange = (orderId: string, status: string) => {
    const updated = ordersList.map(o => 
      o.id === orderId 
        ? { ...o, orderStatus: status }
        : o
    );
    saveOrdersToLocal(updated);
  };

  // Create Coupon Submit
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const newCoupon = {
      code: couponCode.trim().toUpperCase(),
      discountPercent: couponDiscount,
      minPurchase: couponMin,
      active: true
    };

    saveCouponsToLocal([newCoupon, ...couponsList]);
    setCouponCode('');
  };

  // Delete Coupon
  const handleDeleteCoupon = (code: string) => {
    if (confirm(`Remove coupon ${code}?`)) {
      const updated = couponsList.filter(c => c.code !== code);
      saveCouponsToLocal(updated);
    }
  };

  // Create / Update Address Submit
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

  const savePOsToLocal = (list: any[]) => {
    setPurchaseOrdersList(list);
    localStorage.setItem('ky_local_purchase_orders', JSON.stringify(list));
  };

  const savePartnerAddressesToLocal = (list: any[]) => {
    setPartnerAddressesList(list);
    localStorage.setItem('ky_local_partner_addresses', JSON.stringify(list));
  };

  const handlePartnerAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !partnerName.trim() ||
      !partnerContact.trim() ||
      !partnerPhone.trim() ||
      !partnerEmail.trim() ||
      !partnerHouseNum.trim() ||
      !partnerStreet.trim() ||
      !partnerArea.trim() ||
      !partnerCity.trim() ||
      !partnerDistrict.trim() ||
      !partnerState.trim() ||
      !partnerZip.trim()
    ) {
      alert("Please fill in all required partner address fields.");
      return;
    }

    const partnerData = {
      partnerName,
      contactPerson: partnerContact,
      phone: partnerPhone,
      altPhone: partnerAltPhone,
      email: partnerEmail,
      gstn: partnerGstn,
      website: partnerWebsite,
      houseNum: partnerHouseNum,
      street: partnerStreet,
      area: partnerArea,
      landmark: partnerLandmark,
      city: partnerCity,
      district: partnerDistrict,
      state: partnerState,
      zipCode: partnerZip,
      country: partnerCountry
    };

    if (editingPartnerAddressId) {
      const updated = partnerAddressesList.map(item => 
        item.id === editingPartnerAddressId
          ? { ...partnerData, id: editingPartnerAddressId }
          : item
      );
      savePartnerAddressesToLocal(updated);
    } else {
      const newAddress = {
        ...partnerData,
        id: `partner-addr-${Date.now()}`
      };
      savePartnerAddressesToLocal([newAddress, ...partnerAddressesList]);
    }

    // Reset Form
    setPartnerName('');
    setPartnerContact('');
    setPartnerPhone('');
    setPartnerAltPhone('');
    setPartnerEmail('');
    setPartnerGstn('');
    setPartnerWebsite('');
    setPartnerHouseNum('');
    setPartnerStreet('');
    setPartnerArea('');
    setPartnerLandmark('');
    setPartnerCity('');
    setPartnerDistrict('');
    setPartnerState('');
    setPartnerZip('');
    setPartnerCountry('India');
    setEditingPartnerAddressId(null);
    setShowPartnerForm(false);
  };

  const handleDeletePartnerAddress = (id: string) => {
    if (confirm("Are you sure you want to delete this supplier/partner address?")) {
      const updated = partnerAddressesList.filter(item => item.id !== id);
      savePartnerAddressesToLocal(updated);
    }
  };

  const handleEditPartnerAddressClick = (addr: any) => {
    setEditingPartnerAddressId(addr.id);
    setPartnerName(addr.partnerName);
    setPartnerContact(addr.contactPerson);
    setPartnerPhone(addr.phone);
    setPartnerAltPhone(addr.altPhone || '');
    setPartnerEmail(addr.email);
    setPartnerGstn(addr.gstn || '');
    setPartnerWebsite(addr.website || '');
    setPartnerHouseNum(addr.houseNum);
    setPartnerStreet(addr.street);
    setPartnerArea(addr.area);
    setPartnerLandmark(addr.landmark || '');
    setPartnerCity(addr.city);
    setPartnerDistrict(addr.district);
    setPartnerState(addr.state);
    setPartnerZip(addr.zipCode);
    setPartnerCountry(addr.country || 'India');
    setShowPartnerForm(true);
  };

  const saveDeliveryPartnersToLocal = (list: any[]) => {
    setDeliveryPartnersList(list);
    localStorage.setItem('ky_local_delivery_partners', JSON.stringify(list));
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !deliveryName.trim() ||
      !deliveryContact.trim() ||
      !deliveryPhone.trim() ||
      !deliveryEmail.trim() ||
      !deliveryHouseNum.trim() ||
      !deliveryStreet.trim() ||
      !deliveryArea.trim() ||
      !deliveryCity.trim() ||
      !deliveryDistrict.trim() ||
      !deliveryState.trim() ||
      !deliveryZip.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const deliveryData = {
      partnerName: deliveryName,
      contactPerson: deliveryContact,
      phone: deliveryPhone,
      altPhone: deliveryAltPhone,
      email: deliveryEmail,
      gstn: deliveryGstn,
      website: deliveryWebsite,
      houseNum: deliveryHouseNum,
      street: deliveryStreet,
      area: deliveryArea,
      landmark: deliveryLandmark,
      city: deliveryCity,
      district: deliveryDistrict,
      state: deliveryState,
      zipCode: deliveryZip,
      country: deliveryCountry
    };

    if (editingDeliveryId) {
      const updated = deliveryPartnersList.map(item => 
        item.id === editingDeliveryId
          ? { ...deliveryData, id: editingDeliveryId }
          : item
      );
      saveDeliveryPartnersToLocal(updated);
    } else {
      const newPartner = {
        ...deliveryData,
        id: `delivery-partner-${Date.now()}`
      };
      saveDeliveryPartnersToLocal([newPartner, ...deliveryPartnersList]);
    }

    // Reset Form
    setDeliveryName('');
    setDeliveryContact('');
    setDeliveryPhone('');
    setDeliveryAltPhone('');
    setDeliveryEmail('');
    setDeliveryGstn('');
    setDeliveryWebsite('');
    setDeliveryHouseNum('');
    setDeliveryStreet('');
    setDeliveryArea('');
    setDeliveryLandmark('');
    setDeliveryCity('');
    setDeliveryDistrict('');
    setDeliveryState('');
    setDeliveryZip('');
    setDeliveryCountry('India');
    setEditingDeliveryId(null);
    setShowDeliveryForm(false);
  };

  const handleDeleteDelivery = (id: string) => {
    if (confirm("Are you sure you want to delete this delivery partner/channel?")) {
      const updated = deliveryPartnersList.filter(item => item.id !== id);
      saveDeliveryPartnersToLocal(updated);
    }
  };

  const handleEditDeliveryClick = (partner: any) => {
    setEditingDeliveryId(partner.id);
    setDeliveryName(partner.partnerName);
    setDeliveryContact(partner.contactPerson);
    setDeliveryPhone(partner.phone);
    setDeliveryAltPhone(partner.altPhone || '');
    setDeliveryEmail(partner.email);
    setDeliveryGstn(partner.gstn || '');
    setDeliveryWebsite(partner.website || '');
    setDeliveryHouseNum(partner.houseNum);
    setDeliveryStreet(partner.street);
    setDeliveryArea(partner.area);
    setDeliveryLandmark(partner.landmark || '');
    setDeliveryCity(partner.city);
    setDeliveryDistrict(partner.district);
    setDeliveryState(partner.state);
    setDeliveryZip(partner.zipCode);
    setDeliveryCountry(partner.country || 'India');
    setShowDeliveryForm(true);
  };

  // Sync default cost price on product selection
  useEffect(() => {
    if (productsList.length > 0 && !poProdId) {
      setPoProdId(productsList[0].id);
      setPoCost(Math.round(productsList[0].price * 0.60));
    }
  }, [productsList, poProdId]);

  const handlePOProdIdChange = (prodId: string) => {
    setPoProdId(prodId);
    const prod = productsList.find(p => p.id === prodId);
    if (prod) {
      setPoCost(Math.round(prod.price * 0.60));
    }
  };

  // Add item to draft PO
  const handleAddItemToPO = () => {
    if (!poProdId) return;
    const prod = productsList.find(p => p.id === poProdId);
    if (!prod) return;

    const exists = poItems.find(item => item.productId === poProdId);
    if (exists) {
      setPoItems(poItems.map(item => 
        item.productId === poProdId 
          ? { ...item, quantity: item.quantity + poQty }
          : item
      ));
    } else {
      setPoItems([...poItems, {
        productId: poProdId,
        title: prod.title,
        quantity: poQty,
        unitCost: poCost
      }]);
    }

    setPoQty(1);
    if (productsList.length > 0) {
      const defaultProd = productsList.find(p => p.id === poProdId) || productsList[0];
      setPoCost(Math.round(defaultProd.price * 0.60));
    }
  };

  // Remove item from draft PO
  const handleRemoveItemFromPO = (prodId: string) => {
    setPoItems(poItems.filter(item => item.productId !== prodId));
  };

  // Submit PO
  const handlePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (poItems.length === 0) {
      alert("Please add at least one item to the Purchase Order.");
      return;
    }

    const subtotal = poItems.reduce((acc, item) => acc + item.quantity * item.unitCost, 0);
    const gst = Math.round(subtotal * 0.18);
    const totalCost = subtotal + gst;

    const newPO = {
      id: `PO-${new Date().getFullYear()}-${String(purchaseOrdersList.length + 1).padStart(3, '0')}`,
      supplierName: poSupplier,
      items: poItems,
      totalCost,
      status: 'Sent',
      createdAt: new Date().toISOString(),
      deliveryPartner: poDeliveryPartner || undefined,
      notes: poNotes || undefined
    };

    const updatedList = [newPO, ...purchaseOrdersList];
    savePOsToLocal(updatedList);

    setPoItems([]);
    setPoSupplier('KY Electronics Wholesale');
    setPoDeliveryPartner('');
    setPoNotes('');
    setShowPoDelivery(false);
    setShowPoNotes(false);
    setShowPOForm(false);
  };

  // Mark PO as Received (Restocks inventory!)
  const handleMarkPOReceived = (poId: string) => {
    const po = purchaseOrdersList.find(p => p.id === poId);
    if (!po) return;

    if (confirm(`Mark Purchase Order ${poId} as RECEIVED? This will automatically increment stock levels for all items inside the PO.`)) {
      const updatedProducts = productsList.map(prod => {
        const poItem = po.items.find((item: any) => item.productId === prod.id);
        if (poItem) {
          return {
            ...prod,
            stock: prod.stock + poItem.quantity
          };
        }
        return prod;
      });
      saveProductsToLocal(updatedProducts);

      const updatedPOs = purchaseOrdersList.map(p => 
        p.id === poId 
          ? { ...p, status: 'Received', receivedAt: new Date().toISOString() }
          : p
      );
      savePOsToLocal(updatedPOs);
    }
  };

  // Cancel PO
  const handleCancelPO = (poId: string) => {
    if (confirm(`Are you sure you want to cancel Purchase Order ${poId}?`)) {
      const updatedPOs = purchaseOrdersList.map(p => 
        p.id === poId 
          ? { ...p, status: 'Cancelled' }
          : p
      );
      savePOsToLocal(updatedPOs);
    }
  };

  // Delete PO
  const handleDeletePO = (poId: string) => {
    if (confirm(`Delete Purchase Order ${poId} from logs permanently?`)) {
      const updatedPOs = purchaseOrdersList.filter(p => p.id !== poId);
      savePOsToLocal(updatedPOs);
    }
  };

  if (!user || user.role !== 'admin') return null;

  // Analytics Math
  const totalSalesVal = ordersList.reduce((acc, o) => acc + o.total, 0);
  const lowStockCount = productsList.filter(p => p.stock <= 15).length;

  const sidebarTabs = [
    { id: 'dashboard', label: 'Analytics Panel', icon: LayoutDashboard },
    { id: 'products', label: 'Product Control', icon: ShoppingBag },
    { id: 'orders', label: 'Order Dispatch', icon: ClipboardList },
    { id: 'coupons', label: 'Coupon Builder', icon: Tag },
    { id: 'stock', label: 'Inventory Alerts', icon: AlertTriangle },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: FileText },
    { id: 'addresses', label: 'Shipping Addresses', icon: MapPin },
    { id: 'partner-addresses', label: 'Supplier / Partner Address', icon: Building },
    { id: 'delivery-partners', label: 'Delivery Partner / Channel', icon: Truck }
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full bg-slate-50 dark:bg-slate-900/40">
        
        {/* ADMIN HEADER */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,rgba(255,115,0,0.15),rgba(255,255,255,0))]"></div>
          <div className="relative z-10">
            <span className="bg-accent-orange-500 text-white font-extrabold uppercase text-[9px] px-2.5 py-1 rounded-full border border-white/10 tracking-widest">Administrator Portal</span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">Console Operations Dashboard</h1>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="relative z-10 px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-full border border-white/15 transition-all text-center"
          >
            My Profile Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR TABS */}
          <nav className="lg:col-span-3 space-y-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 p-4 rounded-2xl shadow-sm">
            {sidebarTabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

          {/* MAIN WORKSPACE VIEW */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[500px]">
            
            {/* 1. ANALYTICS PANEL */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-slate-55 pb-3">
                  <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Store Analytics Summary</h2>
                  <p className="text-xs text-slate-400">Store performance statistics metrics overview.</p>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-1 relative">
                    <span className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl w-fit block"><DollarSign className="h-4 w-4" /></span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Sales</p>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">₹{totalSalesVal.toLocaleString()}</h3>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-1 relative">
                    <span className="p-2 bg-primary-blue-50 dark:bg-primary-blue-950/20 text-primary-blue-500 rounded-xl w-fit block"><FileText className="h-4 w-4" /></span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Orders</p>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{ordersList.length}</h3>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-1 relative">
                    <span className="p-2 bg-accent-orange-50 dark:bg-accent-orange-950/20 text-accent-orange-500 rounded-xl w-fit block"><ShoppingBag className="h-4 w-4" /></span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Catalog Items</p>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{productsList.length}</h3>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-1 relative">
                    <span className={`p-2 rounded-xl w-fit block ${lowStockCount > 0 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}><AlertTriangle className="h-4 w-4" /></span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Low Stock</p>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{lowStockCount}</h3>
                  </div>
                </div>

                {/* SVG Performance Chart */}
                <div className="border border-slate-100 dark:border-slate-700/60 rounded-2xl p-5 space-y-4">
                  {/* Filter Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/50 pb-3">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-primary-blue-500" />
                      Store Performance Analytics
                    </h3>
                    
                    {/* Timeframe selector tab buttons */}
                    <div className="flex bg-slate-50 dark:bg-slate-900 rounded-xl p-1 border border-slate-150 dark:border-slate-800 shrink-0">
                      {(['day', 'month', 'year'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setAnalyticsTimeframe(mode)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                            analyticsTimeframe === mode
                              ? 'bg-slate-900 text-white dark:bg-slate-850 shadow-sm'
                              : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
                          }`}
                        >
                          {mode === 'day' ? 'Day-wise' : mode === 'month' ? 'Month-wise' : 'Year-wise'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prepare Chart Data */}
                  {(() => {
                    let chartData: { label: string; val: number }[] = [];
                    let chartTitle = "";
                    let maxVal = 60000;

                    if (analyticsTimeframe === 'day') {
                      chartTitle = "Simulated Weekly Sales (Day-wise)";
                      chartData = [
                        { label: "Mon", val: 12000 },
                        { label: "Tue", val: 15000 },
                        { label: "Wed", val: 28000 },
                        { label: "Thu", val: 45000 },
                        { label: "Fri", val: 32000 },
                        { label: "Sat", val: 51000 },
                        { label: "Sun", val: totalSalesVal || 53409 }
                      ];
                      maxVal = Math.max(...chartData.map(d => d.val), 60000) * 1.1;
                    } else if (analyticsTimeframe === 'month') {
                      chartTitle = "Simulated Yearly Sales (Month-wise)";
                      chartData = [
                        { label: "Jan", val: 45000 },
                        { label: "Feb", val: 58000 },
                        { label: "Mar", val: 75000 },
                        { label: "Apr", val: 92000 },
                        { label: "May", val: 110000 },
                        { label: "Jun", val: 125000 + totalSalesVal },
                        { label: "Jul", val: 135000 },
                        { label: "Aug", val: 140000 },
                        { label: "Sep", val: 160000 },
                        { label: "Oct", val: 185000 },
                        { label: "Nov", val: 210000 },
                        { label: "Dec", val: 245000 }
                      ];
                      maxVal = Math.max(...chartData.map(d => d.val), 250000) * 1.1;
                    } else {
                      chartTitle = "Simulated Year-over-Year Sales (Year-wise)";
                      chartData = [
                        { label: "2023", val: 850000 },
                        { label: "2024", val: 1450000 },
                        { label: "2025", val: 2100000 },
                        { label: "2026", val: 2600000 + totalSalesVal },
                        { label: "2027", val: 3100000 }
                      ];
                      maxVal = Math.max(...chartData.map(d => d.val), 3200000) * 1.1;
                    }

                    const formatChartVal = (val: number) => {
                      if (val >= 100000) {
                        return `₹${(val / 100000).toFixed(1)}L`; // Lakhs for Rupee
                      }
                      return `₹${(val / 1000).toFixed(1)}k`; // Thousands
                    };

                    return (
                      <div className="space-y-3">
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">{chartTitle}</p>
                        
                        {/* Clean SVG Chart */}
                        <div className="w-full h-48 relative overflow-hidden bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-100/50 dark:border-slate-800/40 flex items-end justify-between gap-1.5 sm:gap-2.5 overflow-x-auto scrollbar-thin">
                          {chartData.map((item, idx) => {
                            const barHeightPercent = (item.val / maxVal) * 75; // Clamp max height to 75% to leave room for label
                            return (
                              <div key={idx} className="flex flex-col items-center gap-2 flex-grow h-full justify-end min-w-[36px]">
                                <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 whitespace-nowrap">{formatChartVal(item.val)}</span>
                                <div 
                                  className="w-full max-w-[28px] bg-gradient-to-t from-primary-blue-500 to-accent-orange-500 hover:from-primary-blue-600 hover:to-accent-orange-600 rounded-t-lg transition-all duration-700"
                                  style={{ height: `${Math.max(barHeightPercent, 5)}%` }} // Minimum height 5%
                                ></div>
                                <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-400">{item.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>
            )}

            {/* 2. PRODUCT CONTROL TAB */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Product Catalog Manager</h2>
                    <p className="text-xs text-slate-400">Add, edit, or delete items inside the store catalog.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProdTitle('');
                      setProdDesc('');
                      setProdPrice(0);
                      setProdOrigPrice(0);
                      setProdStock(0);
                      setProdImg('');
                      setProdListingType('buy');
                      setProdRentalDay(0);
                      setProdRentalWeek(0);
                      setProdRentalMonth(0);
                      setProdSecurityDeposit(0);
                      setShowProductForm(!showProductForm);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-950 dark:bg-slate-750 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    {showProductForm ? 'Cancel' : (
                      <>
                        <Plus className="h-4 w-4" /> Add Product
                      </>
                    )}
                  </button>
                </div>

                {/* PRODUCT EDIT FORM CONTAINER */}
                {showProductForm && (
                  <form onSubmit={handleProductSubmit} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4 max-w-xl text-xs font-semibold animate-fadeIn">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {editingProduct ? 'Edit Product details' : 'New Product Details'}
                    </h3>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Product Title</label>
                      <input
                        type="text" required placeholder="e.g. Wireless Gaming Mouse"
                        value={prodTitle} onChange={(e) => setProdTitle(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Description</label>
                      <textarea
                        rows={3} placeholder="Full item description..."
                        value={prodDesc} onChange={(e) => setProdDesc(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800 font-medium"
                      ></textarea>
                    </div>

                    {/* Deal Category selection */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Deal Category (Listing Type)</label>
                      <select
                        value={prodListingType}
                        onChange={(e) => setProdListingType(e.target.value as 'buy' | 'rent')}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800 font-extrabold text-slate-800 dark:text-slate-200"
                      >
                        <option value="buy">BUY PRODUCT</option>
                        <option value="rent">RENTAL PRODUCT</option>
                      </select>
                    </div>

                    {prodListingType === 'buy' ? (
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Selling Price (₹)</label>
                          <input
                            type="number" required min="1"
                            value={prodPrice} onChange={(e) => setProdPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">MRP Price (₹)</label>
                          <input
                            type="number" required min="1"
                            value={prodOrigPrice} onChange={(e) => setProdOrigPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Stock (Availability)</label>
                          <input
                            type="number" required min="0"
                            value={prodStock} onChange={(e) => setProdStock(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Rent / Day (₹)</label>
                            <input
                              type="number" required min="1"
                              value={prodRentalDay} onChange={(e) => setProdRentalDay(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Rent / Week (₹)</label>
                            <input
                              type="number" required min="1"
                              value={prodRentalWeek} onChange={(e) => setProdRentalWeek(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Rent / Month (₹)</label>
                            <input
                              type="number" required min="1"
                              value={prodRentalMonth} onChange={(e) => setProdRentalMonth(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Security Deposit (₹)</label>
                            <input
                              type="number" required min="0"
                              value={prodSecurityDeposit} onChange={(e) => setProdSecurityDeposit(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Stock (Availability)</label>
                            <input
                              type="number" required min="0"
                              value={prodStock} onChange={(e) => setProdStock(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                        <select
                          value={prodCat} onChange={(e) => setProdCat(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                        >
                          {categoriesList.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Product Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text" required placeholder="Image URL (Unsplash, etc.) or upload..."
                            value={prodImg} onChange={(e) => setProdImg(e.target.value)}
                            className="flex-grow px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                          />
                          <label className="px-4 py-2 bg-slate-900 hover:bg-slate-950 dark:bg-slate-750 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center shrink-0 cursor-pointer shadow-sm select-none border border-slate-200/10 transition-all hover:scale-102">
                            Browse
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    if (event.target?.result) {
                                      setProdImg(event.target.result as string);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {prodImg && (
                          <div className="mt-2 h-12 w-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 relative group">
                            <img src={prodImg} alt="Preview" className="object-cover h-full w-full" />
                            <button
                              type="button"
                              onClick={() => setProdImg('')}
                              className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold uppercase tracking-wider"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-xl font-bold transition-all shadow-md"
                    >
                      {editingProduct ? 'Save Product Details' : 'Publish Product'}
                    </button>
                  </form>
                )}

                {/* PRODUCTS TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-700">
                    <thead>
                      <tr className="text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                      {productsList.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                          <td className="py-3.5 px-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 dark:border-slate-700 shrink-0">
                              <img src={product.image} alt={product.title} className="object-cover h-full w-full" />
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{product.title}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-900 dark:text-white font-extrabold">₹{product.price.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-slate-400 capitalize">{product.category.replace('-', ' ')}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              product.stock <= 15 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {product.stock} left
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1 shrink-0 whitespace-nowrap">
                            <button 
                              onClick={() => handleEditProductClick(product)}
                              className="p-2 text-slate-400 hover:text-primary-blue-500 hover:bg-primary-blue-50 dark:hover:bg-primary-blue-950/20 rounded transition-all"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-slate-400 hover:text-red-550 hover:text-red-550 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* 3. ORDER DISPATCH TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-50 pb-3">
                  <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Order Dispatch Logs</h2>
                  <p className="text-xs text-slate-450 text-slate-450">Review billing totals, customer accounts, and edit delivery statuses.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-700">
                    <thead>
                      <tr className="text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Total Price</th>
                        <th className="py-3 px-4">Dispatch Status</th>
                        <th className="py-3 px-4">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium text-slate-655 text-slate-500 dark:text-slate-350">
                      {ordersList.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">#{order.id}</td>
                          <td className="py-3.5 px-4 truncate max-w-[120px]">{order.email || 'buyer@gmail.com'}</td>
                          <td className="py-3.5 px-4 text-slate-900 dark:text-white font-extrabold">₹{order.total.toLocaleString()}</td>
                          <td className="py-3.5 px-4">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                              className="px-2 py-1 rounded bg-slate-100 border border-slate-200 font-bold focus:outline-none text-[10px]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="bg-emerald-50 text-emerald-600 font-extrabold uppercase text-[9px] px-2 py-0.5 rounded border border-emerald-100">
                              {order.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* 4. COUPON BUILDER TAB */}
            {activeTab === 'coupons' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-50 dark:border-slate-700/50 pb-3">
                  <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Promo Code Builder</h2>
                  <p className="text-xs text-slate-400">Generate discount coupon codes for checkout shopping carts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Add coupon form */}
                  <form onSubmit={handleAddCoupon} className="md:col-span-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4 text-xs font-semibold">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-450 dark:text-slate-500">Create New Coupon</h4>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Promo Code</label>
                      <input
                        type="text" required placeholder="e.g. MEGA30"
                        value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800 font-bold uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Discount %</label>
                        <input
                          type="number" required min="5" max="90"
                          value={couponDiscount} onChange={(e) => setCouponDiscount(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Min Purchase (₹)</label>
                        <input
                          type="number" required min="100"
                          value={couponMin} onChange={(e) => setCouponMin(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer"
                    >
                      Generate Coupon
                    </button>
                  </form>

                  {/* Coupons list grid */}
                  <div className="md:col-span-7 space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-50 pb-2">Active Store Coupons</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {couponsList.map((c) => (
                        <div key={c.code} className="border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 flex justify-between items-center text-xs bg-white dark:bg-slate-800">
                          <div className="space-y-1 text-slate-500 dark:text-slate-400 font-semibold">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-slate-800 dark:text-slate-150 uppercase flex items-center gap-0.5 bg-primary-blue-50 dark:bg-primary-blue-950/20 text-primary-blue-500 px-2 py-0.5 rounded border border-primary-blue-100 dark:border-primary-blue-900/50">
                                <Percent className="h-3 w-3" />
                                {c.code}
                              </span>
                              <span className="font-black text-emerald-600">{c.discountPercent}% Off</span>
                            </div>
                            <p className="text-[10px]">Min. purchase: ₹{c.minPurchase.toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteCoupon(c.code)}
                            className="p-2 text-slate-400 hover:text-red-550 hover:bg-red-550 hover:bg-red-550 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-all cursor-pointer"
                            aria-label="Remove Coupon"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. SUPPLIER / PARTNER ADDRESSES TAB */}
            {activeTab === 'partner-addresses' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-700 pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Supplier / Partner Address Directory</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Manage details and locations of supply chain partners.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (showPartnerForm) {
                        setPartnerName('');
                        setPartnerContact('');
                        setPartnerPhone('');
                        setPartnerAltPhone('');
                        setPartnerEmail('');
                        setPartnerGstn('');
                        setPartnerWebsite('');
                        setPartnerHouseNum('');
                        setPartnerStreet('');
                        setPartnerArea('');
                        setPartnerLandmark('');
                        setPartnerCity('');
                        setPartnerDistrict('');
                        setPartnerState('');
                        setPartnerZip('');
                        setPartnerCountry('India');
                        setEditingPartnerAddressId(null);
                      }
                      setShowPartnerForm(!showPartnerForm);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-950 dark:bg-slate-750 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {showPartnerForm ? 'Cancel' : (
                      <>
                        <Plus className="h-4 w-4" /> Add Address
                      </>
                    )}
                  </button>
                </div>

                {/* PARTNER FORM */}
                {showPartnerForm && (
                  <form onSubmit={handlePartnerAddressSubmit} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-6 max-w-2xl animate-fadeIn">
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      {editingPartnerAddressId ? 'Edit Partner Address' : 'Add Partner Address'}
                    </h3>

                    {/* Partner Information */}
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-primary-blue-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">Supplier / Partner Profile</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Partner / Company Name <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. KY Electronics Wholesale"
                            value={partnerName} onChange={(e) => setPartnerName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Contact Person Name <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Rajesh Kumar"
                            value={partnerContact} onChange={(e) => setPartnerContact(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Mobile Number <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. +91 9988776655"
                            value={partnerPhone} onChange={(e) => setPartnerPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Alternate Mobile (Optional)</label>
                          <input
                            type="text" placeholder="e.g. +91 8877665544"
                            value={partnerAltPhone} onChange={(e) => setPartnerAltPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Email Address <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="email" required placeholder="e.g. wholesale@kyelectronics.com"
                            value={partnerEmail} onChange={(e) => setPartnerEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">GSTN No</label>
                          <input
                            type="text" placeholder="e.g. 07AAAAA1111A1Z1"
                            value={partnerGstn} onChange={(e) => setPartnerGstn(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Website</label>
                        <input
                          type="url" placeholder="e.g. https://wholesale.kyelectronics.com"
                          value={partnerWebsite} onChange={(e) => setPartnerWebsite(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                        />
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-accent-orange-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">Supplier / Partner Address</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">House/Flat/Building Number <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Building A"
                            value={partnerHouseNum} onChange={(e) => setPartnerHouseNum(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Street/Road Name <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Okhla Industrial Area"
                            value={partnerStreet} onChange={(e) => setPartnerStreet(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Area/Locality <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Okhla"
                            value={partnerArea} onChange={(e) => setPartnerArea(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Landmark (Optional)</label>
                          <input
                            type="text" placeholder="e.g. Near Metro Station"
                            value={partnerLandmark} onChange={(e) => setPartnerLandmark(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Village/Town/City <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. New Delhi"
                            value={partnerCity} onChange={(e) => setPartnerCity(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">District <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. South Delhi"
                            value={partnerDistrict} onChange={(e) => setPartnerDistrict(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">State <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Delhi"
                            value={partnerState} onChange={(e) => setPartnerState(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">PIN Code <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. 110020"
                            value={partnerZip} onChange={(e) => setPartnerZip(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Country <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. India"
                            value={partnerCountry} onChange={(e) => setPartnerCountry(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      {editingPartnerAddressId ? 'Update Partner Details' : 'Save Partner Coordinates'}
                    </button>
                  </form>
                )}

                {/* PARTNER LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {partnerAddressesList.map((addr) => (
                    <div key={addr.id} className="border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 space-y-4 relative text-xs bg-white dark:bg-slate-800 shadow-sm flex flex-col justify-between">
                      {/* Actions */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditPartnerAddressClick(addr)}
                          className="p-1.5 text-slate-400 hover:text-primary-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded transition-all cursor-pointer"
                          aria-label="Edit Partner Address"
                          type="button"
                        >
                          <Edit3 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePartnerAddress(addr.id)}
                          className="p-1.5 text-slate-400 hover:text-red-550 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-all cursor-pointer"
                          aria-label="Delete Partner Address"
                          type="button"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* Profile Info */}
                        <div className="space-y-1 pr-14 border-b border-slate-50 dark:border-slate-700 pb-2">
                          <h4 className="font-extrabold text-slate-800 dark:text-slate-150 text-sm">{addr.partnerName}</h4>
                          <p className="font-bold text-slate-655 text-slate-600 dark:text-slate-350">Contact: {addr.contactPerson}</p>
                          <p className="font-bold text-slate-700 dark:text-slate-350">Phone: {addr.phone} {addr.altPhone ? `| Alt: ${addr.altPhone}` : ''}</p>
                          <p className="text-slate-500 dark:text-slate-400">Email: {addr.email}</p>
                          {addr.gstn && <p className="text-slate-500 dark:text-slate-400">GSTN: <span className="font-bold uppercase text-primary-blue-500">{addr.gstn}</span></p>}
                          {addr.website && <p className="text-slate-500 dark:text-slate-400">Website: <a href={addr.website} target="_blank" rel="noopener noreferrer" className="text-primary-blue-500 hover:underline">{addr.website}</a></p>}
                        </div>

                        {/* Location Details */}
                        <div className="space-y-1 text-slate-500 dark:text-slate-400 font-medium pt-1">
                          <p className="font-bold text-slate-700 dark:text-slate-300">Address Details:</p>
                          <p className="text-slate-600 dark:text-slate-350">{addr.houseNum}, {addr.street}</p>
                          <p className="text-slate-600 dark:text-slate-350">{addr.area} {addr.landmark ? `(Landmark: ${addr.landmark})` : ''}</p>
                          <p className="text-slate-600 dark:text-slate-350">{addr.city}, {addr.district}</p>
                          <p className="text-slate-600 dark:text-slate-350">{addr.state} - {addr.zipCode}</p>
                          <p className="font-bold uppercase tracking-wider text-[10px] text-slate-400 mt-1">{addr.country}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {partnerAddressesList.length === 0 && (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-sm text-slate-400">No partner addresses saved. Click "Add Address" to store one.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 9. DELIVERY PARTNER / CHANNEL TAB */}
            {activeTab === 'delivery-partners' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-700 pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 font-outfit">Delivery Partner / Channel</h2>
                    <p className="text-xs text-slate-455 text-slate-400 mt-0.5">Manage delivery channels, tracking websites, and shipping provider coordinates.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (showDeliveryForm) {
                        setDeliveryName('');
                        setDeliveryContact('');
                        setDeliveryPhone('');
                        setDeliveryAltPhone('');
                        setDeliveryEmail('');
                        setDeliveryGstn('');
                        setDeliveryWebsite('');
                        setDeliveryHouseNum('');
                        setDeliveryStreet('');
                        setDeliveryArea('');
                        setDeliveryLandmark('');
                        setDeliveryCity('');
                        setDeliveryDistrict('');
                        setDeliveryState('');
                        setDeliveryZip('');
                        setDeliveryCountry('India');
                        setEditingDeliveryId(null);
                      }
                      setShowDeliveryForm(!showDeliveryForm);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-950 dark:bg-slate-750 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {showDeliveryForm ? 'Cancel' : (
                      <>
                        <Plus className="h-4 w-4" /> Add Partner/Channel
                      </>
                    )}
                  </button>
                </div>

                {/* DELIVERY ADD FORM CONTAINER */}
                {showDeliveryForm && (
                  <form onSubmit={handleDeliverySubmit} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-6 max-w-2xl animate-fadeIn">
                    
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-150 uppercase tracking-wider">
                      {editingDeliveryId ? 'Edit Delivery Partner' : 'Add New Delivery Partner'}
                    </h3>

                    {/* Partner Information Section */}
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-xs uppercase tracking-wider text-primary-blue-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">Partner Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Partner / Channel Name <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. FedEx Logistics"
                            value={deliveryName} onChange={(e) => setDeliveryName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Contact Person <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Ramesh Shah"
                            value={deliveryContact} onChange={(e) => setDeliveryContact(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Mobile Number <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. +91 9876543210"
                            value={deliveryPhone} onChange={(e) => setDeliveryPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Alternate Mobile (Optional)</label>
                          <input
                            type="text" placeholder="e.g. +91 9876543211"
                            value={deliveryAltPhone} onChange={(e) => setDeliveryAltPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Email Address <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="email" required placeholder="e.g. partner@fedex.com"
                            value={deliveryEmail} onChange={(e) => setDeliveryEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">GSTN No</label>
                          <input
                            type="text" placeholder="e.g. 07AAAAA1111A1Z1"
                            value={deliveryGstn} onChange={(e) => setDeliveryGstn(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Website / Tracking Portal URL</label>
                        <input
                          type="url" placeholder="e.g. https://www.fedex.com"
                          value={deliveryWebsite} onChange={(e) => setDeliveryWebsite(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                        />
                      </div>
                    </div>

                    {/* Address/Location Coordinates Section */}
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-xs uppercase tracking-wider text-accent-orange-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">Office/Hub Coordinates</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">House/Flat/Building Number <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Plot No 12-14"
                            value={deliveryHouseNum} onChange={(e) => setDeliveryHouseNum(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Street/Road Name <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Logistics Boulevard"
                            value={deliveryStreet} onChange={(e) => setDeliveryStreet(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Area/Locality <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Industrial Area Phase 2"
                            value={deliveryArea} onChange={(e) => setDeliveryArea(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Landmark (Optional)</label>
                          <input
                            type="text" placeholder="e.g. Near Cargo Complex"
                            value={deliveryLandmark} onChange={(e) => setDeliveryLandmark(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Village/Town/City <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Gurugram"
                            value={deliveryCity} onChange={(e) => setDeliveryCity(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">District <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Gurugram"
                            value={deliveryDistrict} onChange={(e) => setDeliveryDistrict(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">State <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. Haryana"
                            value={deliveryState} onChange={(e) => setDeliveryState(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">PIN Code <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. 122001"
                            value={deliveryZip} onChange={(e) => setDeliveryZip(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Country <span className="text-accent-orange-500 ml-1 font-bold">*</span></label>
                          <input
                            type="text" required placeholder="e.g. India"
                            value={deliveryCountry} onChange={(e) => setDeliveryCountry(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      {editingDeliveryId ? 'Update Partner Details' : 'Save Partner Details'}
                    </button>
                  </form>
                )}

                {/* PARTNER LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {deliveryPartnersList.map((partner) => (
                    <div key={partner.id} className="border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 space-y-4 relative text-xs bg-white dark:bg-slate-800 shadow-sm flex flex-col justify-between">
                      {/* Actions */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditDeliveryClick(partner)}
                          className="p-1.5 text-slate-400 hover:text-primary-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded transition-all cursor-pointer"
                          aria-label="Edit Delivery Partner"
                          type="button"
                        >
                          <Edit3 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDelivery(partner.id)}
                          className="p-1.5 text-slate-400 hover:text-red-550 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-all cursor-pointer"
                          aria-label="Delete Delivery Partner"
                          type="button"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* Profile Info */}
                        <div className="space-y-1 pr-14 border-b border-slate-50 dark:border-slate-700 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1 bg-accent-orange-50 dark:bg-accent-orange-950/20 text-accent-orange-500 rounded"><Truck className="h-4 w-4" /></span>
                            <h4 className="font-extrabold text-slate-800 dark:text-slate-150 text-sm">{partner.partnerName}</h4>
                          </div>
                          <p className="font-bold text-slate-655 text-slate-600 dark:text-slate-350 mt-1">Contact: {partner.contactPerson}</p>
                          <p className="font-bold text-slate-700 dark:text-slate-350">Phone: {partner.phone} {partner.altPhone ? `| Alt: ${partner.altPhone}` : ''}</p>
                          <p className="text-slate-500 dark:text-slate-400">Email: {partner.email}</p>
                          {partner.gstn && <p className="text-slate-500 dark:text-slate-400">GSTN: <span className="font-bold uppercase text-primary-blue-500">{partner.gstn}</span></p>}
                          {partner.website && <p className="text-slate-500 dark:text-slate-400">Website: <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-primary-blue-500 hover:underline">{partner.website}</a></p>}
                        </div>

                        {/* Location Details */}
                        <div className="space-y-1 text-slate-500 dark:text-slate-400 font-medium pt-1">
                          <p className="font-bold text-slate-700 dark:text-slate-300">Office / Warehouse Address:</p>
                          <p className="text-slate-600 dark:text-slate-350">{partner.houseNum}, {partner.street}</p>
                          <p className="text-slate-600 dark:text-slate-350">{partner.area} {partner.landmark ? `(Landmark: ${partner.landmark})` : ''}</p>
                          <p className="text-slate-600 dark:text-slate-350">{partner.city}, {partner.district}</p>
                          <p className="text-slate-600 dark:text-slate-350">{partner.state} - {partner.zipCode}</p>
                          <p className="font-bold uppercase tracking-wider text-[10px] text-slate-400 mt-1">{partner.country}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {deliveryPartnersList.length === 0 && (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-sm text-slate-400">No delivery partners saved. Click "Add Partner/Channel" to store one.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. INVENTORY ALERTS TAB */}
            {activeTab === 'stock' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-50 pb-3">
                  <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Inventory Supply Alerts</h2>
                  <p className="text-xs text-slate-400">Warning listings for items with supply level lower than 15 units.</p>
                </div>

                <div className="space-y-3">
                  {productsList.filter(p => p.stock <= 15).map((p) => (
                    <div key={p.id} className="border border-red-100 dark:border-red-950/40 bg-red-50/20 dark:bg-red-950/5 rounded-2xl p-4 flex justify-between items-center text-xs">
                      <div className="flex gap-4 items-center min-w-0">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-50 border shrink-0">
                          <img src={p.image} alt={p.title} className="object-cover h-full w-full" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate">{p.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Category: {p.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <div>
                          <span className="bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 font-extrabold uppercase text-[9px] px-2.5 py-1 rounded-full border border-red-200">
                            Low Stock: {p.stock}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProdTitle(p.title);
                            setProdDesc(p.description || '');
                            setProdPrice(p.price);
                            setProdOrigPrice(p.originalPrice || p.price);
                            setProdStock(p.stock);
                            setProdCat(p.category);
                            setProdImg(p.image);
                            setProdListingType(p.listingType || 'buy');
                            setProdRentalDay(p.rentalPriceDay || 0);
                            setProdRentalWeek(p.rentalPriceWeek || 0);
                            setProdRentalMonth(p.rentalPriceMonth || 0);
                            setProdSecurityDeposit(p.securityDeposit || 0);
                            setShowProductForm(true);
                            setActiveTab('products');
                          }}
                          className="px-4.5 py-2 border border-primary-blue-200 dark:border-primary-blue-900/50 hover:bg-primary-blue-50 dark:hover:bg-primary-blue-950/20 text-primary-blue-500 font-bold rounded-xl transition-all"
                        >
                          Restock
                        </button>
                      </div>

                    </div>
                  ))}
                  {productsList.filter(p => p.stock <= 15).length === 0 && (
                    <div className="text-center py-12 flex flex-col items-center gap-2 text-slate-450">
                      <Check className="h-10 w-10 text-emerald-500" />
                      <p className="text-sm font-semibold">Inventory healthy. Zero low stock items.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 6. PURCHASE ORDERS TAB */}
            {activeTab === 'purchase-orders' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700/50 pb-3">
                  <div>
                    <h2 className="text-lg font-outfit font-extrabold text-slate-800 dark:text-slate-100">Purchase Order Manager</h2>
                    <p className="text-xs text-slate-400">Generate, dispatch, and track restocking supply orders from vendor channels.</p>
                  </div>
                  <button
                    onClick={() => {
                      setPoItems([]);
                      setShowPOForm(!showPOForm);
                      setSelectedPO(null);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-950 dark:bg-slate-750 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    {showPOForm ? 'Cancel' : (
                      <>
                        <Plus className="h-4 w-4" /> Create PO
                      </>
                    )}
                  </button>
                </div>

                {/* PO FORM CONTAINER */}
                {showPOForm && (
                  <form onSubmit={handlePOSubmit} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4 max-w-2xl text-xs font-semibold animate-fadeIn">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-150 pb-2 flex items-center gap-1">
                      <FileText className="h-4 w-4 text-primary-blue-500" />
                      New Purchase Order Draft
                    </h3>

                    {/* Supplier */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Select Supplier / Partner Channel</label>
                      <select
                        value={poSupplier}
                        onChange={(e) => setPoSupplier(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800 font-extrabold text-slate-800 dark:text-slate-200"
                      >
                        <option value="KY Electronics Wholesale">KY Electronics Wholesale (Electronics & Appliances)</option>
                        <option value="Vogue & Fashion Traders">Vogue & Fashion Traders (Fashion & Footwear)</option>
                        <option value="FreshGro Wholesale Co.">FreshGro Wholesale Co. (Grocery & Food)</option>
                        <option value="Mobile Accessories Depot">Mobile Accessories Depot (Cases, Chargers, Gadgets)</option>
                        <option value="Cosmetics & Beauty Supply India">Cosmetics & Beauty Supply India (Skincare & Beauty)</option>
                      </select>
                    </div>

                    {/* Add Item Row */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-150/40 dark:border-slate-700/60 p-4 rounded-xl space-y-3">
                      <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Add Catalog Product to Order</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        
                        {/* Select Product */}
                        <div className="sm:col-span-6 space-y-1">
                          <label className="text-[8px] font-extrabold uppercase text-slate-400">Select Product</label>
                          <select
                            value={poProdId}
                            onChange={(e) => handlePOProdIdChange(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-bold"
                          >
                            {productsList.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title} (Stock: {p.stock})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Cost Price */}
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[8px] font-extrabold uppercase text-slate-400">Cost Price (₹/unit)</label>
                          <input
                            type="number"
                            min="1"
                            value={poCost}
                            onChange={(e) => setPoCost(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-bold"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[8px] font-extrabold uppercase text-slate-400">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={poQty}
                            onChange={(e) => setPoQty(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-bold"
                          />
                        </div>

                        {/* Button */}
                        <div className="sm:col-span-1">
                          <button
                            type="button"
                            onClick={handleAddItemToPO}
                            className="w-full py-2 bg-slate-900 hover:bg-slate-950 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-black text-xs rounded-xl transition-all h-9 flex items-center justify-center cursor-pointer border border-transparent dark:border-slate-600"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Additional Options: Delivery Partner / Notes */}
                    <div className="flex flex-wrap gap-3 items-center pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPoDelivery(!showPoDelivery)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer shadow-sm ${
                          showPoDelivery 
                            ? 'bg-accent-orange-500 text-white border-transparent' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                        }`}
                      >
                        <Truck className="h-4 w-4" />
                        {poDeliveryPartner ? `Channel: ${poDeliveryPartner}` : 'Delivery Partner / Channel'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPoNotes(!showPoNotes)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer shadow-sm ${
                          showPoNotes 
                            ? 'bg-accent-orange-500 text-white border-transparent' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        {poNotes ? 'Edit Notes' : 'Notes'}
                      </button>
                    </div>

                    {/* Delivery Partner selection dropdown block */}
                    {showPoDelivery && (
                      <div className="space-y-1.5 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-150/40 dark:border-slate-700/60 animate-fadeIn">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Select Delivery Partner / Logistics Channel</label>
                        <select
                          value={poDeliveryPartner}
                          onChange={(e) => setPoDeliveryPartner(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-800 font-extrabold text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                        >
                          <option value="">-- None (Self Pickup / Direct Supplier Delivery) --</option>
                          {deliveryPartnersList.map((partner) => (
                            <option key={partner.id} value={partner.partnerName}>
                              {partner.partnerName} ({partner.contactPerson} - {partner.phone})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Notes text area input block */}
                    {showPoNotes && (
                      <div className="space-y-1.5 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-150/40 dark:border-slate-700/60 animate-fadeIn">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Purchase Order Special Instructions / Notes</label>
                        <textarea
                          placeholder="e.g. Please expedite shipment, keep package upright, load onto gate 3..."
                          value={poNotes}
                          onChange={(e) => setPoNotes(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-blue-500"
                        />
                      </div>
                    )}

                    {/* Added Items table */}
                    {poItems.length > 0 && (
                      <div className="border border-slate-150 dark:border-slate-700/80 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/60 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-700">
                              <th className="py-2.5 px-3">Product Description</th>
                              <th className="py-2.5 px-3 text-right">Cost Price</th>
                              <th className="py-2.5 px-3 text-center">Qty</th>
                              <th className="py-2.5 px-3 text-right">Subtotal</th>
                              <th className="py-2.5 px-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {poItems.map((item) => (
                              <tr key={item.productId} className="text-[11px] font-medium text-slate-600 dark:text-slate-350">
                                <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">{item.title}</td>
                                <td className="py-2.5 px-3 text-right">₹{item.unitCost.toLocaleString()}</td>
                                <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                                <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">₹{(item.unitCost * item.quantity).toLocaleString()}</td>
                                <td className="py-2.5 px-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItemFromPO(item.productId)}
                                    className="text-red-500 hover:text-red-600 font-bold hover:underline"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* PO Draft pricing summary block */}
                        {(() => {
                          const poSubtotal = poItems.reduce((acc, item) => acc + item.quantity * item.unitCost, 0);
                          const poGst = Math.round(poSubtotal * 0.18);
                          const poTotal = poSubtotal + poGst;

                          return (
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-150 dark:border-slate-700 text-right space-y-1.5 font-bold text-slate-500 dark:text-slate-400">
                              <div>Subtotal Cost: <span className="text-slate-800 dark:text-slate-200">₹{poSubtotal.toLocaleString()}</span></div>
                              <div>Supplier GST (18% tax): <span className="text-slate-800 dark:text-slate-200">₹{poGst.toLocaleString()}</span></div>
                              <div className="text-sm font-extrabold border-t border-slate-200 dark:border-slate-700/60 pt-2 text-slate-950 dark:text-white">
                                Grand PO Total: <span className="text-primary-blue-500 font-black">₹{poTotal.toLocaleString()}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={poItems.length === 0}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-md cursor-pointer ${
                          poItems.length === 0
                            ? 'bg-slate-100 text-slate-450 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed shadow-none'
                            : 'bg-accent-orange-500 hover:bg-accent-orange-600 text-white'
                        }`}
                      >
                        Dispatch Purchase Order (Sent)
                      </button>
                    </div>
                  </form>
                )}

                {/* PO DETAIL POPUP MODAL */}
                {selectedPO && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 w-full max-w-xl shadow-xl space-y-4 animate-scaleUp text-xs font-semibold relative text-left">
                      <button 
                        onClick={() => setSelectedPO(null)}
                        className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-all"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      <div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          selectedPO.status === 'Received'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20'
                            : selectedPO.status === 'Cancelled'
                            ? 'bg-red-50 text-red-500 border border-red-100 dark:bg-red-950/20'
                            : 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20'
                        }`}>
                          {selectedPO.status}
                        </span>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2 font-outfit">Purchase Order Details</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">PO ID: {selectedPO.id} • Created: {new Date(selectedPO.createdAt).toLocaleString()}</p>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-2xl border border-slate-150/40 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold space-y-1">
                        <div>Supplier Partner: <span className="text-slate-800 dark:text-slate-200">{selectedPO.supplierName}</span></div>
                        {selectedPO.deliveryPartner && (
                          <div>Logistics Channel: <span className="text-primary-blue-500">{selectedPO.deliveryPartner}</span></div>
                        )}
                        {selectedPO.notes && (
                          <div className="text-[11px] mt-1 border-t border-slate-200/50 dark:border-slate-700/60 pt-1 text-slate-650 dark:text-slate-350">
                            PO Notes: <span className="font-normal italic">"{selectedPO.notes}"</span>
                          </div>
                        )}
                        {selectedPO.receivedAt && (
                          <div className="text-emerald-600 dark:text-emerald-450 font-bold">
                            Inventory Received At: {new Date(selectedPO.receivedAt).toLocaleString()}
                          </div>
                        )}
                      </div>

                      {/* Items Details table */}
                      <div className="border border-slate-150 dark:border-slate-700/80 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/60 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-700">
                              <th className="py-2.5 px-3">Product</th>
                              <th className="py-2.5 px-3 text-right">Cost Price</th>
                              <th className="py-2.5 px-3 text-center">Qty</th>
                              <th className="py-2.5 px-3 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {selectedPO.items.map((item: any) => (
                              <tr key={item.productId} className="text-[11px] font-medium text-slate-600 dark:text-slate-350">
                                <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">{item.title}</td>
                                <td className="py-2.5 px-3 text-right">₹{item.unitCost.toLocaleString()}</td>
                                <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                                <td className="py-2.5 px-3 text-right font-bold text-slate-850 dark:text-slate-100">₹{(item.unitCost * item.quantity).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="p-3 text-right font-black text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/40 border-t border-slate-150 dark:border-slate-700">
                          PO Grand Total: <span className="text-primary-blue-500">₹{selectedPO.totalCost.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        {selectedPO.status === 'Sent' && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                handleMarkPOReceived(selectedPO.id);
                                setSelectedPO(null);
                              }}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm transition-all"
                            >
                              <Check className="h-4 w-4" /> Mark Received
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleCancelPO(selectedPO.id);
                                setSelectedPO(null);
                              }}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm transition-all"
                            >
                              <X className="h-4 w-4" /> Cancel PO
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedPO(null)}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all"
                        >
                          Close Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PO LIST TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-700">
                    <thead>
                      <tr className="text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">PO ID</th>
                        <th className="py-3 px-4">Supplier Partner</th>
                        <th className="py-3 px-4">Created Date</th>
                        <th className="py-3 px-4">Total Cost</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                      {purchaseOrdersList.map((po) => (
                        <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{po.id}</td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-350 font-semibold">
                            <div>{po.supplierName}</div>
                            {po.deliveryPartner && (
                              <div className="text-[9px] text-primary-blue-500 font-bold flex items-center gap-1 mt-0.5">
                                <Truck className="h-3 w-3" /> {po.deliveryPartner}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-450 text-slate-400">{new Date(po.createdAt).toLocaleDateString()}</td>
                          <td className="py-3.5 px-4 text-slate-900 dark:text-white font-extrabold">₹{po.totalCost.toLocaleString()}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider border ${
                              po.status === 'Received'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20'
                                : po.status === 'Cancelled'
                                ? 'bg-red-50 text-red-500 border-red-100 dark:bg-red-950/20'
                                : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20'
                            }`}>
                              {po.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 shrink-0 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedPO(po)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-750 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold transition-all text-[10px]"
                            >
                              View Items
                            </button>
                            {po.status === 'Sent' && (
                              <button
                                onClick={() => handleMarkPOReceived(po.id)}
                                className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-all text-[10px]"
                              >
                                Receive
                              </button>
                            )}
                            <button
                              onClick={() => handleDeletePO(po.id)}
                              className="p-1.5 text-slate-400 hover:text-red-550 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-all inline-block align-middle"
                              aria-label="Delete PO Log"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {purchaseOrdersList.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-450 font-semibold">
                            No Purchase Orders generated yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* 7. SHIPPING ADDRESSES TAB */}
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
          </div>

        </div>

      </main>

      <Footer />
      <Chatbot />
    </>
  );
}
