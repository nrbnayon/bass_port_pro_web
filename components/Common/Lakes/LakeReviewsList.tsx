"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

const reviewsData = [
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
];

export default function LakeReviewsList() {
  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-xs">
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl mb-6">
          Write a Review
        </h2>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="h-8 w-8 text-[#F59E0B] transition-transform hover:scale-110 active:scale-95"
              >
                <HugeiconsIcon icon={StarIcon} className="h-8 w-8" />
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              className="w-full h-40 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              placeholder="Share your experience fishing this lake..."
            />
            <div className="absolute right-6 bottom-6">
              <button className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl mb-8">
          Community Reviews (518)
        </h2>

        <div className="space-y-6">
          {reviewsData.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-xs transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${review.color} text-white`}
                  >
                    <span className="text-lg font-bold">{review.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground leading-none mb-1.5">
                      {review.author}
                    </h3>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      {review.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <HugeiconsIcon
                      key={i}
                      icon={StarIcon}
                      className={`h-4 w-4 ${i < review.rating ? "fill-[#F59E0B]" : "text-gray-200"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-gray-50 pt-6">
                <p className="text-[15px] font-medium leading-relaxed text-secondary italic">
                  &quot;{review.text}&quot;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
