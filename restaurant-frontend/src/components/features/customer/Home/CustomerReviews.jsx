import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { reviews } from "./reviewsData";

// ---------------------------------------------------------------------------
// Swiper configuration constants
// ---------------------------------------------------------------------------

const SWIPER_AUTOPLAY = {
  delay: 3000,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
};

const SWIPER_PAGINATION = {
  clickable: true,
  el: ".reviews-pagination",
};

/**
 * Responsive breakpoints for the testimonials Swiper carousel.
 * Key = min-width in px, value = Swiper breakpoint options.
 */
const SWIPER_BREAKPOINTS = {
  640:  { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
  1024: { slidesPerView: 3, spaceBetween: 24, centeredSlides: false },
  1280: { slidesPerView: 4, spaceBetween: 28, centeredSlides: false },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Section header with eyebrow label, heading, and decorative underline.
 */
function SectionHeader() {
  return (
    <div className="text-center mb-10 md:mb-12">
      <span className="text-primary text-sm font-semibold uppercase tracking-widest">
        Testimonials
      </span>
      <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-warm-900 mt-2">
        What Our Customers Say
      </h2>
      <div className="w-16 h-1 bg-secondary mx-auto mt-4 rounded-full" />
    </div>
  );
}

/**
 * A single review card displayed inside the Swiper carousel.
 *
 * @param {{ review: import("./reviewsData").Review }} props
 */
function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl border border-warm-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center h-full min-h-[280px]">
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-secondary shadow bg-warm-100 mb-3 flex-shrink-0">
        <img
          src={review.image}
          alt={`Profile photo of ${review.name}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Name */}
      <h3 className="font-sans font-bold text-warm-900 text-sm leading-tight mb-2">
        {review.name}
      </h3>

      {/* Star rating */}
      <div
        className="flex gap-0.5 mb-3"
        aria-label={`${review.rating} out of 5 stars`}
      >
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className="fill-secondary text-secondary"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Review text */}
      <p className="text-warm-600 text-sm leading-relaxed italic flex-grow">
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  );
}

/**
 * Reusable carousel navigation button (prev / next).
 *
 * @param {{ navRef: React.RefObject, direction: "prev" | "next" }} props
 */
function NavButton({ navRef, direction }) {
  const isPrev = direction === "prev";

  return (
    <button
      ref={navRef}
      type="button"
      aria-label={isPrev ? "Previous reviews" : "Next reviews"}
      className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-warm-200 shadow flex items-center justify-center text-warm-700 hover:text-primary hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer hidden sm:flex"
      style={{ [isPrev ? "left" : "right"]: 0 }}
    >
      {isPrev ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Renders the "Customer Reviews" testimonials section on the Home page.
 * Uses a Swiper carousel with autoplay, pagination dots, and custom nav arrows.
 */
export default function CustomerReviews() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="bg-warm-50 py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader />

        {/* Carousel */}
        <div className="relative px-2 sm:px-10">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            grabCursor={true}
            autoplay={SWIPER_AUTOPLAY}
            pagination={SWIPER_PAGINATION}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={SWIPER_BREAKPOINTS}
            className="!pb-14 testimonials-swiper"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto">
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>

          <NavButton navRef={prevRef} direction="prev" />
          <NavButton navRef={nextRef} direction="next" />
        </div>

        {/* Pagination dots */}
        <div className="reviews-pagination flex justify-center gap-2 mt-2" />
      </div>
    </section>
  );
}
