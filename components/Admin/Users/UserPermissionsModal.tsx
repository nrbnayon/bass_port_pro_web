import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useUpdateUserMutation } from "@/redux/services/userApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PermissionGroup {
  module: string;
  atoms: { id: string, label: string }[];
}

const AVAILABLE_PERMISSIONS: PermissionGroup[] = [
  { module: "Dashboard", atoms: [{ id: "view_dashboard", label: "View Dashboard" }, { id: "view_audit_logs", label: "View Audit Logs" }] },
  { module: "Jobs", atoms: [{ id: "manage_jobs", label: "Manage Jobs" }, { id: "view_jobs", label: "View Jobs" }] },
  { module: "Applications", atoms: [{ id: "view_applications", label: "View Applications" }, { id: "manage_applications", label: "Manage Applications" }] },
  { module: "Users", atoms: [{ id: "manage_users", label: "Manage Users" }] },
  { module: "Settings", atoms: [{ id: "manage_settings", label: "Manage Settings" }, { id: "manage_categories", label: "Manage Categories" }] },
  { module: "Notifications", atoms: [{ id: "view_notifications", label: "View Notifications" }] },
];

interface UserPermissionsModalProps {
  user: any;
  onClose: () => void;
}

export function UserPermissionsModal({ user, onClose }: UserPermissionsModalProps) {
  const { hasPermission } = useUser();
  const [selectedAtoms, setSelectedAtoms] = useState<Set<string>>(new Set(user.permissions || []));
  const [errorMsg, setErrorMsg] = useState("");
  const [updatePermissions, { isLoading }] = useUpdateUserMutation();

  const toggleAtom = (atomId: string) => {
    // Check Grant Ceiling: Does the Manager HAVE this atom to give it?
    if (!hasPermission(atomId)) {
        setErrorMsg(`Grant Ceiling Error: You cannot grant the '${atomId}' permission because you don't possess it yourself.`);
        return;
    }
    setErrorMsg("");

    const newSet = new Set(selectedAtoms);
    if (newSet.has(atomId)) {
      newSet.delete(atomId);
    } else {
      newSet.add(atomId);
    }
    setSelectedAtoms(newSet);
  };

  const handleSave = async () => {
    try {
      const id = user.id || user._id; // Accommodate both formats
      await updatePermissions({ id, permissions: Array.from(selectedAtoms) }).unwrap();
      toast.success("Permissions updated successfully");
      onClose();
    } catch (error: any) {
      console.error("Failed to update permissions:", error);
      toast.error(error?.data?.message || "Failed to save changes. Grant ceiling might be enforced.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div>
            <h2 className="text-xl font-semibold mb-1">Manage Permissions for {user.name}</h2>
            <p className="text-sm text-gray-500">Atomic access control configuration</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">✕</button>
        </div>

        <div className="p-8">
           {errorMsg && (
             <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {errorMsg}
             </div>
           )}

           <div className="space-y-8">
             {AVAILABLE_PERMISSIONS.map((group) => (
                <div key={group.module}>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2">{group.module}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {group.atoms.map((atom) => {
                      const isActive = selectedAtoms.has(atom.id);
                      // Check standard UI grant checking
                      const isDisabled = !hasPermission(atom.id);
                      
                      return (
                        <div 
                           key={atom.id}
                           onClick={() => toggleAtom(atom.id)}
                           className={`p-3 rounded-lg border-2 flex items-start gap-3 transition-all cursor-pointer select-none
                               ${isActive ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300'}
                               ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                            `}
                        >
                           <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0
                               ${isActive ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}
                           `}>
                              {isActive && <span className="text-white text-xs leading-none">✓</span>}
                           </div>
                           <div>
                              <div className={`font-medium text-sm ${isActive ? 'text-indigo-900' : 'text-gray-700'}`}>{atom.label}</div>
                              <div className="text-xs text-gray-500 font-mono mt-1 opacity-70">{atom.id}</div>
                              {isDisabled && <div className="text-[10px] text-red-500 mt-1 uppercase font-bold tracking-wider">Locked by ceiling</div>}
                           </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
             ))}
           </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end gap-3 sticky bottom-0">
          <button onClick={onClose} disabled={isLoading} className="px-5 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
          <button 
             onClick={handleSave} 
             disabled={isLoading}
             className="px-5 py-2.5 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm min-w-[140px] flex items-center justify-center gap-2"
          >
             {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
