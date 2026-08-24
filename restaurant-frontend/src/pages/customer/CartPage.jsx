import { Link } from "react-router-dom";
import { Trash2, ArrowRight, ArrowLeft } from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatters";
import QuantitySelector from "../../components/common/molecules/QuantitySelector";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    cartCount,
    cartLoading,
  } = useCart();

  const { isAuthenticated } = useAuth();

  // Loading state
  // Prevents "Cart is Empty" from appearing during refresh
  if (cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-8 md:pb-12">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-warm-900 mb-8">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
          {/* Cart items skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-warm-100"
              >
                {/* Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-warm-100 shrink-0" />

                <div className="flex-1 min-w-0">
                  {/* Name */}
                  <div className="h-5 bg-warm-100 rounded w-1/2 mb-3" />

                  {/* Price */}
                  <div className="h-4 bg-warm-100 rounded w-1/4 mb-6" />

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="h-9 bg-warm-100 rounded-lg w-28" />

                    {/* Total */}
                    <div className="h-5 bg-warm-100 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-100">
              <div className="h-5 bg-warm-100 rounded w-1/2 mb-6" />

              <div className="h-4 bg-warm-100 rounded w-full mb-4" />

              <div className="h-5 bg-warm-100 rounded w-1/3 mb-6" />

              <div className="h-12 bg-warm-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-8 md:pb-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-7xl mb-6">🛒</div>

          <h1 className="font-playfair text-3xl font-bold text-warm-900 mb-3">
            Your Cart is Empty
          </h1>

          <p className="text-warm-500 mb-8">
            Looks like you haven't added anything to your cart yet. Browse our
            menu to find something delicious!
          </p>

          <Link
            to="/menu"
            className="btn-primary inline-flex items-center gap-2"
          >
            Browse Menu
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-8 md:pb-12">
      <h1 className="font-playfair text-3xl md:text-4xl font-bold text-warm-900 mb-8">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.menuItemId}
              className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-warm-100"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=60";
                }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-warm-900 text-base">
                      {item.name}
                    </h3>

                    <p className="text-primary font-bold mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.menuItemId)}
                    className="p-2 text-warm-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(newQty) => updateQuantity(item.menuItemId, newQty)}
                  />

                  {/* Item total */}
                  <span className="font-bold text-warm-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-100 sticky top-28">
            <h2 className="text-lg font-bold text-warm-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 pb-4 border-b border-warm-100">
              <div className="flex justify-between text-sm">
                <span className="text-warm-500">Items ({cartCount})</span>

                <span className="text-warm-800 font-medium">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <div className="flex justify-between py-4 text-lg font-bold">
              <span className="text-warm-900">Total</span>

              <span className="text-primary">{formatPrice(subtotal)}</span>
            </div>

            {isAuthenticated ? (
              <Link
                to="/checkout"
                className="btn-primary w-full text-center flex items-center justify-center gap-2 py-3.5"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>
            ) : (
              <Link
                to="/login"
                state={{
                  from: {
                    pathname: "/checkout",
                  },
                }}
                className="btn-primary w-full text-center flex items-center justify-center gap-2 py-3.5"
              >
                Login to Checkout
                <ArrowRight size={18} />
              </Link>
            )}

            <Link
              to="/menu"
              className="flex items-center justify-center gap-2 mt-3 text-sm text-warm-600 hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
