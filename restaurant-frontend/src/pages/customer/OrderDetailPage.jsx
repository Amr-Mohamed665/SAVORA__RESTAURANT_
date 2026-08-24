import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import {
  formatPrice,
  formatDateTime,
  formatOrderId,
  getStatusColor,
} from "../../utils/formatters";

const statusSteps = ["pending", "preparing", "completed"];

export default function OrderDetailPage() {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-8 md:pb-12 text-center">
        <h2 className="text-2xl font-bold text-warm-900">Order not found</h2>

        <Link to="/my-orders" className="btn-primary mt-6 inline-block">
          My Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-8 md:pb-12">
      <Link
        to="/my-orders"
        className="inline-flex items-center gap-2 text-warm-600 hover:text-primary font-medium mb-8 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to My Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-warm-900">
            Order {formatOrderId(order.id)}
          </h1>

          <div className="flex items-center gap-2 text-sm text-warm-500 mt-2">
            <Clock size={14} />
            {formatDateTime(order.createdAt)}
          </div>
        </div>

        <span
          className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${getStatusColor(
            order.status,
          )}`}
        >
          {order.status}
        </span>
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-100 mb-6">
          <h2 className="font-semibold text-warm-900 mb-4">Order Progress</h2>

          <div className="flex items-center justify-between">
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      idx <= currentStepIndex
                        ? "bg-primary text-white"
                        : "bg-warm-200 text-warm-400"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <span
                    className={`text-xs mt-2 font-medium capitalize ${
                      idx <= currentStepIndex ? "text-primary" : "text-warm-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {idx < statusSteps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full ${
                      idx < currentStepIndex ? "bg-primary" : "bg-warm-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-700 text-sm font-medium flex items-center gap-2">
          <Package size={18} />
          This order has been cancelled.
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-100">
        <h2 className="font-semibold text-warm-900 mb-4">Order Items</h2>

        <div className="divide-y divide-warm-100">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between py-3 first:pt-0 last:pb-0"
            >
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
      </div>
    </div>
  );
}
