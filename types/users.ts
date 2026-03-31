// types/user.ts
export interface User {  
id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest" | "creator";
  avatar?: string;
  status?: "Active" | "Inactive" | "Pending";
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  permissions?: string[];
  image?: string | null;
}
