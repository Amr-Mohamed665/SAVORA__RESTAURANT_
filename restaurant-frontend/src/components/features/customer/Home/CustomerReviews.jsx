import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Cloud name for the project's Cloudinary account
const CLOUD = "lslwlv9d";

// Helper: Cloudinary remote fetch URL — images are served by Cloudinary CDN
// No local files needed; Cloudinary fetches and caches each photo
const cloudFetch = (remoteUrl, w = 200, h = 200) =>
  `https://res.cloudinary.com/${CLOUD}/image/fetch/w_${w},h_${h},c_fill,g_face,f_auto,q_auto/${encodeURIComponent(remoteUrl)}`;

const reviews = [
  {
    id: 1,
    name: "Ahmed Al-Kurdi",
    image: cloudFetch("https://randomuser.me/api/portraits/men/32.jpg"),
    rating: 5,
    text: "Outstanding food quality! The main dishes were incredibly tasty and cooked to perfection. Five stars all the way!",
  },
  {
    id: 2,
    name: "Nourhan Salem",
    image: cloudFetch("https://randomuser.me/api/portraits/women/44.jpg"),
    rating: 5,
    text: "The atmosphere was beautiful, and everything tasted fresh and authentic. Excellent service too.",
  },
  {
    id: 3,
    name: "Mohammed Al-Otaibi",
    image: cloudFetch("https://randomuser.me/api/portraits/men/15.jpg"),
    rating: 5,
    text: "Generous portion sizes and great value for money. The grilled chicken was so juicy and well-marinated.",
  },
  {
    id: 4,
    name: "Sara Mahmoud",
    image: cloudFetch("https://randomuser.me/api/portraits/women/63.jpg"),
    rating: 5,
    text: "Very clean restaurant with a cozy vibe. The desserts were delicious, and the presentation was lovely.",
  },
  {
    id: 5,
    name: "Khalid Al-Shami",
    image: cloudFetch("https://randomuser.me/api/portraits/men/71.jpg"),
    rating: 5,
    text: "Amazing dining experience. The staff was very attentive, and the food was served hot and fresh.",
  },
  {
    id: 6,
    name: "Miyar Al-Hussein",
    image: cloudFetch("https://randomuser.me/api/portraits/women/28.jpg"),
    rating: 5,
    text: "One of the best dining experiences I've had. Clean, welcoming atmosphere, and incredibly flavorful appetizers.",
  },
  {
    id: 7,
    name: "Tamer Al-Feki",
    image: cloudFetch("https://randomuser.me/api/portraits/men/52.jpg"),
    rating: 5,
    text: "Great value for money. The food tasted fresh, and the staff was extremely friendly. Highly recommended!",
  },
  {
    id: 8,
    name: "Huda Al-Shareef",
    image: cloudFetch("https://randomuser.me/api/portraits/women/17.jpg"),
    rating: 5,
    text: "Perfect place for family dinner. The service was outstanding, and every dish was absolutely delicious.",
  },
  {
    id: 9,
    name: "Yousef Al-Balushi",
    image: cloudFetch("https://randomuser.me/api/portraits/men/88.jpg"),
    rating: 5,
    text: "Excellent food and prompt service. The presentation was top-notch, and the ingredients were extremely fresh.",
  },
  {
    id: 10,
    name: "Lina Zahran",
    image: cloudFetch("https://randomuser.me/api/portraits/women/56.jpg"),
    rating: 5,
    text: "Absolutely loved the atmosphere! The seafood was fresh and delicious. I'll definitely come back.",
  },
];

export default function CustomerReviews() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="bg-warm-50 py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-warm-900 mt-2">
            What Our Customers Say
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Carousel Container */}
        <div className="relative px-2 sm:px-10">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              el: ".reviews-pagination",
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            grabCursor={true}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
              1024: { slidesPerView: 3, spaceBetween: 24, centeredSlides: false },
              1280: { slidesPerView: 4, spaceBetween: 28, centeredSlides: false },
            }}
            className="!pb-14 testimonials-swiper"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto">
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

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-secondary text-secondary"
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="text-warm-600 text-sm leading-relaxed italic flex-grow">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Prev Button */}
          <button
            ref={prevRef}
            type="button"
            aria-label="Previous reviews"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-warm-200 shadow flex items-center justify-center text-warm-700 hover:text-primary hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer hidden sm:flex"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Next Button */}
          <button
            ref={nextRef}
            type="button"
            aria-label="Next reviews"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-warm-200 shadow flex items-center justify-center text-warm-700 hover:text-primary hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer hidden sm:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="reviews-pagination flex justify-center gap-2 mt-2" />
      </div>
    </section>
  );
}

