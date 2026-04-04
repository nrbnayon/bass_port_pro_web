"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Camera01Icon,
  FavouriteIcon,
  Calendar03Icon,
  StarIcon,
  Idea01Icon,
  Edit01Icon,
} from "@hugeicons/core-free-icons";
import { useGetMyProfileQuery, User } from "@/redux/services/userApi";
import NextImage from "next/image";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/authSlice";
import ProfileUpdateModal from "./ProfileUpdateModal";
import UploadCatchModal from "../Catches/UploadCatchModal";
import Link from "next/link";
import { toast } from "sonner";

export default function ProfileClient() {
  const { data: profileResponse, isLoading } = useGetMyProfileQuery();
  const { isLoading: isUserLoading } = useUser();
  const currentUser = useAppSelector(selectCurrentUser);
  const userData = profileResponse?.data || currentUser;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadCatchModalOpen, setIsUploadCatchModalOpen] = useState(false);

  // Use a fallback for createdAt since it might not be in authSlice user
  const userCreatedAt = (userData as { createdAt?: string })?.createdAt;

  const stats = [
    {
      id: "catches",
      label: "Catches",
      value: "0",
      icon: Camera01Icon,
      color: "text-orange-500",
    },
    {
      id: "biggest",
      label: "Biggest (lbs)",
      value: "0.0",
      icon: Idea01Icon,
      color: "text-yellow-500",
    },
    {
      id: "weight",
      label: "Total Weight",
      value: "0.0",
      icon: StarIcon,
      color: "text-green-500",
    },
    {
      id: "favorites",
      label: "Favorite Lakes",
      value: "0",
      icon: FavouriteIcon,
      color: "text-red-500",
    },
  ];

  if (isLoading || isUserLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="w-full px-4 md:max-w-[1320px] mx-auto pt-28 md:pt-32 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-foreground p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 text-4xl font-bold text-white shadow-xl border-4 border-white/20 overflow-hidden">
                {userData?.avatar ? (
                  <NextImage
                    src={userData.avatar}
                    alt={userData.name || "User"}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                ) : (
                  userData?.name?.charAt(0) || "U"
                )}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {userData?.name || "User Name"}&apos;s Profile
              </h1>
              <div className="mt-2 flex items-center gap-2 text-white/70">
                <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Member since{" "}
                  {userCreatedAt
                    ? new Date(userCreatedAt).toISOString().split("T")[0]
                    : "2026-03-24"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 cursor-pointer"
          >
            <HugeiconsIcon icon={Edit01Icon} className="h-4 w-4" />
            Edit
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center justify-center rounded-2xl bg-white/5 p-6 text-center backdrop-blur-md hover:bg-white/10 transition-colors"
            >
              <HugeiconsIcon
                icon={stat.icon}
                className={`mb-3 h-6 w-6 ${stat.color}`}
              />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
      </motion.div>

      {/* Favorite Lakes Section */}
      <section className="mt-16">
        <div className="flex items-center gap-2 mb-6">
          <HugeiconsIcon
            icon={FavouriteIcon}
            className="h-6 w-6 text-primary"
          />
          <h2 className="text-2xl font-bold text-foreground">
            About This Lake
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
            <HugeiconsIcon icon={FavouriteIcon} className="h-8 w-8" />
          </div>
          <p className="text-gray-500 font-medium">
            No Favorite lakes yet. Explore lakes and save your favorites!
          </p>
          <Link
            href="/lakes"
            className="mt-4 text-primary font-bold hover:underline"
          >
            Browse Lakes
          </Link>
        </div>
      </section>

      {/* My Catches Section */}
      <section className="mt-16">
        <div className="flex items-center gap-2 mb-6">
          <HugeiconsIcon
            icon={FavouriteIcon}
            className="h-6 w-6 text-primary"
          />
          <h2 className="text-2xl font-bold text-foreground">My Catches</h2>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
            <HugeiconsIcon icon={FavouriteIcon} className="h-8 w-8" />
          </div>
          <p className="text-gray-500 font-medium">
            No catches uploaded yet. Share your first trophy!
          </p>
          <button
            onClick={() => setIsUploadCatchModalOpen(true)}
            className="mt-4 text-primary font-bold hover:underline cursor-pointer bg-transparent border-none"
          >
            Upload a Catch
          </button>
        </div>
      </section>

      <ProfileUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userData as User}
      />
      <UploadCatchModal
        isOpen={isUploadCatchModalOpen}
        onClose={() => setIsUploadCatchModalOpen(false)}
        onSubmit={(newCatch) => {
          console.log("New catch submitted:", newCatch);
          toast.success("Catch uploaded successfully!");
        }}
      />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container-1620 py-10 animate-pulse">
      <div className="h-80 w-full rounded-3xl bg-gray-100" />
      <div className="mt-16 h-10 w-48 rounded bg-gray-100" />
      <div className="mt-6 h-64 w-full rounded-3xl bg-gray-50" />
      <div className="mt-16 h-10 w-48 rounded bg-gray-100" />
      <div className="mt-6 h-64 w-full rounded-3xl bg-gray-50" />
    </div>
  );
}
