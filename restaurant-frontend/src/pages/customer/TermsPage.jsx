import { Scale, FileText, CreditCard, Truck, ShieldAlert, RefreshCw } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: Scale,
      title: "1. Acceptance of Terms",
      text: "By accessing Savora's website and services, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our platform.",
    },
    {
      icon: FileText,
      title: "2. Use of Service",
      text: "You are permitted to use our services for personal, non-commercial food ordering. You must not misuse, disrupt, or attempt unauthorized access to our web systems.",
    },
    {
      icon: CreditCard,
      title: "3. Orders & Payments",
      text: "All orders placed are subject to acceptance and availability. Prices are listed on the menu and payment must be made in full at the checkout stage via our secure payment partners.",
    },
    {
      icon: Truck,
      title: "4. Delivery & Pickup",
      text: "We strive to deliver your meals within the estimated timeframes; however, delays can happen due to traffic, weather, or unexpected high demand. Delivery coordinates must be accurate.",
    },
    {
      icon: ShieldAlert,
      title: "5. Limitation of Liability",
      text: "Savora Restaurant shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of, or inability to use, our services.",
    },
    {
      icon: RefreshCw,
      title: "6. Changes to Terms",
      text: "We reserve the right to update or modify these Terms and Conditions at any time without prior notice. The updated version will be effective immediately upon posting on this page.",
    },
  ];

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-72 h-72 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-[500px] right-0 w-80 h-80 bg-secondary/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
        {/* Page Title */}
        <section className="text-center mb-12 md:mb-16">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-secondary">
            Terms & Conditions
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-5 rounded-full" />
          <p className="mt-4 text-warm-400 text-sm max-w-md mx-auto">
            Last updated: August 2026. Please read our terms and conditions of service.
          </p>
        </section>

        {/* Content Sections */}
        <section className="space-y-10">
          <div className="bg-gray-900/40 border border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-6">
            <p className="text-sm text-warm-300 leading-relaxed">
              Welcome to Savora Restaurant. These Terms & Conditions govern your relationship with us and outline the guidelines for accessing our platform, ordering, and communicating with our team.
            </p>

            <div className="grid grid-cols-1 gap-8 pt-4">
              {sections.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-warm-900/45 text-primary rounded-xl flex items-center justify-center border border-gray-800/80">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                    <p className="text-xs sm:text-sm text-warm-400 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-center text-xs text-warm-500">
            If you have any questions regarding these Terms & Conditions, please contact our support at{" "}
            <span className="text-primary font-medium">support@savora-restaurant.com</span>.
          </div>
        </section>
      </div>
    </main>
  );
}
