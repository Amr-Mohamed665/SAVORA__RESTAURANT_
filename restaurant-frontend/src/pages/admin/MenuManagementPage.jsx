import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Star,
} from "lucide-react";

import { menuService } from "../../services/menuService";
import { formatPrice } from "../../utils/formatters";

import {
  isItemAvailable,
  setItemAvailability,
  applyMenuOrder,
  setMenuOrder,
  syncNewItems,
  removeItemFromStorage,
  getPopularIds,
  toggleItemPopular,
  MAX_POPULAR,
} from "../../utils/menuStorage";

import SearchBar from "../../components/common/molecules/SearchBar";
import ConfirmModal from "../../components/common/organisms/ConfirmModal";

import toast from "react-hot-toast";

//  Desktop Table Row

function MenuRow({
  item,
  index,
  isLast,
  isSearching,
  isPopular,
  onTogglePopular,
  handleToggleAvailability,
  setDeleteModal,
  handleMoveUp,
  handleMoveDown,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  draggedIndex,
}) {
  const isDragged = draggedIndex === index;

  return (
    <tr
      onDragOver={(e) => handleDragOver(e, index)}
      onDrop={(e) => handleDrop(e, index)}
      className={`border-b border-gray-800/30 transition-colors hover:bg-gray-800/30 ${
        isDragged ? "bg-primary/5 border-primary/30" : ""
      } ${!item.available ? "opacity-60" : ""}`}
    >
      {/* Popular */}
      <td className="px-6 py-4">
        <button
          type="button"
          onClick={() => onTogglePopular(item)}
          title={isPopular ? "Remove from Popular Dishes" : "Add to Popular Dishes"}
          className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer w-24 ${
            isPopular
              ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
              : "bg-gray-800/60 text-gray-500 hover:bg-gray-700/60 hover:text-gray-300"
          }`}
        >
          <Star size={12} fill={isPopular ? "currentColor" : "none"} />
          {isPopular ? "Popular" : "Add"}
        </button>
      </td>

      {/* Drag Handle */}
      <td className="px-6 py-4">
        <div className="flex items-center text-gray-500">
          {!isSearching ? (
            <div
              draggable={!isSearching}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing p-1 hover:text-primary transition-colors"
              title="Drag to reorder"
            >
              <GripVertical size={16} />
            </div>
          ) : (
            <span className="text-[10px] text-gray-600 select-none">-</span>
          )}
        </div>
      </td>

      {/* Dish */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-xl object-cover border border-gray-800"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=60";
            }}
          />

          <span className="text-sm font-medium text-white">{item.name}</span>
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4 text-sm text-gray-400">{item.category}</td>

      {/* Price */}
      <td className="px-6 py-4 text-sm font-semibold text-white">
        {formatPrice(item.price)}
      </td>

      {/* Availability */}
      <td className="px-6 py-4">
        <button
          type="button"
          onClick={() => handleToggleAvailability(item)}
          className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer w-32 ${
            item.available
              ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
              : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
          }`}
        >
          {item.available ? (
            <>
              <ToggleRight size={14} />
              Available
            </>
          ) : (
            <>
              <ToggleLeft size={14} />
              Unavailable
            </>
          )}
        </button>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/menu/edit/${item.id}`}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>

          <button
            type="button"
            onClick={() => setDeleteModal(item)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

//  Mobile Card

function MenuCard({
  item,
  index,
  isLast,
  isSearching,
  isPopular,
  onTogglePopular,
  handleToggleAvailability,
  setDeleteModal,
  handleMoveUp,
  handleMoveDown,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  draggedIndex,
}) {
  const isDragged = draggedIndex === index;

  return (
    <div
      className={`relative bg-gray-900 border border-gray-800/80 rounded-2xl overflow-hidden flex transition-colors hover:border-gray-700/50 ${
        isDragged ? "border-primary bg-primary/5" : ""
      } ${!item.available ? "opacity-65" : ""}`}
    >
      {/* Absolute Popular Star Button on Top-Left */}
      <button
        type="button"
        onClick={() => onTogglePopular(item)}
        title={isPopular ? "Remove from Popular Dishes" : "Add to Popular Dishes"}
        className={`absolute top-3 left-3 z-10 p-2 rounded-full border transition-all cursor-pointer shadow-md ${
          isPopular
            ? "bg-amber-500 border-amber-400 text-white"
            : "bg-gray-950/85 border-gray-800 text-gray-400 hover:text-white"
        }`}
      >
        <Star size={18} fill={isPopular ? "currentColor" : "none"} />
      </button>

      {/* Main content */}
      <div className="flex-1 p-4 pl-16 flex flex-col gap-3 min-w-0">
        {/* Top Header */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-14 h-14 rounded-xl object-cover border border-gray-800 shrink-0"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=60";
            }}
          />

          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white line-clamp-1">
              {item.name}
            </h4>

            <span className="text-xs text-gray-400 bg-gray-950/40 px-2 py-0.5 rounded-full border border-gray-800/40 mt-1 inline-block">
              {item.category}
            </span>
          </div>
        </div>

        {/* Price & Availability */}
        <div className="flex items-center justify-between border-t border-b border-gray-800 py-2.5">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
              Price
            </span>

            <span className="text-sm font-bold text-white">
              {formatPrice(item.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleToggleAvailability(item)}
            className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${
              item.available
                ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
            }`}
          >
            {item.available ? (
              <>
                <ToggleRight size={14} />
                Available
              </>
            ) : (
              <>
                <ToggleLeft size={14} />
                Unavailable
              </>
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/menu/edit/${item.id}`}
            className="flex-1 py-2 px-3 bg-gray-950/40 hover:bg-primary/10 border border-gray-800/80 hover:border-primary/30 rounded-xl text-gray-300 hover:text-primary transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
          >
            <Pencil size={14} />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => setDeleteModal(item)}
            className="flex-1 py-2 px-3 bg-gray-950/40 hover:bg-red-500/10 border border-gray-800/80 hover:border-red-500/30 rounded-xl text-gray-300 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      {/* Right column — arrows only */}
      {!isSearching && (
        <div className="flex flex-col items-center justify-center gap-1.5 px-3 text-gray-500 shrink-0">
          <button
            type="button"
            onClick={() => handleMoveUp(index)}
            disabled={index === 0}
            className="p-1 hover:text-primary disabled:opacity-25 transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Move up"
          >
            <ChevronUp size={20} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={() => handleMoveDown(index)}
            disabled={isLast}
            className="p-1 hover:text-primary disabled:opacity-25 transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Move down"
          >
            <ChevronDown size={20} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}

//  Main Page

export default function MenuManagementPage() {
  const queryClient = useQueryClient();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [popularIds, setPopularIdsState] = useState(() => getPopularIds());

  //  TanStack Query - Fetch Menu

  const {
    data: menuData = [],
    isLoading: menuLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: () => menuService.getMenu(),
    staleTime: 5 * 60 * 1000,
  });

  //  Sync TanStack Query Data With Existing Local Logic

  useEffect(() => {
    if (!menuData) return;

    syncNewItems(menuData);

    const ordered = applyMenuOrder(menuData).map((item) => ({
      ...item,
      available: isItemAvailable(item.id),
    }));

    setItems(ordered);
  }, [menuData]);

  //  Query Error

  useEffect(() => {
    if (!isError) return;

    console.error("Failed to fetch menu:", error);
    toast.error("Failed to load menu");
  }, [isError, error]);

  //  Search

  const isSearching = search.trim().length > 0;

  const filteredItems = isSearching
    ? items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  //  Toggle Availability

  const handleToggleAvailability = (item) => {
    const newAvailable = !item.available;

    setItemAvailability(item.id, newAvailable);

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              available: newAvailable,
            }
          : i,
      ),
    );

    toast.success(
      `${item.name} is now ${newAvailable ? "available" : "unavailable"}`,
    );
  };

  //  Toggle Popular

  const handleTogglePopular = (item) => {
    const result = toggleItemPopular(item.id);
    if (!result.ok && result.limitReached) {
      toast.error(`You can only feature up to ${MAX_POPULAR} popular dishes.`);
      return;
    }
    const next = getPopularIds();
    setPopularIdsState(next);
    const isNowPopular = next.includes(String(item.id));
    toast.success(
      isNowPopular
        ? `"${item.name}" added to Popular Dishes ⭐`
        : `"${item.name}" removed from Popular Dishes`,
    );
  };

  // ---------------------------------------------------------------------------
  //  Reorder helpers
  // ---------------------------------------------------------------------------

  /**
   * Commit a reordered array of items:
   *  1. Update local state immediately for instant feedback.
   *  2. Persist the new order to localStorage.
   *  3. Call the backend to persist the order server-side.
   */
  const commitReorder = async (reordered) => {
    setItems(reordered);
    const ids = reordered.map((i) => i.id);
    setMenuOrder(ids);

    try {
      await menuService.reorderMenu(ids);
    } catch (err) {
      console.error("Failed to save order:", err);
      toast.error("Could not save order — please try again.");
    }
  };

  // ---- Drag-and-drop handlers ----

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const fromIndex = draggedIndex;
    if (fromIndex === null || fromIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const reordered = [...items];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    setDraggedIndex(null);
    commitReorder(reordered);
    toast.success("Order updated!");
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // ---- Arrow button handlers ----

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const reordered = [...items];
    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
    commitReorder(reordered);
    toast.success("Order updated!");
  };

  const handleMoveDown = (index) => {
    if (index === items.length - 1) return;
    const reordered = [...items];
    [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
    commitReorder(reordered);
    toast.success("Order updated!");
  };

  // Shared props passed to both MenuRow and MenuCard
  const reorderProps = {
    isSearching,
    handleMoveUp,
    handleMoveDown,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedIndex,
  };

  //  Delete

  const handleDelete = async () => {
    if (!deleteModal) return;

    setDeleting(true);

    try {
      await menuService.deleteMenuItem(deleteModal.id);

      removeItemFromStorage(deleteModal.id);

      setItems((prev) => prev.filter((item) => item.id !== deleteModal.id));

      /*
       * React Query:
       * Mark the menu query as stale so the next query
       * gets the latest data from the backend.
       */
      await queryClient.invalidateQueries({
        queryKey: ["menu"],
      });

      toast.success(`${deleteModal.name} deleted successfully`);

      setDeleteModal(null);
    } catch (err) {
      console.error("Failed to delete item:", err);
      toast.error("Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  //  Render

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Menu Management</h1>

          <p className="text-white text-sm mt-1">{items.length} items total</p>
        </div>

        <Link
          to="/admin/menu/add"
          className="btn-primary inline-flex items-center gap-2 text-sm w-full sm:w-auto"
        >
          <Plus size={18} />
          Add New Dish
        </Link>
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
        placeholder="Search menu items..."
        theme="dark"
        className="max-w-md"
      />

      {/* Help & Hints Panel */}
      <div className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-4 space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Guide</h3>
        <ul className="text-xs text-gray-500 space-y-1.5 list-disc pl-4">
          {!isSearching && items.length > 1 && (
            <li>
              <span className="text-gray-300 font-medium">Reordering:</span> Drag the grip handles (<GripVertical size={10} className="inline text-gray-600 align-middle -mt-0.5" />) or use the card arrows to customize the display order (saved automatically).
            </li>
          )}
          <li>
            <span className="text-gray-300 font-medium">Popular Star ⭐:</span> Feature dishes on the customer home page. Active items will automatically sync to popular dishes (max {MAX_POPULAR}).
          </li>
          <li>
            <span className="text-gray-300 font-medium">Availability Status:</span> Toggle status between <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] font-medium">Available</span> and <span className="text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded text-[10px] font-medium">Unavailable</span> to instantly show or hide the dish on the customer menus.
          </li>
        </ul>
      </div>

      {isSearching && (
        <p className="text-xs text-amber-500/80">
          Reordering is disabled while searching. Clear the search to reorder items.
        </p>
      )}

      {/* Content */}

      <div>
        {menuLoading ? (
          <div className="p-8 space-y-4 bg-gray-900/60 border border-gray-800/50 rounded-2xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-800/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-900/60 border border-gray-800/50 rounded-2xl">
            <p className="mb-2">No menu items found</p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-primary text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* DESKTOP */}

            <div className="hidden md:block">
              <div className="bg-gray-900/60 backdrop-blur border border-gray-800/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800/30">
                        <th className="text-left px-6 py-3 font-medium w-32">
                          Popular
                        </th>

                        <th className="text-left px-6 py-3 font-medium w-20">
                          Order
                        </th>

                        <th className="text-left px-6 py-3 font-medium">
                          Dish
                        </th>

                        <th className="text-left px-6 py-3 font-medium">
                          Category
                        </th>

                        <th className="text-left px-6 py-3 font-medium">
                          Price
                        </th>

                        <th className="text-left px-6 py-3 font-medium w-40">
                          Status
                        </th>

                        <th className="text-right px-6 py-3 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-800/30">
                      {filteredItems.map((item, index) => (
                        <MenuRow
                          key={item.id}
                          item={item}
                          index={index}
                          isLast={index === filteredItems.length - 1}
                          isPopular={popularIds.includes(String(item.id))}
                          onTogglePopular={handleTogglePopular}
                          handleToggleAvailability={handleToggleAvailability}
                          setDeleteModal={setDeleteModal}
                          {...reorderProps}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* MOBILE */}

            <div className="md:hidden">
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    index={index}
                    isLast={index === filteredItems.length - 1}
                    isPopular={popularIds.includes(String(item.id))}
                    onTogglePopular={handleTogglePopular}
                    handleToggleAvailability={handleToggleAvailability}
                    setDeleteModal={setDeleteModal}
                    {...reorderProps}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        confirmVariant="danger"
        loading={deleting}
        icon={
          <div className="w-14 h-14 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-400" />
          </div>
        }
      >
        Are you sure you want to delete{" "}
        <strong className="text-white">{deleteModal?.name}</strong>? This
        action cannot be undone.
      </ConfirmModal>
    </div>
  );
}
