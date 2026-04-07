"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, Message01Icon } from "@hugeicons/core-free-icons";
import { TablePagination } from "@/components/Shared/TablePagination";
import { toast } from "sonner";
import {
  useGetLakeReviewsQuery,
  useSubmitLakeReviewMutation,
} from "@/redux/services/lakesApi";
import { useUser } from "@/hooks/useUser";
import AuthModal, { AuthView } from "@/components/Auth/AuthModal";

interface LakeReviewsListProps {
  lakeId: string;
}

interface FallbackReview {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
  color: string;
}

const FALLBACK_REVIEWS: FallbackReview[] = [
  {
    id: "r1",
    author: "Bass Hunter 42",
    date: "2026-02-23",
    rating: 5,
    text: "Best bass lake I've ever fished. The grass beds are incredible and provide perfect cover for trophy largemouth.",
    avatar: "B",
    color: "bg-[#FF6B35]",
  },
  {
    id: "r2",
    author: "Texas Angler",
    date: "2026-02-15",
    rating: 4,
    text: "Great fishing but can get crowded on weekends. Go during the week for the best experience.",
    avatar: "T",
    color: "bg-[#4CAF50]",
  },
  {
    id: "r3",
    author: "Pro Fisher",
    date: "2026-02-13",
    rating: 5,
    text: "Consistently produces quality fish. My go-to lake for tournaments.",
    avatar: "P",
    color: "bg-[#2196F3]",
  },
];

export default function LakeReviewsList({ lakeId }: LakeReviewsListProps) {
  const { isAuthenticated } = useUser();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; view: AuthView }>({
    isOpen: false,
    view: "login",
  });
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [submitLakeReview, { isLoading: isSubmitting }] = useSubmitLakeReviewMutation();

  const { data, isError, isLoading } = useGetLakeReviewsQuery(
    { id: lakeId, page: currentPage, limit: 3 },
    { skip: !lakeId },
  );

  const fallbackReviews = useMemo(() => {
    const start = (currentPage - 1) * 3;
    return FALLBACK_REVIEWS.slice(start, start + 3);
  }, [currentPage]);

  const totalItems = isError ? FALLBACK_REVIEWS.length : data?.pagination?.total || 0;
  const totalPages = isError
    ? Math.ceil(FALLBACK_REVIEWS.length / 3)
    : data?.pagination?.pages || 1;

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, view: "login" });
      return;
    }

    if (!lakeId) {
      toast.error("Lake id missing");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      await submitLakeReview({ id: lakeId, rating, text: reviewText }).unwrap();
      toast.success("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      setCurrentPage(1);
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to submit review";
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-[#F3F4F6] bg-white p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">
          Write a Review
        </h2>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                aria-label={`Rate ${star}`}
                title={`Rate ${star}`}
              >
                <HugeiconsIcon
                  icon={StarIcon}
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "text-[#FACC15] fill-[#FACC15]"
                      : "text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full h-40 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              placeholder="Share your experience fishing this lake..."
            />
            <div className="absolute right-6 bottom-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
                <HugeiconsIcon icon={Message01Icon} className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl mb-5">
          Community Reviews ({totalItems})
        </h2>

        {isError && (
          <p className="mb-3 text-xs font-semibold text-amber-600">
            API unavailable. Showing fallback reviews.
          </p>
        )}

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {(isError ? fallbackReviews : data?.reviews || []).map((review, index) => {
              const isFallback = "author" in review;
              const author = isFallback ? review.author : review.user?.name || "Unknown";
              const avatar = isFallback
                ? review.avatar
                : (review.user?.name?.charAt(0) || "U").toUpperCase();
              const ratingValue = isFallback ? review.rating : review.rating;
              const text = review.text;
              const date = isFallback ? review.date : new Date(review.createdAt).toISOString().split("T")[0];
              const color = isFallback ? review.color : "bg-primary";

              return (
                <motion.div
                  key={isFallback ? review.id : review._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative flex flex-col gap-6 rounded-2xl border border-[#F3F4F6] bg-white p-6 transition-all hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color} text-white`}>
                        <span className="text-lg font-bold">{avatar}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground leading-none mb-0.5">{author}</h3>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <HugeiconsIcon
                          key={i}
                          icon={StarIcon}
                          className={`h-4 w-4 ${
                            i < ratingValue
                              ? "text-[#FACC15] fill-[#FACC15]"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-3">
                    <p className="text-[15px] font-medium leading-relaxed text-secondary italic">
                      &quot;{text}&quot;
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="mt-8">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={3}
              onPageChange={(page) => setCurrentPage(page)}
              className="border-none bg-transparent px-0"
            />
          </div>
        )}
      </section>

      <AuthModal
        isOpen={authModal.isOpen}
        initialView={authModal.view}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
