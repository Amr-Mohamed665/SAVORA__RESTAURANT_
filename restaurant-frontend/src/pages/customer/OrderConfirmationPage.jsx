import { useParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import {
  formatPrice,
  formatDateTime,
  formatOrderId,
} from "../../utils/formatters";

export default function OrderConfirmationPage() {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-warm-900">Order not found</h2>

        <Link to="/menu" className="btn-primary mt-6 inline-block">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-8 md:pb-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-warm-900">
          Order Confirmed!
        </h1>

        <p className="text-warm-500 mt-3 text-lg">
          Thank you for your order. We're preparing your food with love!
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-warm-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-warm-100">
          <div>
            <p className="text-sm text-warm-500">Order ID</p>

            <p className="font-bold text-warm-900 text-lg">
              {formatOrderId(order.id)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-warm-500">Date</p>

            <p className="text-warm-700 text-sm">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="divide-y divide-warm-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between py-3">
              <div>
                <p className="font-medium text-warm-900">{item.name}</p>

                <p className="text-sm text-warm-500">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>

              <span className="font-semibold text-warm-900">
                {formatPrice(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4 mt-4 border-t-2 border-warm-200 text-lg font-bold">
          <span className="text-warm-900">Total</span>

          <span className="text-primary">{formatPrice(order.total)}</span>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-xl">
          <Package size={18} />

          <span>
            Status: <strong className="capitalize">{order.status}</strong>
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
        <Link
          to="/my-orders"
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          View My Orders
          <ArrowRight size={18} />
        </Link>

        <Link
          to="/menu"
          className="px-6 py-3 border-2 border-warm-300 text-warm-700 rounded-full font-semibold text-center hover:border-primary hover:text-primary transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
