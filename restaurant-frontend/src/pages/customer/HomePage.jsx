import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Leaf, ChefHat, Truck, Award, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import { menuService } from "../../services/menuService";
import { filterAvailableItems, applyMenuOrder, getPopularIds } from "../../utils/menuStorage";
import MenuCard from "../../components/common/organisms/MenuCard";

import { ASSETS } from "../../constants/assets";

import "swiper/css";
import "swiper/css/pagination";

const features = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "We use only the freshest and highest quality ingredients.",
  },
  {
    icon: ChefHat,
    title: "Expert Chefs",
    description:
      "Our chefs are passionate about cooking and creating great flavors.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "We deliver your food hot and fresh right to your door.",
  },
  {
    icon: Award,
    title: "Best Quality",
    description:
      "Quality is our promise and customer satisfaction is our goal.",
  },
];

const happyCustomerAvatars = [
  "https://i.pravatar.cc/80?img=12",
  "https://i.pravatar.cc/80?img=32",
  "https://i.pravatar.cc/80?img=45",
  "https://i.pravatar.cc/80?img=15",
  "https://i.pravatar.cc/80?img=8",
];

const reviews = [
  {
    id: 1,
    quote: "The food here is absolutely sublime! Every dish is a work of art. The atmosphere and the service made our anniversary truly unforgettable. The Truffle Pasta is a must-try!",
    name: "Eleanor Vance",
    role: "Food Critic",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: 2,
    quote: "Savora has completely redefined dining in Cairo. The attention to detail in the flavor profiles and presentation is world-class. Fast delivery and it arrived steaming hot!",
    name: "Karim Abdel-Aziz",
    role: "Regular Guest",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: 3,
    quote: "A perfect blend of cozy atmosphere and culinary perfection. The staff is exceptionally warm and the Steak Frites is by far the best I've ever had. Highly recommended!",
    name: "Sarah Jenkins",
    role: "Local Guide",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: 4,
    quote: "Outstanding experience! The ingredients are incredibly fresh, and you can taste the chef's passion. I order delivery at least twice a week and the service is always flawless.",
    name: "Michael Chen",
    role: "Culinary Enthusiast",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
];

export default function HomePage() {
  const { data: dishes = [], isLoading: loading } = useQuery({
    queryKey: ["menu"],
    queryFn: () => menuService.getMenu(),
    staleTime: 5 * 60 * 1000,
    select: (data) => applyMenuOrder(filterAvailableItems(data)),
  });

  // Show admin-curated popular dishes, fallback to the first 4 if none selected
  const popularIdsList = getPopularIds();
  const popularDishes =
    popularIdsList.length > 0
      ? popularIdsList
          .map((id) => dishes.find((d) => String(d.id) === id))
          .filter(Boolean)
      : dishes.slice(0, 4);

  return (
    <div>
      {/* =========================
          Hero Section
      ========================== */}
      <section className="relative overflow-hidden bg-warm-950">
        <div className="absolute inset-0">
          <img
            src={ASSETS.hero}
            alt="Delicious food"
            className="w-full h-full object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-warm-950/100 via-warm-950/0 to-warm-950/0" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-secondary/15 text-secondary rounded-full text-sm font-medium mb-5 backdrop-blur-sm border border-secondary/30">
              ✦ WELCOME TO SAVORA
            </span>

            <h2 className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
              Good<span className="text-primary"> Food</span>
              <br />
              Good<span className="text-primary"> Mood</span>
            </h2>

            <p className="mt-5 text-sm md:text-base lg:text-lg text-warm-200 leading-relaxed max-w-lg">
              Discover flavor in every bite. Fresh ingredients, perfectly
              cooked, served with love to create an unforgettable dining
              experience.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2"
              >
                Explore Menu
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Popular Dishes
      ========================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-9">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Our Menu
          </span>

          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-warm-900 mt-2">
            Popular Dishes
          </h2>

          <p className="text-warm-500 mt-3 max-w-xl mx-auto text-sm md:text-base">
            Discover some of our favorite dishes, prepared with fresh
            ingredients and served with love.
          </p>
        </div>

        {/* Dishes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-warm-200" />

                <div className="p-5 space-y-3">
                  <div className="h-4 bg-warm-200 rounded w-3/4" />

                  <div className="h-3 bg-warm-100 rounded w-full" />

                  <div className="h-6 bg-warm-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : popularDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish) => (
              <MenuCard key={dish.id} item={dish} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-warm-500">No dishes are currently available.</p>
          </div>
        )}

        {/* View Full Menu */}
        <div className="text-center mt-10">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300"
          >
            View Full Menu
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* =========================
          Why Choose Savora
      ========================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <div className="bg-secondary rounded-3xl shadow-lg relative overflow-hidden px-6 sm:px-8 lg:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Text Content */}
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">
                Why Choose Savora
              </span>

              <h2 className="font-playfair text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-warm-900 mt-3 leading-tight">
                We Serve More
                <br />
                Than Just Food
              </h2>

              <p className="mt-5 text-warm-600 text-sm leading-relaxed max-w-lg">
                At Savora, we believe that great food brings people together. We
                use the freshest ingredients, cook with love, and serve with a
                smile.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {features.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex items-start gap-2">
                    <div className="shrink-0 w-12 h-12 bg-warm-100 text-primary rounded-xl flex items-center justify-center">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-warm-900 text-sm sm:text-base">
                        {title}
                      </h3>

                      <p className="mt-1 text-warm-500 text-xs leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restaurant Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={ASSETS.Savora1}
                  alt="Savora restaurant interior"
                  className="w-full h-[320px] sm:h-[380px] md:h-[420px] object-cover"
                />

                <div className="absolute top-5 right-5 flex flex-col items-center">
                  <img
                    src={ASSETS.Logo}
                    alt="Savora"
                    className="w-24 sm:w-28 opacity-95"
                  />
                </div>
              </div>

              {/* Happy Customers */}
              <div className="absolute -bottom-10 right-4 sm:right-8 bg-primary rounded-2xl shadow-xl px-5 py-4 w-[210px] sm:w-[230px]">
                <p className="font-playfair text-3xl sm:text-4xl font-bold text-white leading-none">
                  500+
                </p>

                <p className="text-white/90 text-sm font-medium mt-1">
                  Happy Customers
                </p>

                <div className="flex -space-x-3 mt-3">
                  {happyCustomerAvatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Happy customer"
                      className="w-9 h-9 rounded-full border-2 border-primary object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Customer Reviews Carousel
      ========================== */}
      <section className="bg-warm-100/60 py-16 md:py-24 overflow-hidden border-t border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Testimonials
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-warm-900 mt-3">
              What Our Guests Say
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-5 rounded-full" />
          </div>

          {/* Carousel */}
          <div className="relative px-2 sm:px-6">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              speed={1200}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="testimonials-swiper !pb-14"
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id} className="h-auto">
                  <div className="h-full flex flex-col justify-between bg-warm-950 hover:bg-black border border-warm-900 hover:border-primary/30 rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-xl group">
                    <div>
                      {/* Rating Stars */}
                      <div className="flex gap-1 mb-5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill="#eab308"
                            className="text-yellow-500"
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-warm-200 text-sm sm:text-base leading-relaxed italic mb-6">
                        &ldquo;{review.quote}&rdquo;
                      </p>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-4 border-t border-warm-900 pt-5 mt-auto">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <h4 className="font-semibold text-white text-sm sm:text-base">
                          {review.name}
                        </h4>
                        <p className="text-xs text-warm-400 mt-0.5">
                          {review.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
}
