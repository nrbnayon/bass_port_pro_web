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
  Location01Icon,
  RulerIcon,
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
import { resolveMediaUrl } from "@/lib/utils";
import { Fish } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TablePagination } from "@/components/Shared/TablePagination";

export default function ProfileClient() {
  const { data: profileResponse, isLoading, refetch } = useGetMyProfileQuery();
  const { isLoading: isUserLoading } = useUser();

  const currentUser = useAppSelector(selectCurrentUser);
  const userData = profileResponse?.data || currentUser;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadCatchModalOpen, setIsUploadCatchModalOpen] = useState(false);
  const [favouritePage, setFavouritePage] = useState(1);
  const [catchesPage, setCatchesPage] = useState(1);
  const itemsPerPage = 8;

  // Use a fallback for createdAt since it might not be in authSlice user
  const userCreatedAt = (userData as { createdAt?: string })?.createdAt;

  const favouriteLakes = profileResponse?.data?.favouriteLakes || [];
  const myCatches = profileResponse?.data?.myCatches || [];
  const profileStats = profileResponse?.data?.stats;

  const stats = [
    {
      id: "catches",
      label: "Catches",
      value: String(profileStats?.catches || 0),
      icon: Camera01Icon,
      color: "text-orange-500",
    },
    {
      id: "biggest",
      label: "Biggest (lbs)",
      value: Number(profileStats?.biggestCatch || 0).toFixed(1),
      icon: Idea01Icon,
      color: "text-yellow-500",
    },
    {
      id: "weight",
      label: "Total Weight",
      value: Number(profileStats?.totalWeight || 0).toFixed(1),
      icon: StarIcon,
      color: "text-green-500",
    },
    {
      id: "favorites",
      label: "Favorite Lakes",
      value: String(profileStats?.favorites || 0),
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
           My Favourite Lakes
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-52 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : favouriteLakes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
              <HugeiconsIcon icon={FavouriteIcon} className="h-8 w-8" />
            </div>
            <p className="text-gray-500 font-medium">
              No favorite lakes yet. Explore lakes and save your favorites!
            </p>
            <Link
              href="/lakes"
              className="mt-4 text-primary font-bold hover:underline"
            >
              Browse Lakes
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favouriteLakes
                .slice(
                  (favouritePage - 1) * itemsPerPage,
                  favouritePage * itemsPerPage,
                )
                .map((lake) => (
                  <Link
                    key={lake._id}
                    href={`/lakes/${lake.slug || lake._id}`}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="relative h-36">
                      <NextImage
                        src={resolveMediaUrl(lake.image)}
                        alt={lake.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute left-3 bottom-3 text-white">
                        <p className="text-sm font-bold">{lake.name}</p>
                        <div className="flex items-center gap-1 text-xs text-white/85">
                          <HugeiconsIcon
                            icon={Location01Icon}
                            className="h-3 w-3"
                          />
                          <span>{lake.state}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-2 text-sm text-gray-500 font-medium">
                        {lake.description || "No description available."}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs font-semibold text-gray-500">
                        <span>Rating: {lake.rating || 0}</span>
                        <span>{lake.reviewCount || 0} reviews</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
            {favouriteLakes.length > itemsPerPage && (
              <div className="mt-8 rounded-2xl bg-white border border-gray-100 overflow-hidden">
                <TablePagination
                  currentPage={favouritePage}
                  totalPages={Math.ceil(favouriteLakes.length / itemsPerPage)}
                  totalItems={favouriteLakes.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setFavouritePage}
                />
              </div>
            )}
          </>
        )}
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-52 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : myCatches.length === 0 ? (
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
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {myCatches
                .slice(
                  (catchesPage - 1) * itemsPerPage,
                  catchesPage * itemsPerPage,
                )
                .map((item) => (
                  <div
                    key={item._id}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="relative h-40">
                      <NextImage
                        src={resolveMediaUrl(item.image)}
                        alt={item.species}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute right-3 top-3">
                        <Badge
                          variant={
                            item.status === "active"
                              ? "success"
                              : item.status === "pending"
                                ? "warning"
                                : item.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                          }
                          className="capitalize text-[10px] font-semibold"
                        >
                          {item.status === "active" ? "Approved" : item.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-foreground truncate">
                          {item.species}
                        </h3>
                        <span className="text-xs font-semibold text-primary">
                          {item.weight} {item.weightUnit}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 font-semibold">
                        {item.length ? (
                          <span className="inline-flex items-center gap-1">
                            <HugeiconsIcon
                              icon={RulerIcon}
                              className="h-3.5 w-3.5"
                            />
                            {item.length}&quot;
                          </span>
                        ) : null}
                        {item.technique ? (
                          <span className="inline-flex items-center gap-1 truncate">
                            <Fish className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{item.technique}</span>
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {myCatches.length > itemsPerPage && (
              <div className="mt-8 rounded-2xl bg-white border border-gray-100 overflow-hidden">
                <TablePagination
                  currentPage={catchesPage}
                  totalPages={Math.ceil(myCatches.length / itemsPerPage)}
                  totalItems={myCatches.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCatchesPage}
                />
              </div>
            )}
          </>
        )}
      </section>

      <ProfileUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userData as User}
      />
      <UploadCatchModal
        isOpen={isUploadCatchModalOpen}
        onClose={() => setIsUploadCatchModalOpen(false)}
        onSubmit={() => {
          void refetch();
          toast.success("Submitted for review. You can track it in My Catches.");
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
