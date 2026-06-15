import fs from 'fs';
import path from 'path';
import seedData from '../data/seedData.json';

const DB_FILE_PATH = path.join(process.cwd(), 'database.json');

// Default initial state if DB is missing
const getDefaultDbData = () => {
  return {
    categories: seedData.categories,
    products: seedData.products,
    users: [
      {
        id: "usr-admin",
        name: "KY Admin",
        email: "admin@kystore.com",
        password: "admin", // Simple for local mockup
        role: "admin",
        addresses: [],
        wishlist: []
      },
      {
        id: "usr-buyer",
        name: "John Doe",
        email: "buyer@gmail.com",
        password: "buyer", // Simple for local mockup
        role: "user",
        addresses: [
          {
            id: "addr-1",
            name: "John Doe",
            phone: "+91 9876543210",
            altPhone: "",
            email: "buyer@gmail.com",
            gstn: "",
            website: "",
            houseNum: "Flat 12B",
            street: "123 Smart Shopping Lane",
            area: "Sector 62",
            landmark: "Near Metro Station",
            city: "Noida",
            district: "Gautam Buddha Nagar",
            state: "Uttar Pradesh",
            zipCode: "201301",
            country: "India",
            isDefault: true
          }
        ],
        wishlist: ["prod-2"]
      }
    ],
    orders: [
      {
        id: "KY-ORD-88123",
        userId: "usr-buyer",
        items: [
          {
            productId: "prod-1",
            title: "KY-Volt Gaming Laptop 15.6\"",
            price: 48999,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop"
          }
        ],
        shippingAddress: {
          name: "John Doe",
          phone: "+91 9876543210",
          street: "123 Smart Shopping Lane, Sector 62",
          city: "Noida",
          state: "Uttar Pradesh",
          zipCode: "201301",
          country: "India"
        },
        billingAddress: {
          name: "John Doe",
          phone: "+91 9876543210",
          street: "123 Smart Shopping Lane, Sector 62",
          city: "Noida",
          state: "Uttar Pradesh",
          zipCode: "201301",
          country: "India"
        },
        paymentMethod: "Stripe",
        paymentStatus: "Paid",
        orderStatus: "Processing",
        shippingFee: 0,
        tax: 4410,
        discount: 0,
        subtotal: 48999,
        total: 53409,
        createdAt: new Date(Date.now() - 36 * 3600000).toISOString(), // 36 hours ago
        timeline: [
          { status: "Order Placed", date: new Date(Date.now() - 36 * 3600000).toISOString(), comment: "Your order has been logged." },
          { status: "Paid", date: new Date(Date.now() - 35.8 * 3600000).toISOString(), comment: "Payment completed successfully via Stripe." },
          { status: "Processing", date: new Date(Date.now() - 30 * 3600000).toISOString(), comment: "Admin is preparing the package." }
        ]
      }
    ],
    coupons: [
      { code: "WELCOME10", discountPercent: 10, minPurchase: 500, active: true },
      { code: "FLASH20", discountPercent: 20, minPurchase: 2000, active: true },
      { code: "KYESTORE", discountPercent: 15, minPurchase: 1000, active: true }
    ],
    banners: [
      { id: "b1", title: "Smart Shopping Starts Here", subtitle: "Buy quality products at the best price with secure online delivery.", image: "hero-bg", actionText: "Shop Now", link: "/product" },
      { id: "b2", title: "Mega Electronics Clearance", subtitle: "Up to 50% off on premium noise cancelling audio devices.", image: "electronics-bg", actionText: "Explore Categories", link: "/product?category=electronics" }
    ]
  };
};

export const getDb = (): any => {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      const defaultData = getDefaultDbData();
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const rawData = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading database:", error);
    return getDefaultDbData();
  }
};

export const saveDb = (data: any): boolean => {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error saving database:", error);
    return false;
  }
};

export const getTable = (tableName: string): any[] => {
  const db = getDb();
  return db[tableName] || [];
};

export const saveTable = (tableName: string, tableData: any[]): boolean => {
  const db = getDb();
  db[tableName] = tableData;
  return saveDb(db);
};
