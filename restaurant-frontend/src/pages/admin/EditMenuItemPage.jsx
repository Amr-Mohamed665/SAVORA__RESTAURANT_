import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import FormField from "../../components/common/molecules/FormField";
import Input from "../../components/common/atoms/Input";
import Select from "../../components/common/atoms/Select";
import Button from "../../components/common/atoms/Button";
import ImageUploader from "../../components/common/molecules/ImageUploader";
import { menuService } from "../../services/menuService";
import { setItemAvailability } from "../../utils/menuStorage";
import toast from "react-hot-toast";

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required and must be a non-empty string"),

  category: z.enum(["Main Course", "Appetizer", "Dessert", "Beverage"], {
    errorMap: () => ({
      message: "Please select a valid category",
    }),
  }),

  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({
        invalid_type_error: "Price is required and must be a number",
      })
      .positive("Price must be greater than 0"),
  ),

  description: z.string().optional().default(""),

  image: z.string().optional().default(""),

  videoUrl: z
    .string()
    .url("Must be a valid URL (YouTube, Vimeo, etc.)")
    .or(z.literal(""))
    .optional()
    .default(""),

  available: z.boolean().default(true),
});

export default function EditMenuItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(menuItemSchema),
  });

  // Get menu item
  const {
    data: item,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["menu", id],
    queryFn: () => menuService.getMenuItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Fill form when item is loaded
  useEffect(() => {
    if (!item) return;

    reset({
      name: item.name,
      category: item.category,
      price: String(item.price),
      description: item.description || "",
      image: item.image || "",
      videoUrl: item.videoUrl || "",
      available: item.available !== false,
    });
  }, [item, reset]);

  // Update menu item
  const updateMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        price: Number(data.price),
        image:
          data.image ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60",
      };

      return menuService.updateMenuItem(id, payload);
    },

    onSuccess: (_, data) => {
      setItemAvailability(id, data.available);

      queryClient.invalidateQueries({
        queryKey: ["menu"],
      });

      queryClient.invalidateQueries({
        queryKey: ["menu", id],
      });

      toast.success("Menu item updated successfully!", {
        style: {
          borderRadius: "12px",
          background: "#1a1a1a",
          color: "#fff",
        },
      });

      navigate("/admin/menu");
    },

    onError: (err) => {
      const message =
        err.response?.data?.message || "Failed to update menu item.";

      toast.error(message);
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load menu item details.");
      navigate("/admin/menu");
    }
  }, [isError, navigate]);

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/admin/menu"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Menu Management
      </Link>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-white mb-6">Edit Menu Item</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <FormField
            label="Dish Name"
            htmlFor="name"
            required
            error={errors.name?.message}
            theme="admin"
          >
            <Input
              id="name"
              type="text"
              theme="admin"
              hasError={!!errors.name}
              {...register("name")}
              placeholder="e.g. Grilled Seabass"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <FormField
              label="Category"
              htmlFor="category"
              required
              error={errors.category?.message}
              theme="admin"
            >
              <Select
                id="category"
                theme="admin"
                hasError={!!errors.category}
                {...register("category")}
              >
                <option value="Main Course">Main Course</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
              </Select>
            </FormField>

            {/* Price */}
            <FormField
              label="Price (EGP)"
              htmlFor="price"
              required
              error={errors.price?.message}
              theme="admin"
            >
              <Input
                id="price"
                type="number"
                step="any"
                theme="admin"
                hasError={!!errors.price}
                {...register("price")}
                placeholder="260"
              />
            </FormField>
          </div>

          {/* Description */}
          <FormField
            label="Description"
            htmlFor="description"
            error={errors.description?.message}
            theme="admin"
          >
            <textarea
              id="description"
              rows={3}
              {...register("description")}
              placeholder="Describe the dish, ingredients, preparation, etc."
              className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
            />
          </FormField>

          {/* Image */}
          <FormField
            label="Dish Image"
            htmlFor="image-uploader"
            error={errors.image?.message}
            theme="admin"
          >
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.image?.message}
                  disabled={updateMutation.isPending}
                />
              )}
            />
          </FormField>

          {/* Video URL */}
          <FormField
            label="Video URL"
            htmlFor="videoUrl"
            error={errors.videoUrl?.message}
            theme="admin"
          >
            <Input
              id="videoUrl"
              type="url"
              theme="admin"
              hasError={!!errors.videoUrl}
              {...register("videoUrl")}
              placeholder="https://youtube.com/watch?v=... or any video link"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Optional — YouTube, Vimeo, direct URL, etc.
            </p>
          </FormField>



          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800/50">
            <Link
              to="/admin/menu"
              className="px-5 py-2.5 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Cancel
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="md"
              rounded={false}
              loading={updateMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
