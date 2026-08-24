import { ShieldCheck, Eye, Lock, FileText } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: "1. Information We Collect",
      text: "We collect information you provide directly to us when ordering, creating an account, or communicating with us. This includes your name, email address, phone number, delivery address, and payment details.",
    },
    {
      icon: Lock,
      title: "2. How We Protect Your Data",
      text: "We implement a variety of security measures, including SSL encryption and secure database access, to maintain the safety of your personal information when you place an order or access your details.",
    },
    {
      icon: ShieldCheck,
      title: "3. Sharing Your Information",
      text: "We do not sell, trade, or otherwise transfer your personal information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or delivering food to you, as long as those parties agree to keep this information confidential.",
    },
    {
      icon: FileText,
      title: "4. Your Consent",
      text: "By using our site, you consent to our online privacy policy. If we decide to change our privacy policy, we will post those changes on this page.",
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
            Privacy Policy
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-5 rounded-full" />
          <p className="mt-4 text-warm-400 text-sm max-w-md mx-auto">
            Last updated: August 2026. Learn how we handle and protect your personal information.
          </p>
        </section>

        {/* Content Sections */}
        <section className="space-y-10">
          <div className="bg-gray-900/40 border border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-6">
            <p className="text-sm text-warm-300 leading-relaxed">
              At Savora Restaurant, we value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or order meals from us.
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
            If you have any questions regarding this privacy policy, you may contact us at{" "}
            <span className="text-primary font-medium">privacy@savora-restaurant.com</span>.
          </div>
        </section>
      </div>
    </main>
  );
}
