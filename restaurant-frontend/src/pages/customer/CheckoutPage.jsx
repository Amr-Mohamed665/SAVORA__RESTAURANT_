import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

import { useCart } from "../../context/CartContext";
import { orderService } from "../../services/orderService";
import { formatPrice } from "../../utils/formatters";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const placeOrderMutation = useMutation({
    mutationFn: (orderItems) => orderService.createOrder(orderItems),

    onSuccess: (order) => {
      clearCart();

      toast.success("Order placed successfully!", {
        style: {
          borderRadius: "12px",
          background: "#1a1a1a",
          color: "#fff",
        },
      });

      navigate(`/order-confirmation/${order.id}`);
    },

    onError: (err) => {
      if (!err._toasted) {
        const message =
          err.response?.data?.message ||
          "Failed to place order. Please try again.";

        toast.error(message);
      }
    },
  });

  const handlePlaceOrder = () => {
    const orderItems = items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
    }));

    placeOrderMutation.mutate(orderItems);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>

        <h2 className="text-2xl font-bold text-warm-900 mb-2">
          Your cart is empty
        </h2>

        <p className="text-warm-500 mb-6">
          Add some items before checking out.
        </p>

        <Link to="/menu" className="btn-primary">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-8 md:pb-12">
      {/* Back to Cart */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-warm-600 hover:text-primary font-medium mb-8 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Cart
      </Link>

      {/* Page Title */}
      <h1 className="font-playfair text-3xl md:text-4xl font-bold text-warm-900 mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-100">
            <h2 className="text-lg font-bold text-warm-900 mb-4">
              Order Items
            </h2>

            <div className="divide-y divide-warm-100">
              {items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=60";
                    }}
                  />

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-warm-900 text-sm">
                      {item.name}
                    </h3>

                    <p className="text-warm-500 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* Item Total */}
                  <span className="font-semibold text-warm-900 text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-100 sticky top-28">
            <h2 className="text-lg font-bold text-warm-900 mb-4">
              Order Summary
            </h2>

            {/* Items Summary */}
            <div className="space-y-3 pb-4 border-b border-warm-100">
              {items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-warm-500 truncate mr-2">
                    {item.name} × {item.quantity}
                  </span>

                  <span className="text-warm-700 font-medium shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between py-4 text-lg font-bold">
              <span className="text-warm-900">Total</span>

              <span className="text-primary">{formatPrice(subtotal)}</span>
            </div>

            {/* Server Price Notice */}
            <p className="text-xs text-warm-400 mb-4 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              Final prices are calculated by the server
            </p>

            {/* Place Order */}
            <button
              onClick={handlePlaceOrder}
              disabled={placeOrderMutation.isPending}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {placeOrderMutation.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
