import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChefHat,
  UtensilsCrossed,
  Salad,
  CakeSlice,
  Wine,
  AlertTriangle,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { menuService } from "../../services/menuService";
import { filterAvailableItems, applyMenuOrder } from "../../utils/menuStorage";

import MenuCard from "../../components/common/organisms/MenuCard";
import SearchBar from "../../components/common/molecules/SearchBar";
import Pagination from "../../components/common/molecules/Pagination";

const ITEMS_PER_PAGE = 12;

const categories = [
  { key: "all", label: "All", icon: ChefHat },
  { key: "Main Course", label: "Main Course", icon: UtensilsCrossed },
  { key: "Appetizer", label: "Appetizer", icon: Salad },
  { key: "Dessert", label: "Dessert", icon: CakeSlice },
  { key: "Beverage", label: "Beverage", icon: Wine },
];

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: dishes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["menu", search.trim(), activeCategory],

    queryFn: async () => {
      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (activeCategory !== "all") {
        params.category = activeCategory;
      }

      const data = await menuService.getMenu(params);

      const available = filterAvailableItems(data);

      return applyMenuOrder(available);
    },

    staleTime: 1000 * 60 * 5,
  });

  /*
   * Reset pagination whenever
   * search or category changes.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory]);

  /*
   * Pagination calculations
   */
  const totalPages = Math.ceil(dishes.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedDishes = dishes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("all");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-secondary/80 to-warm-100">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6 md:pb-12 md:pt-32 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Explore Our
          </span>

          <h1 className="mt-2 font-playfair text-3xl font-bold text-warm-900 md:text-5xl">
            — Our Menu —
          </h1>
        </div>

        {/* Mobile Categories */}
        <div className="mb-8 block sm:hidden">
          <Swiper
            slidesPerView="auto"
            spaceBetween={10}
            grabCursor={true}
            className="!px-1 !py-2"
          >
            {categories.map(({ key, label, icon: Icon }) => {
              const isActive = activeCategory === key;

              return (
                <SwiperSlide key={key} className="!w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveCategory(key)}
                    aria-pressed={isActive}
                    className={`flex select-none items-center gap-2 whitespace-nowrap rounded-full border px-5 py-3 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "scale-[1.02] border-primary bg-primary text-white shadow-lg shadow-primary/30"
                        : "border-warm-200 bg-white text-warm-600 hover:border-warm-300 hover:bg-warm-100 hover:text-warm-800"
                    }`}
                  >
                    <Icon size={17} strokeWidth={2} />
                    <span>{label}</span>
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Desktop Categories */}
        <div className="mb-8 hidden flex-wrap items-center justify-center gap-3 sm:flex lg:gap-4">
          {categories.map(({ key, label, icon: Icon }) => {
            const isActive = activeCategory === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveCategory(key)}
                aria-pressed={isActive}
                className={`flex select-none items-center gap-2 whitespace-nowrap rounded-full border px-5 py-3 text-sm font-medium transition-all duration-300 lg:px-6 ${
                  isActive
                    ? "scale-[1.02] border-primary bg-primary text-white shadow-lg shadow-primary/30"
                    : "border-warm-200 bg-white text-warm-600 hover:border-warm-300 hover:bg-warm-100 hover:text-warm-800"
                }`}
              >
                <Icon size={17} strokeWidth={2} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Search for dishes..."
          theme="light"
          className="mx-auto mb-10 max-w-xl"
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-48 bg-warm-200" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 rounded bg-warm-200" />

                  <div className="h-3 w-full rounded bg-warm-100" />

                  <div className="h-3 w-5/6 rounded bg-warm-100" />

                  <div className="mt-4 h-6 w-1/3 rounded bg-warm-200" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="py-16 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={40} strokeWidth={1.8} />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-warm-700">
              Failed to load menu
            </h3>

            <p className="mb-5 text-warm-500">
              Something went wrong while loading the dishes.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 font-medium text-white shadow-md transition-colors hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : dishes.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UtensilsCrossed size={40} strokeWidth={1.8} />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-warm-700">
              No dishes found
            </h3>

            <p className="mx-auto max-w-md text-warm-500">
              {search
                ? `No results for "${search}". Try a different search term.`
                : "No dishes available in this category."}
            </p>

            {(search || activeCategory !== "all") && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 font-medium text-white shadow-md transition-colors hover:bg-primary/90"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Results */
          <>
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-warm-500">
                {dishes.length} dish
                {dishes.length !== 1 ? "es" : ""} found
              </p>

              {(search || activeCategory !== "all") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium text-primary transition-all hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedDishes.map((dish) => (
                <MenuCard key={dish.id} item={dish} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
