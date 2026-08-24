import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShoppingBag, Check } from "lucide-react";
import { menuService } from "../../services/menuService";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatters";
import MenuCard from "../../components/common/organisms/MenuCard";
import QuantitySelector from "../../components/common/molecules/QuantitySelector";
import Button from "../../components/common/atoms/Button";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);

  const {
    data: item,
    isLoading: itemLoading,
    isError: itemError,
  } = useQuery({
    queryKey: ["menuItem", id],
    queryFn: () => menuService.getMenuItem(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const { data: related = [], isLoading: relatedLoading } = useQuery({
    queryKey: ["relatedMenuItems", item?.category],
    queryFn: async () => {
      const data = await menuService.getMenu({
        category: item.category,
      });

      return data.filter((menuItem) => menuItem.id !== item.id).slice(0, 4);
    },
    enabled: !!item?.category,
    staleTime: 1000 * 60 * 5,
  });

  const loading = itemLoading || relatedLoading;

  const handleAddToCart = () => {
    if (!item) return;

    addItem(item, quantity);

    toast.success(`${quantity}x ${item.name} added to cart!`, {
      style: {
        borderRadius: "12px",
        background: "#1a1a1a",
        color: "#fff",
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-warm-200 rounded w-32 mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="h-[400px] bg-warm-200 rounded-2xl" />

            <div className="space-y-4">
              <div className="h-8 bg-warm-200 rounded w-3/4" />
              <div className="h-10 bg-warm-200 rounded w-1/3" />
              <div className="h-4 bg-warm-100 rounded w-full" />
              <div className="h-4 bg-warm-100 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">😕</div>

        <h2 className="text-2xl font-bold text-warm-900 mb-2">
          Item Not Found
        </h2>

        <p className="text-warm-500 mb-6">
          The menu item you're looking for doesn't exist.
        </p>

        <Link to="/menu" className="btn-primary">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-8 md:pb-12">
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 text-warm-600 hover:text-primary font-medium mb-8 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-warm-100">
          {imageLoading && (
            <div className="absolute inset-0 bg-warm-200 animate-pulse" />
          )}
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=60";
              setImageLoading(false);
            }}
          />

          <span className="absolute top-4 left-4 px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-full">
            {item.category}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-warm-900">
            {item.name}
          </h1>

          <p className="text-primary text-2xl md:text-3xl font-bold mt-3">
            {formatPrice(item.price)}
          </p>

          <p className="text-warm-600 text-base leading-relaxed mt-4">
            {item.description}
          </p>

          {/* Availability */}
          <div className="mt-5 flex items-center gap-2">
            {item.available !== false ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-sm">
                <Check
                  size={16}
                  className="bg-emerald-100 rounded-full p-0.5"
                />
                Available
              </span>
            ) : (
              <span className="text-red-500 font-medium text-sm">
                Currently Unavailable
              </span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              className="border-warm-300 rounded-xl"
            />

            <Button
              onClick={handleAddToCart}
              disabled={item.available === false}
              variant="primary"
              size="lg"
              className="px-8"
            >
              <ShoppingBag size={20} className="mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Related Items */}
      {related.length > 0 && (
        <section className="mt-16 md:mt-20">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-warm-900 mb-8">
            You may also like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((dish) => (
              <MenuCard key={dish.id} item={dish} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
