/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  Camera01Icon,
  Location01Icon,
  CloudUploadIcon,
  ArrowDown01Icon,
  DashboardSquare01Icon,
  RulerIcon,
} from "@hugeicons/core-free-icons";
import UploadCatchModal from "./UploadCatchModal";
import CatchDetailsModal from "./CatchDetailsModal";
import { toast } from "sonner";
import { Fish, FishIcon, MapPinIcon } from "lucide-react";
import { CatchGridSkeleton } from "@/components/Skeleton/CatchGridSkeleton";
import { TablePagination } from "@/components/Shared/TablePagination";
import { useSearchParams, usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import AuthModal, { AuthView } from "@/components/Auth/AuthModal";
import { resolveMediaUrl } from "@/lib/utils";
import {
  useGetCatchesQuery,
  useGetMyCatchesQuery,
  useGetMyFavouriteCatchesQuery,
  useToggleFavouriteCatchMutation,
  CatchItem,
} from "@/redux/services/bassPornApi";
import { Badge } from "@/components/ui/badge";

const SORT_OPTIONS = [
  { label: "Most Recent", value: "createdAt" },
  { label: "Biggest Catch", value: "weight" },
  { label: "Most Popular", value: "likes" },
];

export default function CatchesFishClient() {
  const [sortBy, setSortBy] = useState<"createdAt" | "weight" | "likes">(
    "createdAt",
  );
  const [showFavouriteOnly, setShowFavouriteOnly] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCatch, setSelectedCatch] = useState<CatchItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isUserLoading } = useUser();
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    view: AuthView;
  }>({
    isOpen: false,
    view: "login",
  });
  const searchQuery = searchParams.get("search") || "";

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // APIs
  const {
    data: allCatchesData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
  } = useGetCatchesQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery,
      sortBy: sortBy,
      order: "desc",
      _auth: isUserLoading
        ? "checking"
        : isAuthenticated
          ? "authenticated"
          : "guest",
    },
    { skip: showFavouriteOnly },
  );

  const {
    data: favCatchesData,
    isLoading: isLoadingFav,
    isFetching: isFetchingFav,
  } = useGetMyFavouriteCatchesQuery(
    { page: currentPage, limit: itemsPerPage },
    { skip: !showFavouriteOnly || !isAuthenticated },
  );

  const {
    data: myCatchesData,
    isLoading: isLoadingMine,
    isFetching: isFetchingMine,
  } = useGetMyCatchesQuery({ page: 1, limit: 6 }, { skip: !isAuthenticated });

  const [toggleFavourite] = useToggleFavouriteCatchMutation();

  const isLoading = showFavouriteOnly
    ? isLoadingFav || isFetchingFav
    : isLoadingAll || isFetchingAll;
  const catchesData = showFavouriteOnly ? favCatchesData : allCatchesData;
  const paginatedCatches = catchesData?.catches || [];
  const totalItems = catchesData?.pagination.total || 0;
  const totalPages = catchesData?.pagination.pages || 0;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [sortBy, showFavouriteOnly, searchQuery]);

  const handleToggleFavourite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, view: "login" });
      return;
    }
    try {
      const res = await toggleFavourite(id).unwrap();
      if (res.isFavourite) {
        toast.success("Added to favourites!");
      } else {
        toast.success("Removed from favourites");
      }
    } catch (_error) {
      toast.error("Failed to update favourite status.");
    }
  };

  const handleUploadSubmit = () => {
    // API invalidates 'BassPorn LIST' via mutation, so it auto-refetches
    toast.success("Submitted for review. You can track it in My Uploads.");
  };

  const openDetails = (item: CatchItem) => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, view: "login" });
      return;
    }
    setSelectedCatch(item);
    setIsDetailsModalOpen(true);
  };

  const handleFavouriteFilterToggle = () => {
    if (!showFavouriteOnly && !isAuthenticated) {
      setAuthModal({ isOpen: true, view: "login" });
      return;
    }
    setShowFavouriteOnly(!showFavouriteOnly);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Header */}
      <section className="bg-white pt-28 md:pt-40 pb-8">
        <div className="w-full px-4 md:max-w-[1320px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex flex-col items-start gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FAECE6] px-5 py-2.5 text-xs font-semibold text-primary ring-1 ring-primary/10">
                <HugeiconsIcon icon={Camera01Icon} className="h-4 w-4" />
                BassPorn Gallery
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground max-w-xl">
                Trophy Catches
              </h1>
              <p className="font-medium text-gray-400 max-w-xl leading-relaxed">
                Share your biggest bass with the community and explore the
                legendary catches that define the sport.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleFavouriteFilterToggle}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all cursor-pointer ${
                  showFavouriteOnly
                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                <HugeiconsIcon icon={FavouriteIcon} className="h-4 w-4" />
                Favourite
              </button>

              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "createdAt" | "weight" | "likes",
                    )
                  }
                  disabled={showFavouriteOnly}
                  className="appearance-none bg-gray-100 text-foreground rounded-lg px-8 py-3 text-sm font-semibold pr-12 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-none cursor-pointer hover:bg-gray-200 disabled:opacity-50"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:translate-y-[-40%] transition-transform">
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setAuthModal({ isOpen: true, view: "login" });
                  } else {
                    setIsUploadModalOpen(true);
                  }
                }}
                className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <HugeiconsIcon icon={CloudUploadIcon} className="h-5 w-5" />
                Upload Catch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <main className="w-full px-4 md:max-w-[1320px] mx-auto min-h-[600px]">
        {isAuthenticated && !showFavouriteOnly && (
          <section className="mb-10 rounded-2xl border border-primary/10 bg-white p-4 ">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  My Catches
                </h2>
                <p className="text-sm font-medium text-gray-400">
                  Keep track of your submitted catches while they wait for
                  approval.
                </p>
              </div>
            </div>

            {isLoadingMine || isFetchingMine ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-50 rounded-2xl aspect-[4/3]"
                  />
                ))}
              </div>
            ) : (myCatchesData?.catches || []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-500 font-medium">
                No uploads yet. Your next catch will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(myCatchesData?.catches || []).map((item, index) => (
                  <motion.article
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative cursor-pointer border border-[#F3F4F6] rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-lg transition-all duration-300 bg-white"
                    onClick={() => openDetails(item)}
                  >
                    <div className="relative h-[240px] overflow-hidden rounded-t-2xl bg-gray-900">
                      <Image
                        src={resolveMediaUrl(item.image)}
                        alt={item.species}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Status Badge */}
                      <div className="absolute left-3 top-3 z-10">
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
                          className="capitalize px-2.5 py-1 text-[10px] font-semibold rounded-full shadow-sm"
                        >
                          {item.status === "active"
                            ? "Approved"
                            : item.status === "pending"
                              ? "Under Review"
                              : item.status}
                        </Badge>
                      </div>

                      {/* Weight Badge (only if active) */}
                      {item.status === "active" && (
                        <div className="absolute right-3 top-3 z-10">
                          <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-white shadow-xl shadow-primary/20">
                            {item.weight} {item.weightUnit}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <div className="flex items-center gap-1.5 text-white/80">
                          <HugeiconsIcon
                            icon={Location01Icon}
                            className="h-3.5 w-3.5"
                          />
                          <p className="text-xs font-bold line-clamp-1">
                            {item.lake?.name || item.lakeName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="my-3 px-3 pb-1">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between w-full">
                          <h3 className="text-sm font-black text-foreground truncate max-w-[70%]">
                            {item.species}
                          </h3>
                          <div className="flex items-center gap-1">
                            <HugeiconsIcon
                              icon={FavouriteIcon}
                              className={`h-3.5 w-3.5 transition-colors ${
                                item.isFavourite
                                  ? "text-red-500 fill-red-500"
                                  : "text-gray-300"
                              }`}
                            />
                            <span
                              className={`text-xs font-black transition-colors ${
                                item.isFavourite
                                  ? "text-red-500"
                                  : "text-foreground"
                              }`}
                            >
                              {(item.likes || 0) + (item.favouriteCount || 0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          {item.length ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                              <HugeiconsIcon
                                icon={RulerIcon}
                                className="h-4 w-4"
                              />
                              {item.length}&quot;
                            </div>
                          ) : null}
                          {item.technique ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider line-clamp-1">
                              <Fish className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{item.technique}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
        )}

        {isLoading ? (
          <CatchGridSkeleton count={8} />
        ) : paginatedCatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-gray-100 text-center">
            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
              <HugeiconsIcon
                icon={DashboardSquare01Icon}
                className="h-10 w-10"
              />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              No catches found
            </h3>
            <p className="text-gray-400 font-medium mt-2">
              Try adjusting your filters or be the first to share a trophy
              catch!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {paginatedCatches.map((item, index) => (
                  <motion.article
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative cursor-pointer border border-[#F3F4F6] rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white"
                    onClick={() => openDetails(item)}
                  >
                    {/* Card Main */}
                    <div className="relative h-[300px] overflow-hidden rounded-t-2xl bg-gray-900 transition-all group-hover:shadow-xs">
                      <Image
                        src={resolveMediaUrl(item.image)}
                        alt={item.user?.name || "Angler"}
                        fill
                        className="object-cover transition-transform"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Weight Badge */}
                      <div className="absolute left-3 top-3 z-10">
                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-xl shadow-primary/20">
                          {item.weight} {item.weightUnit}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleToggleFavourite(item._id, e)}
                        aria-label={
                          item.isFavourite
                            ? "Remove from favourites"
                            : "Add to favourites"
                        }
                        className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          item.isFavourite
                            ? "bg-primary text-white"
                            : "bg-[#D9D9D94D] text-white hover:bg-white hover:text-red-500"
                        }`}
                      >
                        <HugeiconsIcon
                          icon={FavouriteIcon}
                          className={`h-5 w-5 ${item.isFavourite ? "fill-white" : ""}`}
                        />
                      </button>

                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <h3 className="font-semibold tracking-tight">
                          {item.user?.name || "Angler"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-white/80">
                          <HugeiconsIcon
                            icon={Location01Icon}
                            className="h-3.5 w-3.5"
                          />
                          <p className="text-xs font-bold line-clamp-1">
                            {item.lake?.name || item.lakeName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Meta Footer */}
                    <div className="my-3 px-3 pb-1">
                      <div className="flex items-center justify-between">
                        <div className="w-full flex flex-col">
                          <div className="flex items-center justify-between w-full">
                            <h3 className="text-sm font-black text-foreground truncate max-w-[70%]">
                              {item.species}
                            </h3>
                            <div className="flex items-center gap-1">
                              <HugeiconsIcon
                                icon={FavouriteIcon}
                                className={`h-3.5 w-3.5 transition-colors ${
                                  item.isFavourite
                                    ? "text-red-500 fill-red-500"
                                    : "text-gray-300"
                                }`}
                              />
                              <span
                                className={`text-xs font-black transition-colors ${
                                  item.isFavourite
                                    ? "text-red-500"
                                    : "text-foreground"
                                }`}
                              >
                                {(item.likes || 0) + (item.favouriteCount || 0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            {item.length ? (
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                <HugeiconsIcon
                                  icon={RulerIcon}
                                  className="h-4 w-4"
                                />
                                {item.length}&quot;
                              </div>
                            ) : null}
                            {item.technique ? (
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider line-clamp-1 max-w-[120px]">
                                <Fish className="h-4 w-4 shrink-0" />
                                <span className="truncate">
                                  {item.technique}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalItems > 12 && (
              <div className="mt-12">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => setCurrentPage(page)}
                  onPageSizeChange={(size) => setItemsPerPage(size)}
                  showPageSize={true}
                  pageSizeOptions={[12, 24, 48, 96]}
                  className="border-none bg-transparent px-0"
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <UploadCatchModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
      />
      <CatchDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        catchItem={selectedCatch}
      />
      <AuthModal
        isOpen={authModal.isOpen}
        initialView={authModal.view}
        redirectTo={pathname}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
