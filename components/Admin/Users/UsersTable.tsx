"use client";

import React from "react";
import Image from "next/image";

interface UsersTableProps {
  users: any[];
  onEditPermissions: (user: any) => void;
}

export function UsersTable({ users, onEditPermissions }: UsersTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 relative bg-gray-100 rounded-full overflow-hidden">
                     {/* Safe fallback for avatar */}
                     <span className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase">{user.name.charAt(0)}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${(user.status || '').toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 
                    (user.status || '').toLowerCase() === 'suspended' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {user.status || 'Active'}
                </span>
              </td>
              <td className="px-6 py-4">
                 <div className="flex flex-wrap gap-1">
                   {user.permissions?.slice(0, 3).map((p: string) => (
                      <span key={p} className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-600 font-mono">
                         {p}
                      </span>
                   ))}
                   {user.permissions?.length > 3 && (
                      <span className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-600 font-mono">
                         +{user.permissions.length - 3} more
                      </span>
                   )}
                 </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEditPermissions(user)}
                  className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded transition-colors"
                >
                  Edit Access
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
