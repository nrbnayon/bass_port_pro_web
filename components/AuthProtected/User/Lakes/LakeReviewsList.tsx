"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, Message01Icon } from "@hugeicons/core-free-icons";
import { TablePagination } from "@/components/Shared/TablePagination";
import { toast } from "sonner";

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
  color: string;
}

// Generate a unique ID for a new review record
const generateReviewId = () => `r${Date.now()}`;

// Get current date string in YYYY-MM-DD format
const getCurrentDateString = () => new Date().toISOString().split("T")[0];

const INITIAL_REVIEWS: Review[] = [
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
    text: "Great fishing but can get crowded on weekends. Go during the week for the best experience. The water quality is top-notch.",
    avatar: "T",
    color: "bg-[#4CAF50]",
  },
  {
    id: "r3",
    author: "Pro Fisher",
    date: "2026-02-13",
    rating: 5,
    text: "Consistently produces quality fish. My go-to lake for tournaments. Always look for the deep ledges in the summer months.",
    avatar: "P",
    color: "bg-[#2196F3]",
  },
  {
    id: "r4",
    author: "Lake Lover",
    date: "2026-02-10",
    rating: 3,
    text: "Decent spot, but the boat ramp needs maintenance. Caught a few small ones near the dam.",
    avatar: "L",
    color: "bg-[#9C27B0]",
  },
  {
    id: "r5",
    author: "Night Caster",
    date: "2026-02-05",
    rating: 4,
    text: "Night fishing here is outstanding. The topwater action just before dawn is something every angler should experience.",
    avatar: "N",
    color: "bg-[#3F51B5]",
  },
];

export default function LakeReviewsList() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const currentReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    const newReview: Review = {
      id: generateReviewId(),
      author: "You (Guest)",
      date: getCurrentDateString(),
      rating,
      text: reviewText,
      avatar: "Y",
      color: "bg-primary",
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setReviewText("");
    toast.success("Review submitted successfully!");
    setCurrentPage(1);
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
                className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
              >
                Submit Review{" "}
                <HugeiconsIcon
                  icon={Message01Icon}
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl mb-5">
          Community Reviews ({reviews.length})
        </h2>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {currentReviews.map((review, index) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col gap-6 rounded-2xl border border-[#F3F4F6] bg-white p-6 transition-all hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${review.color} text-white`}
                    >
                      <span className="text-lg font-bold">{review.avatar}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground leading-none mb-0.5">
                        {review.author}
                      </h3>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        {review.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <HugeiconsIcon
                        key={i}
                        icon={StarIcon}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-[#FACC15] fill-[#FACC15]"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-3">
                  <p className="text-[15px] font-medium leading-relaxed text-secondary italic">
                    &quot;{review.text}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="mt-8">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={reviews.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              className="border-none bg-transparent px-0"
            />
          </div>
        )}
      </section>
    </div>
  );
}
