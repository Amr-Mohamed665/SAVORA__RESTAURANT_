import {
  User,
  Mail,
  Shield,
  Calendar,
  Pencil,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatters";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <main className="min-h-screen bg-warm-50 px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-10 md:pb-14">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 md:mb-10">
          <span className="text-primary text-sm font-semibold uppercase tracking-[0.2em]">
            Account
          </span>

          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-warm-900 mt-2">
            My Profile
          </h1>

          <p className="text-warm-500 mt-3 text-sm sm:text-base">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <section className="bg-white rounded-3xl border border-warm-200 shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-warm-900 via-warm-900 to-warm-800 px-6 sm:px-10 py-8 md:py-10">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-white/10">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              {/* User Info */}
              <div className="text-center sm:text-left">
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white">
                  {user.name}
                </h2>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs font-semibold capitalize">
                    {user.role}
                  </span>

                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium">
                    <CheckCircle size={13} />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="px-6 sm:px-10 py-8 md:py-10">
            {/* Section Header */}
            <div className="flex items-center justify-between gap-4 mb-7">
              <div>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-warm-900">
                  Personal Information
                </h3>

                <p className="text-sm text-warm-500 mt-1">
                  Your account details
                </p>
              </div>

              {/* Edit Button */}
              <button
                type="button"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-warm-200 text-warm-700 hover:border-primary hover:text-primary hover:bg-warm-50 transition-all duration-200 text-sm font-medium"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>

            {/* Information Rows */}
            <div className="divide-y divide-warm-100 border border-warm-100 rounded-2xl overflow-hidden">
              {/* Full Name */}
              <div className="flex items-center gap-4 px-4 sm:px-6 py-5">
                <div className="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                  <User size={20} className="text-secondary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">
                    Full Name
                  </p>

                  <p className="text-base sm:text-lg font-medium text-warm-900 mt-1 truncate">
                    {user.name}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 px-4 sm:px-6 py-5">
                <div className="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-secondary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">
                    Email
                  </p>

                  <p className="text-base sm:text-lg font-medium text-warm-900 mt-1 break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-4 px-4 sm:px-6 py-5">
                <div className="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                  <Shield size={20} className="text-secondary" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">
                    Account Role
                  </p>

                  <p className="text-base sm:text-lg font-medium text-warm-900 mt-1 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              {/* Member Since */}
              {user.createdAt && (
                <div className="flex items-center gap-4 px-4 sm:px-6 py-5">
                  <div className="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-secondary" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Member Since
                    </p>

                    <p className="text-base sm:text-lg font-medium text-warm-900 mt-1">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Edit Button */}
            <button
              type="button"
              className="sm:hidden w-full mt-6 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-warm-200 text-warm-700 hover:border-primary hover:text-primary hover:bg-warm-50 transition-all duration-200 text-sm font-medium"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
