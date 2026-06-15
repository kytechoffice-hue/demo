'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserAddress {
  id: string;
  // Customer Information
  name: string;
  phone: string;
  altPhone?: string;
  email: string;
  gstn?: string;
  website?: string;

  // Shipping Address
  houseNum: string;
  street: string;
  area: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  addresses: UserAddress[];
  wishlist: string[]; // Product IDs
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; role?: string }>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Omit<UserAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  updateProfile: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    const kySession = localStorage.getItem('ky_session_user');
    if (kySession) {
      try {
        setUser(JSON.parse(kySession));
      } catch (e) {
        console.error("Error loading kySession", e);
      }
    }
    setLoading(false);
  }, []);

  const saveUser = (profile: UserProfile | null) => {
    setUser(profile);
    if (!profile) {
      localStorage.removeItem('ky_session_user');
      return;
    }
    localStorage.setItem('ky_session_user', JSON.stringify(profile));
    
    // Also save in local user list for persistence across sessions
    const storedLocalUsers = localStorage.getItem('ky_local_users');
    let localUsers = [];
    if (storedLocalUsers) {
      try {
        localUsers = JSON.parse(storedLocalUsers);
      } catch (e) {}
    }
    
    const idx = localUsers.findIndex((u: any) => u.email === profile.email);
    if (idx !== -1) {
      localUsers[idx] = { ...localUsers[idx], ...profile };
    } else {
      localUsers.push(profile);
    }
    localStorage.setItem('ky_local_users', JSON.stringify(localUsers));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; role?: string }> => {
    setLoading(true);
    // Dynamic simulated check
    // Wait a brief 400ms to simulate API call latency
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const formattedEmail = email.toLowerCase().trim();
    if (formattedEmail === 'admin@kystore.com' && password === 'admin') {
      const adminProfile: UserProfile = {
        id: "usr-admin",
        name: "KY Admin",
        email: "admin@kystore.com",
        role: "admin",
        addresses: [],
        wishlist: []
      };
      saveUser(adminProfile);
      setLoading(false);
      return { success: true, message: "Welcome back, Administrator!", role: "admin" };
    } else if (formattedEmail === 'buyer@gmail.com' && password === 'buyer') {
      const buyerProfile: UserProfile = {
        id: "usr-buyer",
        name: "John Doe",
        email: "buyer@gmail.com",
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
        wishlist: ["prod-2", "prod-3"]
      };
      saveUser(buyerProfile);
      setLoading(false);
      return { success: true, message: "Login successful!", role: "user" };
    } else {
      // Dynamic fallback for newly registered users
      const storedLocalUsers = localStorage.getItem('ky_local_users');
      if (storedLocalUsers) {
        try {
          const localUsers = JSON.parse(storedLocalUsers);
          const found = localUsers.find((u: any) => u.email === formattedEmail && u.password === password);
          if (found) {
            const userProfile: UserProfile = {
              id: found.id,
              name: found.name,
              email: found.email,
              role: 'user',
              addresses: found.addresses || [],
              wishlist: found.wishlist || []
            };
            saveUser(userProfile);
            setLoading(false);
            return { success: true, message: "Login successful!", role: "user" };
          }
        } catch (e) {}
      }
      setLoading(false);
      return { success: false, message: "Invalid email or password. Use admin@kystore.com / admin or buyer@gmail.com / buyer." };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const formattedEmail = email.toLowerCase().trim();
    
    if (formattedEmail === 'admin@kystore.com' || formattedEmail === 'buyer@gmail.com') {
      return { success: false, message: "This email address is already registered." };
    }

    // Load registered users from localStorage
    const storedLocalUsers = localStorage.getItem('ky_local_users');
    let localUsers = [];
    if (storedLocalUsers) {
      try {
        localUsers = JSON.parse(storedLocalUsers);
      } catch (e) {}
    }

    const exists = localUsers.some((u: any) => u.email === formattedEmail);
    if (exists) {
      return { success: false, message: "This email address is already registered." };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: formattedEmail,
      password,
      addresses: [],
      wishlist: []
    };

    localUsers.push(newUser);
    localStorage.setItem('ky_local_users', JSON.stringify(localUsers));
    
    return { success: true, message: "Registration successful! You can now log in." };
  };

  const logout = () => {
    saveUser(null);
  };

  const toggleWishlist = (productId: string) => {
    if (!user) return;
    const wishlist = [...user.wishlist];
    const index = wishlist.indexOf(productId);
    if (index > -1) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
    }
    const updatedUser = { ...user, wishlist };
    saveUser(updatedUser);

    // Sync back to local registered users if applicable
    updateLocalUsersDb(updatedUser);
  };

  const isInWishlist = (productId: string): boolean => {
    if (!user) return false;
    return user.wishlist.includes(productId);
  };

  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const newAddress: UserAddress = {
      ...address,
      id: `addr-${Date.now()}`,
      isDefault: user.addresses.length === 0 ? true : address.isDefault
    };

    let addresses = [...user.addresses];
    if (newAddress.isDefault) {
      addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
    }
    addresses.push(newAddress);

    const updatedUser = { ...user, addresses };
    saveUser(updatedUser);
    updateLocalUsersDb(updatedUser);
  };

  const updateAddress = (id: string, updatedFields: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    let addresses = user.addresses.map(addr => {
      if (addr.id === id) {
        return { ...updatedFields, id, isDefault: updatedFields.isDefault };
      }
      return addr;
    });

    if (updatedFields.isDefault) {
      addresses = addresses.map(addr => {
        if (addr.id !== id) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });
    } else {
      const hasDefault = addresses.some(addr => addr.isDefault);
      if (!hasDefault && addresses.length > 0) {
        addresses[0].isDefault = true;
      }
    }

    const updatedUser = { ...user, addresses };
    saveUser(updatedUser);
    updateLocalUsersDb(updatedUser);
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const addresses = user.addresses.filter(addr => addr.id !== id);
    // If we deleted the default address, set another one as default
    if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
      addresses[0].isDefault = true;
    }
    const updatedUser = { ...user, addresses };
    saveUser(updatedUser);
    updateLocalUsersDb(updatedUser);
  };

  const updateProfile = (name: string, email: string) => {
    if (!user) return;
    const updatedUser = { ...user, name, email: email.toLowerCase().trim() };
    saveUser(updatedUser);
    updateLocalUsersDb(updatedUser);
  };

  // Helper to sync changes to the local storage list of all users
  const updateLocalUsersDb = (updatedProfile: UserProfile) => {
    const storedLocalUsers = localStorage.getItem('ky_local_users');
    if (!storedLocalUsers) return;
    try {
      const localUsers = JSON.parse(storedLocalUsers);
      const index = localUsers.findIndex((u: any) => u.id === updatedProfile.id);
      if (index > -1) {
        localUsers[index] = {
          ...localUsers[index],
          name: updatedProfile.name,
          email: updatedProfile.email,
          addresses: updatedProfile.addresses,
          wishlist: updatedProfile.wishlist
        };
        localStorage.setItem('ky_local_users', JSON.stringify(localUsers));
      }
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        toggleWishlist,
        isInWishlist,
        addAddress,
        updateAddress,
        deleteAddress,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
