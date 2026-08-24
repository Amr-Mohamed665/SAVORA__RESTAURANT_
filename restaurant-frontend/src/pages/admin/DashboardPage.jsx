import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  UtensilsCrossed,
  ClipboardList,
  Clock,
  TrendingUp,
  Eye,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { menuService } from "../../services/menuService";
import { orderService } from "../../services/orderService";
import {
  formatPrice,
  formatDateTime,
  formatOrderId,
  getStatusColor,
} from "../../utils/formatters";

const STATUS_COLORS = {
  pending: "#f59e0b",
  preparing: "#3b82f6",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

const STATUS_LABELS = {
  pending: "Pending",
  preparing: "Preparing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const TIME_PERIODS = [
  { label: "Today", value: "1d", days: 1 },
  { label: "Last Week", value: "7d", days: 7 },
  { label: "Last Month", value: "30d", days: 30 },
  { label: "Last 3 Months", value: "90d", days: 90 },
  { label: "Last 6 Months", value: "180d", days: 180 },
  { label: "Last Year", value: "365d", days: 365 },
];

/** Returns a Date set to midnight, `days` days ago (inclusive start). */
function getPeriodStart(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days + 1);
  return d;
}

/**
 * Build time-series buckets for the chosen period.
 * â‰¤ 30 days  â†’ daily buckets
 * â‰¤ 90 days  â†’ weekly buckets
 * else       â†’ monthly buckets
 */
function buildBuckets(orders, days) {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const start = getPeriodStart(days);

  if (days <= 30) {
    const buckets = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);

      const dayOrders = orders.filter((o) => {
        const t = new Date(o.createdAt);
        return t >= d && t < next;
      });

      buckets.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        orders: dayOrders.length,
        revenue: dayOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((s, o) => s + Number(o.total || 0), 0),
      });
    }
    return buckets;
  } else if (days <= 90) {
    const buckets = [];
    let cursor = new Date(start);
    while (cursor <= now) {
      const weekEnd = new Date(cursor);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekOrders = orders.filter((o) => {
        const t = new Date(o.createdAt);
        return t >= cursor && t < weekEnd;
      });

      buckets.push({
        date: cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        orders: weekOrders.length,
        revenue: weekOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((s, o) => s + Number(o.total || 0), 0),
      });

      cursor = weekEnd;
    }
    return buckets;
  } else {
    const buckets = [];
    let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cursor <= now) {
      const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      const monthOrders = orders.filter((o) => {
        const t = new Date(o.createdAt);
        return t >= cursor && t < monthEnd;
      });

      buckets.push({
        date: cursor.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        orders: monthOrders.length,
        revenue: monthOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((s, o) => s + Number(o.total || 0), 0),
      });

      cursor = monthEnd;
    }
    return buckets;
  }
}

export default function DashboardPage() {
  const [activePeriod, setActivePeriod] = useState("1d");

  const {
    data: menuItems = [],
    isLoading: menuLoading,
    isError: menuError,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: menuService.getMenu,
  });

  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: orderService.getAllOrders,
  });

  const loading = menuLoading || ordersLoading;
  const hasError = menuError || ordersError;

  const selectedPeriod = TIME_PERIODS.find((p) => p.value === activePeriod);

  /** Orders filtered to the selected time window */
  const periodOrders = useMemo(() => {
    const start = getPeriodStart(selectedPeriod.days);
    return orders.filter((o) => new Date(o.createdAt) >= start);
  }, [orders, selectedPeriod]);

  const totalRevenue = useMemo(
    () =>
      periodOrders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + Number(o.total || 0), 0),
    [periodOrders],
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const stats = [
    {
      title: "Total Orders",
      value: periodOrders.length,
      icon: ClipboardList,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      periodLabel: true,
    },
    {
      title: "Menu Items",
      value: menuItems.length,
      icon: UtensilsCrossed,
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
      periodLabel: false,
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-400",
      periodLabel: false,
    },
    {
      title: "Revenue",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      periodLabel: true,
    },
  ];

  const statusData = useMemo(() => {
    const statuses = ["pending", "preparing", "completed", "cancelled"];

    return statuses
      .map((status) => ({
        name: STATUS_LABELS[status],
        value: orders.filter((order) => order.status === status).length,
        status,
      }))
      .filter((item) => item.value > 0);
  }, [orders]);

  /** Unified chart data (orders + revenue) for the selected period */
  const chartData = useMemo(
    () => buildBuckets(orders, selectedPeriod.days),
    [orders, selectedPeriod],
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8),
    [orders],
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-900/50 rounded-2xl p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-3" />
              <div className="h-8 bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 h-80 bg-gray-900/50 rounded-2xl animate-pulse" />
          <div className="h-80 bg-gray-900/50 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <p className="text-red-400 font-medium">
            Failed to load dashboard data.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* â”€â”€ Time-period filter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-gray-300 text-base font-medium shrink-0">
          <Calendar size={18} />
          Period:
        </span>

        <div className="relative">
          <select
            value={activePeriod}
            onChange={(e) => setActivePeriod(e.target.value)}
            className="appearance-none bg-gray-800/80 border border-gray-700/70 text-gray-100 text-base font-semibold rounded-2xl pl-5 pr-12 py-3 cursor-pointer hover:border-primary/60 hover:bg-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all duration-200 min-w-[180px]"
          >
            {TIME_PERIODS.map((p) => (
              <option key={p.value} value={p.value} className="bg-gray-900 text-gray-100 font-medium">
                {p.label}
              </option>
            ))}
          </select>

          {/* Custom chevron icon */}
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* â”€â”€ Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-gray-900/60 backdrop-blur border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400 font-medium">
                {stat.title}
              </span>

              <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                <stat.icon size={18} className={stat.textColor} />
              </div>
            </div>

            <p className="text-2xl font-bold text-white">{stat.value}</p>

            {stat.periodLabel && (
              <p className="text-[11px] text-gray-500 mt-1">
                {selectedPeriod.label.toLowerCase()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* â”€â”€ Charts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders Chart */}
        <div className="xl:col-span-2 bg-gray-900/60 backdrop-blur border border-gray-800/50 rounded-2xl p-5 md:p-6">
          <div className="mb-6">
            <h2 className="text-white font-semibold text-lg">
              Orders Overview
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {selectedPeriod.label}
            </p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#6b7280"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />

                <Line
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: "#111827",
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Chart */}
        <div className="bg-gray-900/60 backdrop-blur border border-gray-800/50 rounded-2xl p-5 md:p-6">
          <div className="mb-4">
            <h2 className="text-white font-semibold text-lg">Order Status</h2>
            <p className="text-gray-500 text-sm mt-1">
              Current order distribution
            </p>
          </div>

          {statusData.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-gray-500 text-sm">
              No orders yet
            </div>
          ) : (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {statusData.map((item) => (
                        <Cell
                          key={item.status}
                          fill={STATUS_COLORS[item.status]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #374151",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                {statusData.map((item) => (
                  <div key={item.status} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: STATUS_COLORS[item.status],
                      }}
                    />

                    <span className="text-xs text-gray-400">{item.name}</span>

                    <span className="text-xs font-semibold text-white ml-auto">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ──── Revenue Chart ────────────────────────────────────────────────── */}
      <div className="bg-gray-900/60 backdrop-blur border border-gray-800/50 rounded-2xl p-5 md:p-6">
        <div className="mb-6">
          <h2 className="text-white font-semibold text-lg">Revenue Overview</h2>

          <p className="text-gray-500 text-sm mt-1">
            {selectedPeriod.label}
          </p>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />

              <YAxis
                stroke="#6b7280"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value) => [formatPrice(value), "Revenue"]}
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#9ca3af" }}
              />

              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#f97316"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* â”€â”€ Quick Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/menu"
          className="bg-gray-900/60 backdrop-blur border border-gray-800/50 rounded-2xl p-5 hover:border-primary/30 hover:bg-gray-900/80 transition-all group flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <UtensilsCrossed size={24} className="text-primary" />
          </div>

          <div>
            <h3 className="text-white font-semibold">Manage Menu</h3>

            <p className="text-gray-400 text-sm">Add, edit, or remove dishes</p>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-gray-900/60 backdrop-blur border border-gray-800/50 rounded-2xl p-5 hover:border-primary/30 hover:bg-gray-900/80 transition-all group flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <ShoppingBag size={24} className="text-primary" />
          </div>

          <div>
            <h3 className="text-white font-semibold">Manage Orders</h3>

            <p className="text-gray-400 text-sm">
              View and update order statuses
            </p>
          </div>
        </Link>
      </div>

      {/* â”€â”€ Recent Orders â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="bg-gray-900/60 backdrop-blur border border-gray-800/50 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50">
          <h2 className="text-white font-semibold text-lg">Recent Orders</h2>

          <Link
            to="/admin/orders"
            className="text-sm text-primary hover:text-primary-light font-medium"
          >
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-50" />

            <p>No orders yet</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800/30">
                    <th className="text-left px-6 py-3 font-medium">
                      Order ID
                    </th>

                    <th className="text-left px-6 py-3 font-medium">Date</th>

                    <th className="text-left px-6 py-3 font-medium">Items</th>

                    <th className="text-left px-6 py-3 font-medium">Total</th>

                    <th className="text-left px-6 py-3 font-medium">Status</th>

                    <th className="text-right px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800/30">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {formatOrderId(order.id)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDateTime(order.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-400">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {formatPrice(order.total)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-primary hover:text-primary-light text-sm font-medium inline-flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-4 p-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-950/20 border border-gray-800/60 rounded-2xl p-4 flex flex-col gap-3 hover:border-gray-700/40 transition-colors"
                >
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

                  <div className="text-xs space-y-2 text-gray-400 border-t border-b border-gray-800 py-3 my-1">
                    <div className="flex justify-between">
                      <span>Date &amp; Time:</span>

                      <span className="text-white font-medium">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Items:</span>

                      <span className="text-white font-medium">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                        Total
                      </span>

                      <span className="text-sm font-bold text-white">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="py-2 px-3.5 bg-gray-950/40 hover:bg-primary/10 border border-gray-800/80 hover:border-primary/30 rounded-xl text-gray-300 hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                    >
                      <Eye size={14} />
                      View
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
