"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { UsersTable } from "@/components/Admin/Users/UsersTable";
import { UserPermissionsModal } from "@/components/Admin/Users/UserPermissionsModal";
import { useGetUsersQuery } from "@/redux/services/userApi";

export default function UsersPage() {
  const { hasPermission } = useUser();
  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Fallback check (proxy.ts should handle this, but client side check is extra safety)
  if (!hasPermission("manage_users")) {
    return <div className="p-10 text-xl font-bold text-red-500">Access Denied: You do require manage_users permission</div>;
  }

  const handleEditPermissions = (user: any) => {
    setSelectedUser(user);
  };

  if (isLoading) return <div className="p-10">Loading users...</div>;
  if (isError) return <div className="p-10 text-red-500">Failed to load users from API</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          Add New User
        </button>
      </div>

      <UsersTable 
        users={users.map(u => ({ ...u, id: u._id }))} 
        onEditPermissions={handleEditPermissions} 
      />
      
      {selectedUser && (
        <UserPermissionsModal 
           user={selectedUser} 
           onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
}
