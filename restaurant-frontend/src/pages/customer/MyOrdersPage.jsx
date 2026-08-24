import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import {
  formatPrice,
  formatDateTime,
  formatOrderId,
  getStatusColor,
  capitalize,
} from "../../utils/formatters";

const STATUS_TABS = ["all", "pending", "preparing", "completed", "cancelled"];

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: orderService.getMyOrders,
  });

  const filtered =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-playfair text-3xl font-bold text-warm-900 mb-8">
          My Orders
        </h1>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-5 bg-warm-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-warm-100 rounded w-1/2 mb-2" />
              <div className="h-4 bg-warm-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-8 md:pb-12">
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-warm-300 mb-4" />

          <h3 className="text-xl font-semibold text-warm-700 mb-2">
            Failed to load orders
          </h3>

          <p className="text-warm-500 mb-6">
            Something went wrong while loading your orders.
          </p>

          <Link to="/menu" className="btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-8 md:pb-12">
      <h1 className="font-playfair text-3xl md:text-4xl font-bold text-warm-900 mb-8">
        My Orders
      </h1>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap mb-8 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
              ${
                activeTab === tab
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-warm-600 hover:bg-warm-100 border border-warm-200"
              }
            `}
          >
            {capitalize(tab)}

            {tab !== "all" && (
              <span className="ml-1.5 text-xs opacity-80">
                ({orders.filter((order) => order.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-warm-300 mb-4" />

          <h3 className="text-xl font-semibold text-warm-700 mb-2">
            No orders found
          </h3>

          <p className="text-warm-500 mb-6">
            {activeTab === "all"
              ? "You haven't placed any orders yet."
              : `No ${activeTab} orders.`}
          </p>

          <Link to="/menu" className="btn-primary">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {[...filtered]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-warm-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-warm-900 text-lg">
                      Order {formatOrderId(order.id)}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-warm-500 mt-1">
                      <Clock size={14} />
                      {formatDateTime(order.createdAt)}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-warm-100">
                  <div>
                    <span className="text-sm text-warm-500">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </span>

                    <span className="mx-2 text-warm-300">•</span>

                    <span className="font-bold text-primary">
                      Total: {formatPrice(order.total)}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                  >
                    <Eye size={16} />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
