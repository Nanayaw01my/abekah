export interface Property {
  _id: string;
  title: string;
  description: string;
  type: "apartment" | "house" | "studio" | "villa" | "room" | "townhouse" | "condo";
  price: number;
  priceType: "monthly" | "weekly" | "daily";
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    neighborhood?: string;
    coordinates?: { lat: number; lng: number };
    zipCode?: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  amenities: string[];
  features: PropertyFeatures;
  landlord: User | string;
  status: "available" | "rented" | "maintenance";
  verified: boolean;
  featured: boolean;
  views: number;
  inquiries: number;
  availableFrom: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFeatures {
  furnished: boolean;
  parking: boolean;
  petFriendly: boolean;
  security: boolean;
  water: boolean;
  electricity: boolean;
  internet: boolean;
  airConditioning: boolean;
  gym: boolean;
  pool: boolean;
  laundry: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "tenant" | "landlord" | "admin";
  phone?: string;
  verified: boolean;
  bio?: string;
  favorites: string[];
  createdAt: string;
}

export interface Review {
  _id: string;
  property: string;
  reviewer: User;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
}

export interface Booking {
  _id: string;
  property: Property;
  tenant: User;
  landlord: User;
  type: "viewing" | "inspection" | "application";
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  content: string;
  image?: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  property: Property;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface SearchFilters {
  location?: string;
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  parking?: boolean;
  petFriendly?: boolean;
  sortBy?: "newest" | "price_asc" | "price_desc" | "most_popular";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}
