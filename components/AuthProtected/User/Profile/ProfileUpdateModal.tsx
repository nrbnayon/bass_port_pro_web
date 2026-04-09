"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  UserIcon,
  SmartPhone01Icon,
  Location01Icon,
  ImageAdd01Icon,
} from "@hugeicons/core-free-icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateMyProfileMutation, User } from "@/redux/services/userApi";
import { updateProfile as updateProfileAction } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";

interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ProfileUpdateModal({
  isOpen,
  onClose,
  user,
}: ProfileUpdateModalProps) {
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      location: user?.location || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone || "",
        location: user.location || "",
      });
      if (user.avatar !== avatarPreview) {
        setAvatarPreview(user.avatar || null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: {
    name: string;
    phone: string;
    location: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.phone) formData.append("phone", data.phone);
      if (data.location) formData.append("location", data.location);
      if (avatarFile) formData.append("avatar", avatarFile);

      const result = await updateProfile(formData).unwrap();

      // Update authSlice with the new data from backend response
      dispatch(
        updateProfileAction({
          name: result.data.name,
          avatar: result.data.avatar,
          phone: result.data.phone,
          location: result.data.location,
        })
      );

      toast.success("Profile updated successfully!");
      onClose();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-[210]"
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Edit Profile
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-0">
              {/* Avatar Upload */}
              <div className="mb-8 flex flex-col items-center">
                <div className="relative group">
                  <div className="relative h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {avatarPreview ? (
                      <Image
                        src={resolveMediaUrl(avatarPreview)}
                        alt="Profile Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-3xl font-bold text-primary">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white cursor-pointer shadow-md hover:scale-110 transition-transform">
                    <HugeiconsIcon icon={ImageAdd01Icon} className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs font-semibold text-gray-400">
                  Update Profile Photo
                </p>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-600 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={UserIcon}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    />
                    <input
                      {...register("name", { required: "Name is required" })}
                      type="text"
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-12 py-3.5 font-medium text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="Your Full Name"
                    />
                  </div>
                  {errors.name && (
                    <span className="text-red-500 text-xs font-bold ml-1">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-600 ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={SmartPhone01Icon}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    />
                    <input
                      {...register("phone")}
                      type="tel"
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-12 py-3.5 font-medium text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="e.g. +1 234 567 890"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-600 ml-1">
                    Location
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Location01Icon}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    />
                    <input
                      {...register("location")}
                      type="text"
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-12 py-3.5 font-medium text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="e.g. Dallas, Texas"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl border border-gray-200 py-4 font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] rounded-2xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
