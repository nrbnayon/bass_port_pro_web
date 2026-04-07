"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  Location01Icon,
  StarIcon,
  TemperatureIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { Fish } from "lucide-react";
import { useEffect, useState } from "react";
import AuthModal, { AuthView } from "@/components/Auth/AuthModal";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useToggleFavouriteLakeMutation } from "@/redux/services/lakesApi";
import { LakeViewModel } from "@/lib/lakeMappers";
import { toast } from "sonner";

interface LakeCardProps {
  lake: LakeViewModel;
}

export default function LakeCard({ lake }: LakeCardProps) {
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const [toggleFavouriteLake, { isLoading: isTogglingFavourite }] =
    useToggleFavouriteLakeMutation();
  const [isFavourite, setIsFavourite] = useState(Boolean(lake.isFavourite));

  useEffect(() => {
    setIsFavourite(Boolean(lake.isFavourite));
  }, [lake.isFavourite]);

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; view: AuthView }>({
    isOpen: false,
    view: "login",
  });

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setAuthModal({ isOpen: true, view: "login" });
    } else {
      router.push(`/lakes/${lake.slug || lake.id}`);
    }
  };

  const handleFavouriteClick = async (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      setAuthModal({ isOpen: true, view: "login" });
    } else {
      e.preventDefault();
      e.stopPropagation();

      if (!lake._id) {
        setIsFavourite((prev) => !prev);
        return;
      }

      try {
        const response = await toggleFavouriteLake(lake._id).unwrap();
        setIsFavourite(response.isFavourite);
        toast.success(
          response.isFavourite
            ? "Added to favourites"
            : "Removed from favourites",
        );
      } catch {
        toast.error("Failed to update favourite");
      }
    }
  };

  const conditionColor = {
    Excellent: "bg-[#22C55E]",
    Good: "bg-[#3B82F6]",
    Fair: "bg-[#F59E0B]",
    Poor: "bg-[#EF4444]",
  }[lake.condition];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div
        onClick={handleCardClick}
        className="flex flex-col h-full overflow-hidden rounded-2xl bg-white border-x border-b border-t-0 border-solid border-[#F3F4F6] transition-all hover:shadow-xs hover:ring-1 hover:ring-primary/20 isolation-auto cursor-pointer"
        style={{ isolation: "isolate" }}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <Image
            src={lake.image}
            alt={lake.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00000088] via-transparent to-transparent opacity-60" />

          <div className="absolute left-3 top-3">
            <span
              className={`${conditionColor} rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white`}
            >
              {lake.condition}
            </span>
          </div>

          <div
            onClick={handleFavouriteClick}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#D9D9D94D] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-primary cursor-pointer"
          >
            <HugeiconsIcon
              icon={FavouriteIcon}
              className={`h-5 w-5 ${isFavourite ? "text-primary fill-primary" : ""}`}
              strokeWidth={2}
            />
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
              <span className="text-xs font-semibold">{lake.state}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-[#00000066] px-2 py-1 backdrop-blur-sm">
              <HugeiconsIcon
                icon={StarIcon}
                className="h-3 w-3 text-[#F59E0B]"
              />
              <span className="text-xs font-semibold">{lake.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
            {lake.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#64748B]">
            {lake.description}
          </p>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#1111110D] py-3 transition-colors group-hover:bg-black/5">
              <HugeiconsIcon
                icon={TemperatureIcon}
                className="h-5 w-5 text-[#EF4444]"
              />
              <span className="mt-1 text-xs font-semibold text-foreground">
                {lake.temp}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#1111110D] py-3 transition-colors group-hover:bg-black/5">
              <HugeiconsIcon
                icon={ViewIcon}
                className="h-5 w-5 text-[#3B82F6]"
              />
              <span className="mt-1 text-xs font-semibold text-foreground">
                {lake.clarity}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#1111110D] py-3 transition-colors group-hover:bg-black/5">
              <Fish className="h-5 w-5 text-[#22C55E]" />
              <span className="mt-1 text-xs font-semibold text-foreground">
                {lake.catchRate}/hr
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-secondary">
            <span>{lake.reviewCount || 0} reviews</span>
            <span>{lake.reportCount || 0} reports</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {lake.species.slice(0, 2).map((s) => (
              <span
                key={s}
                className="rounded-full bg-[#3060D91A] px-2.5 py-1 text-xs font-semibold text-blue"
              >
                {s}
              </span>
            ))}
            {lake.species.length > 2 && (
              <span className="rounded-full bg-[#1111111A] px-2.5 py-1 text-xs font-semibold text-foreground">
                +{lake.species.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={authModal.isOpen}
        initialView={authModal.view}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </motion.div>
  );
}
