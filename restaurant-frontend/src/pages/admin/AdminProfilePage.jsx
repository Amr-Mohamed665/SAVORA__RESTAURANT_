import { User, Mail, Shield, Calendar, CheckCircle } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatters";

export default function AdminProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <span className="text-secondary text-sm font-semibold uppercase tracking-[0.2em]">
          Account
        </span>

        <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-warm-100 mt-2">
          My Profile
        </h1>

        <p className="text-warm-500 mt-3 text-sm sm:text-base">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile */}
      <div className="relative overflow-hidden bg-gray-900 border border-gray-800 rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="h-20 w-20 rounded-full border-3 border-warm-700/70 bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/20 shrink-0">
              {initials}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {user.name}
                </h2>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold capitalize">
                  <CheckCircle size={13} />
                  {user.role}
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-2">
                Administrator Profile
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-800 my-8" />

          <div>
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-white">
                Account Information
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Your administrator account details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileInfo
                icon={User}
                label="Administrator Name"
                value={user.name}
              />

              <ProfileInfo
                icon={Mail}
                label="Email Address"
                value={user.email}
              />

              <ProfileInfo
                icon={Shield}
                label="Access Level"
                value={user.role}
                capitalize
              />

              {user.createdAt && (
                <ProfileInfo
                  icon={Calendar}
                  label="Account Created"
                  value={formatDate(user.createdAt)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileInfo({ icon: Icon, label, value, capitalize = false }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-950/70 border border-gray-800 hover:border-primary/30 transition-colors">
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-primary" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
          {label}
        </p>

        <p
          className={`text-white font-medium mt-1 truncate ${
            capitalize ? "capitalize" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
