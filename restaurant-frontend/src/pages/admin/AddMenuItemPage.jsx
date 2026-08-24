import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import FormField from "../../components/common/molecules/FormField";
import Input from "../../components/common/atoms/Input";
import Select from "../../components/common/atoms/Select";
import Button from "../../components/common/atoms/Button";
import ImageUploader from "../../components/common/molecules/ImageUploader";
import { menuService } from "../../services/menuService";
import { syncNewItems } from "../../utils/menuStorage";
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

export default function AddMenuItemPage() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(menuItemSchema),

    defaultValues: {
      name: "",
      category: "Main Course",
      price: "",
      description: "",
      image: "",
      videoUrl: "",
      available: true,
    },
  });

  //  TanStack Query - Create Menu Item

  const createMenuMutation = useMutation({
    mutationFn: (payload) => menuService.createMenuItem(payload),

    onSuccess: async () => {
      /*
       * Refresh/invalidate the menu query.
       *
       * Any page using:
       * queryKey: ["menu"]
       *
       * will know that its cached data is outdated.
       */
      await queryClient.invalidateQueries({
        queryKey: ["menu"],
      });

      /*
       * Keep the existing localStorage ordering logic.
       *
       * We intentionally don't remove this because your
       * existing menu ordering logic depends on it.
       */
      try {
        const updatedMenu = await menuService.getMenu();

        syncNewItems(updatedMenu);
      } catch (err) {
        console.error(
          "Menu item was created, but local menu order could not be synced:",
          err,
        );
      }

      toast.success("Menu item added successfully!", {
        style: {
          borderRadius: "12px",
          background: "#1a1a1a",
          color: "#fff",
        },
      });

      navigate("/admin/menu");
    },

    onError: (err) => {
      console.error("Failed to add menu item:", err);

      const message = err.response?.data?.message || "Failed to add menu item.";

      toast.error(message);
    },
  });

  //  Submit

  const onSubmit = (data) => {
    const payload = {
      ...data,

      price: Number(data.price),

      image:
        data.image ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60",

      videoUrl: data.videoUrl || "",
    };

    createMenuMutation.mutate(payload);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}

      <Link
        to="/admin/menu"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Menu Management
      </Link>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-white mb-6">Add New Dish</h2>

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

          {/* Category + Price */}
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

          {/* Image Upload */}
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
                  disabled={isSubmitting || createMenuMutation.isPending}
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
              loading={isSubmitting || createMenuMutation.isPending}
            >
              Add Dish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
