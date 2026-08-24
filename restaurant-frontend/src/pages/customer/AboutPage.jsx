import { BookOpen, Handshake, ChefHat, Leaf } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: BookOpen,
      title: "Our Story",
      text: "Our restaurant started with a simple idea: bring people together through delicious food and a memorable dining experience.",
      text2:
        "From our first day until today, we have continued to grow while staying true to our passion for authentic flavors.",
    },
    {
      icon: Handshake,
      title: "Our Philosophy",
      text: "We believe that great food is more than just a meal. It is about the people, the atmosphere, and the moments shared around the table.",
      text2:
        "Every dish is prepared with care, passion, and attention to detail.",
    },
  ];

  const features = [
    {
      icon: Leaf,
      title: "Fresh Ingredients",
      description:
        "Fresh, carefully selected ingredients are at the heart of every dish we serve.",
    },
    {
      icon: ChefHat,
      title: "Expert Chefs",
      description:
        "Our talented chefs bring passion, creativity, and experience to every plate.",
    },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-72 h-72 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-[700px] right-0 w-80 h-80 bg-secondary/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-80 bg-primary/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
        {/* Page Title */}
        <section className="text-center mb-16 md:mb-20">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-secondary">
            About Savora
          </h1>

          <div className="w-20 h-1 bg-primary mx-auto mt-5 rounded-full" />
        </section>

        {/* Intro */}
        <section className="relative rounded-3xl border border-secondary/40 bg-gradient-to-br from-secondary/15 via-black/70 to-primary/10 p-7 sm:p-10 md:p-12 text-center shadow-[0_0_35px_rgba(255,170,0,0.12)]">
          <div className="absolute inset-0 rounded-3xl bg-secondary/5 blur-xl pointer-events-none" />

          <div className="relative">
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              More Than Just Food
            </h2>

            <p className="mt-6 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-warm-200 leading-8">
              Savora is more than just a restaurant. We are passionate about
              creating delicious food, unforgettable moments, and a warm
              atmosphere where everyone feels welcome.
            </p>

            <div className="flex justify-center items-center gap-6 mt-7 text-secondary">
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>
          </div>
        </section>

        {/* Story & Philosophy */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-8 mt-8">
          {values.map(({ icon: Icon, title, text, text2 }) => (
            <div
              key={title}
              className="group relative rounded-3xl border border-secondary/40 bg-gradient-to-br from-secondary/15 via-[#17130d] to-primary/10 p-7 sm:p-9 text-center shadow-[0_0_30px_rgba(255,170,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,170,0,0.2)]"
            >
              {/* Icon */}
              <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-secondary/10 border border-secondary/30">
                <Icon size={42} strokeWidth={1.5} className="text-secondary" />
              </div>

              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white mt-6">
                {title}
              </h2>

              <p className="mt-5 text-sm sm:text-base text-warm-200 leading-7">
                {text}
              </p>

              <p className="mt-4 text-sm sm:text-base text-warm-300 leading-7">
                {text2}
              </p>
            </div>
          ))}
        </section>

        {/* Features */}
        <section className="mt-24 md:mt-28">
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-secondary text-center">
            Fresh Ingredients & Expert Chefs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-8 mt-10">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="relative rounded-3xl border border-secondary/40 bg-gradient-to-br from-secondary/15 via-[#17130d] to-primary/10 p-7 sm:p-9 text-center shadow-[0_0_30px_rgba(255,170,0,0.12)]"
              >
                <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-secondary/10 border border-secondary/30">
                  <Icon
                    size={42}
                    strokeWidth={1.5}
                    className="text-secondary"
                  />
                </div>

                <h3 className="font-playfair text-2xl font-bold text-white mt-6">
                  {title}
                </h3>

                <p className="mt-4 text-sm sm:text-base text-warm-200 leading-7">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="mt-24 md:mt-28">
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-secondary text-center">
            Our Restaurant
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
            {gallery.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-full overflow-hidden border-4 border-secondary/60 shadow-[0_0_25px_rgba(255,170,0,0.25)]"
              >
                <img
                  src={image}
                  alt={`Savora restaurant ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-secondary/10" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
