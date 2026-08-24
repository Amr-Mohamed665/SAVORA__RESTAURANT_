import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock, User, Package } from "lucide-react";
import toast from "react-hot-toast";

import { orderService } from "../../services/orderService";
import {
  formatPrice,
  formatDateTime,
  formatOrderId,
  getStatusColor,
  capitalize,
} from "../../utils/formatters";

const STATUS_OPTIONS = ["pending", "preparing", "completed", "cancelled"];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Fetch order
  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });

  // Update order status
  const updateStatusMutation = useMutation({
    mutationFn: (newStatus) => orderService.updateOrderStatus(id, newStatus),

    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(["order", id], updatedOrder);

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success(
        `Order status updated to ${capitalize(updatedOrder.status)}!`,
      );
    },

    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update order status.";

      toast.error(message);
    },
  });

  const handleStatusChange = (newStatus) => {
    updateStatusMutation.mutate(newStatus);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-center py-12">
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>

        <Link to="/admin/orders" className="btn-primary inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Orders Management
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div>
          <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">
            Order Details
          </span>

          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {formatOrderId(order.id)}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mt-2">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {formatDateTime(order.createdAt)}
            </span>

            <span className="hidden sm:inline text-gray-600">|</span>

            <span className="flex items-center gap-1.5">
              <User size={14} />
              Customer ID:
              <strong className="font-mono text-xs">{order.userId}</strong>
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="status"
            className="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            Update Status
          </label>

          <select
            id="status"
            value={order.status}
            disabled={updateStatusMutation.isPending}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-gray-950 border border-gray-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-medium capitalize disabled:opacity-60"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">
              Items Summary
            </h2>

            <div className="divide-y divide-gray-800/50">
              {order.items.map((item, index) => (
                <div
                  key={`${item.menuItemId}-${index}`}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white">
                      {item.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      ID: {item.menuItemId}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-semibold text-white">
                      {formatPrice(item.lineTotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t-2 border-gray-800/80 flex justify-between text-base font-bold">
              <span className="text-gray-400">Grand Total</span>

              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">
              Order Status
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`p-2.5 rounded-xl ${getStatusColor(order.status)}`}
                >
                  <Package size={18} />
                </span>

                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    Current Status
                  </p>

                  <p className="text-sm font-semibold capitalize text-white mt-0.5">
                    {order.status}
                  </p>
                </div>
              </div>

              {order.status === "cancelled" ? (
                <div className="p-3 bg-red-950/20 border border-red-900/50 text-red-400 rounded-xl text-xs">
                  This order was cancelled and will not be prepared.
                </div>
              ) : (
                <div className="p-3 bg-blue-950/20 border border-blue-900/50 text-blue-400 rounded-xl text-xs">
                  Review status updates carefully. Status transitions directly
                  affect customer notifications.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
