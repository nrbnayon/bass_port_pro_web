// types/user.ts
export interface User {  
  _id: string;
  name: string;
  email: string;
  role: string | "admin" | "user" | "guest" | "creator";
  avatar?: string;
  status: "Active" | "Suspended" | "Banned" | "Pending" | "Inactive";
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  permissions?: string[];
  image?: string | null;
  reports?: number;
}
