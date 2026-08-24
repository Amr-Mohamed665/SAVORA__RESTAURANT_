import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Eye, ClipboardList, Filter } from "lucide-react";

import { orderService } from "../../services/orderService";
import {
  formatPrice,
  formatDateTime,
  formatOrderId,
  getStatusColor,
  capitalize,
} from "../../utils/formatters";

const STATUS_FILTERS = [
  "all",
  "pending",
  "preparing",
  "completed",
  "cancelled",
];

export default function OrdersManagementPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch orders
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getAllOrders(),
    staleTime: 2 * 60 * 1000,
  });

  if (isError) {
    console.error("Failed to fetch orders:", error);
  }

  const filteredOrders = orders
    .filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesSearch =
        formatOrderId(order.id).toLowerCase().includes(search.toLowerCase()) ||
        order.userId.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary">Orders Management</h1>

        <p className="text-white text-sm mt-1">{orders.length} orders total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search by order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
          />
        </div>

        {/* Status filters */}
        <div className="flex gap-2 flex-wrap items-center overflow-x-auto pb-1 max-w-full w-full sm:w-auto">
          <Filter
            size={16}
            className="text-gray-500 shrink-0 hidden sm:block"
          />

          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap cursor-pointer
                ${
                  statusFilter === filter
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800"
                }
              `}
            >
              {capitalize(filter)}

              {filter !== "all" && (
                <span className="ml-1 opacity-70">
                  ({orders.filter((o) => o.status === filter).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div>
        {isLoading ? (
          <div className="p-8 space-y-4 bg-gray-900/60 border border-gray-800/50 rounded-2xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-800/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400 bg-gray-900/60 border border-gray-800/50 rounded-2xl">
            <p className="text-base">Failed to load orders</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-500 bg-gray-900/60 border border-gray-800/50 rounded-2xl">
            <ClipboardList
              size={48}
              className="mx-auto mb-4 opacity-40 text-gray-400"
            />

            <p className="text-base">No orders found matching filters</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block bg-gray-900/60 backdrop-blur border border-gray-800/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800/30">
                      <th className="text-left px-6 py-3 font-medium">
                        Order ID
                      </th>

                      <th className="text-left px-6 py-3 font-medium">
                        Date/Time
                      </th>

                      <th className="text-left px-6 py-3 font-medium">Items</th>

                      <th className="text-left px-6 py-3 font-medium">Total</th>

                      <th className="text-left px-6 py-3 font-medium">
                        Status
                      </th>

                      <th className="text-right px-6 py-3 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-800/30">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-800/30 transition-colors"
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4 text-sm font-semibold text-white">
                          {formatOrderId(order.id)}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {formatDateTime(order.createdAt)}
                        </td>

                        {/* Items */}
                        <td className="px-6 py-4 text-sm text-gray-400">
                          <div
                            className="max-w-50 truncate"
                            title={order.items
                              .map((i) => `${i.name} x${i.quantity}`)
                              .join(", ")}
                          >
                            {order.items
                              .map((i) => `${i.name} (x${i.quantity})`)
                              .join(", ")}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 text-sm font-bold text-white">
                          {formatPrice(order.total)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center gap-1.5 text-sm font-medium"
                          >
                            <Eye size={16} />
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-900 border border-gray-800/80 rounded-2xl p-4 flex flex-col gap-3 hover:border-gray-700/50 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {formatOrderId(order.id)}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Meta Data */}
                  <div className="text-xs space-y-2 text-gray-400 border-t border-b border-gray-800 py-3 my-1">
                    <div className="flex justify-between">
                      <span>Date & Time:</span>

                      <span className="text-white font-medium">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      <span>Customer ID:</span>

                      <span
                        className="text-white font-mono text-[10px] truncate max-w-45 bg-gray-950/40 px-2 py-0.5 rounded border border-gray-800/60"
                        title={order.userId}
                      >
                        {order.userId}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-gray-950/45 border border-gray-800/60 rounded-xl p-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1.5 font-semibold">
                      Items
                    </span>

                    <p
                      className="text-xs text-gray-300 leading-relaxed max-h-16 overflow-y-auto pr-1"
                      title={order.items
                        .map((i) => `${i.name} x${i.quantity}`)
                        .join(", ")}
                    >
                      {order.items
                        .map((i) => `${i.name} (x${i.quantity})`)
                        .join(", ")}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                        Total
                      </span>

                      <span className="text-base font-extrabold text-white">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="py-2.5 px-4 bg-gray-950/40 hover:bg-primary/10 border border-gray-800/80 hover:border-primary/30 rounded-xl text-gray-300 hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                    >
                      <Eye size={14} />
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
