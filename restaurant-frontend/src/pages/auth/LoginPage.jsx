import { useEffect, useState } from "react";
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

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);

      toast.success(`Welcome back, ${user.name}!`, {
        style: {
          borderRadius: "12px",
          background: "#1a1a1a",
          color: "#fff",
        },
      });

      if (user.role === "admin" && from === "/") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (!err._toasted) {
        const message =
          err.response?.data?.message || "Invalid email or password.";

        toast.error(message);
      }
    }
  };

  return (
    <>
      {/* Mobile Brand */}
      <div className="lg:hidden text-center mb-8">
        <Link to="/" className="inline-flex flex-col items-center">
          <span className="font-playfair text-2xl font-bold text-secondary tracking-tight">
            SAVORA
          </span>
          <span className="text-[9px] uppercase tracking-[0.28em] text-white/60 mt-1">
            Restaurant
          </span>
        </Link>
      </div>
      {/* Welcome */}
      <div className="text-center mb-8">
        <p className="font-playfair italic text-secondary text-lg mb-2">
          Welcome Back!
        </p>

        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
          Login to your account
        </h1>

        <p className="text-white/50 text-sm mt-3 leading-relaxed">
          Login to continue enjoying your favorite meals
          <br className="hidden sm:block" />
          and faster checkout.
        </p>
      </div>

      {/* Form */}

      <div className="bg-[#11100e]/80 border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                placeholder="Enter your password"
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-secondary transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            loading={isSubmitting}
            fullWidth
            rounded={false}
            className="h-12 shadow-lg shadow-secondary/10"
          >
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-white/50 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-secondary font-semibold hover:text-secondary/80 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
