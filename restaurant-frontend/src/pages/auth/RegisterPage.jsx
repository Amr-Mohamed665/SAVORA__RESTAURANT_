import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import FormField from "../../components/common/molecules/FormField";
import Input from "../../components/common/atoms/Input";
import Button from "../../components/common/atoms/Button";

const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  // Return user to the page they originally wanted to access.
  // Example:
  // Cart -> Checkout -> Login/Register -> Checkout
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // If the user is already authenticated,
  // redirect them without navigating during render.
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    try {
      const user = await registerUser(
        data.name.trim(),
        data.email.trim(),
        data.password,
      );

      toast.success(`Welcome, ${user.name}! Your account has been created.`, {
        style: {
          borderRadius: "12px",
          background: "#1a1a1a",
          color: "#fff",
        },
      });

      // After successful registration:
      // return to the page the user originally wanted.
      navigate(from, { replace: true });
    } catch (err) {
      if (!err._toasted) {
        const message =
          err.response?.data?.message ||
          "Registration failed. Please try again.";

        toast.error(message);
      }
    }
  };

  // Prevent showing the register form for an already-authenticated user
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Welcome */}

      <div className="mb-8 text-center">
        <p className="mb-2 font-playfair text-lg italic text-secondary">
          Join Savora!
        </p>

        <h1 className="font-playfair text-3xl font-bold text-white sm:text-4xl">
          Create your account
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-white/50">
          Sign up to enjoy exclusive offers, track your orders
          <br className="hidden sm:block" />
          and much more.
        </p>
      </div>

      {/* Register Form */}

      <div className="rounded-2xl border border-white/10 bg-[#11100e]/80 p-5 shadow-2xl backdrop-blur-sm sm:p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            label="Full Name"
            htmlFor="name"
            error={errors.name?.message}
            theme="dark"
          >
            <Input
              id="name"
              type="text"
              theme="dark"
              hasError={!!errors.name}
              {...register("name")}
              placeholder="Enter your full name"
            />
          </FormField>

          {/* Email */}
          <FormField
            label="Email Address"
            htmlFor="email"
            error={errors.email?.message}
            theme="dark"
          >
            <Input
              id="email"
              type="email"
              theme="dark"
              hasError={!!errors.email}
              {...register("email")}
              placeholder="Enter your email"
            />
          </FormField>

          {/* Password */}
          <FormField
            label="Password"
            htmlFor="password"
            error={errors.password?.message}
            theme="dark"
          >
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                theme="dark"
                hasError={!!errors.password}
                {...register("password")}
                placeholder="At least 6 characters"
                className="pr-11"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent text-white/40 transition-colors hover:text-secondary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

          {/* Submit */}
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            loading={isSubmitting}
            fullWidth
            rounded={false}
            className="h-12 shadow-lg shadow-secondary/10"
          >
            Sign Up
          </Button>
        </form>

        {/* Login Link */}

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link
            to="/login"
            state={{
              from: location.state?.from,
            }}
            className="font-semibold text-secondary transition-colors hover:text-secondary/80"
          >
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
