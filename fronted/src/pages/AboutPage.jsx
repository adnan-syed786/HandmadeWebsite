import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const products = [
  {
    img: "/Images/bag1.jpg.jpg",
    icon: "👜",
    title: "Handcrafted Bags",
    text: "Beautiful jute, Bohemian and Banjara bags made with unique traditional designs."
  },
  {
    img: "/Images/cloth1.jpg",
    icon: "🧶",
    title: "Traditional Textiles",
    text: "Handcrafted textiles and ethnic clothing inspired by India's rich culture."
  },
  {
    img: "/Images/images1.jpg",
    icon: "🏺",
    title: "Jewelry & Décor",
    text: "Unique handcrafted jewelry and décor that add traditional charm to modern spaces."
  }
];

const values = [
  {
    icon: "🎨",
    title: "Authentic Craftsmanship",
    text: "Traditional techniques passed from one generation to another.",
    bg: "bg-blue-50"
  },
  {
    icon: "🌱",
    title: "Sustainable",
    text: "Encouraging handmade production and thoughtful use of materials.",
    bg: "bg-green-50"
  },
  {
    icon: "🤝",
    title: "Support Artisans",
    text: "Creating opportunities for talented local artisans and craftsmen.",
    bg: "bg-orange-50"
  }
];

const gallery = [
  "bag1.jpg.jpg",
  "bag2.jpg.jpg",
  "bag3.jpg.jpg",
  "cloth1.jpg",
  "images1.jpg",
  "images2.jpg",
  "images3.jpg",
  "images4.jpg"
];

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800">

      <Header />

      {/* HERO */}
      <section className="relative min-h-[420px] pt-28 pb-20 flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800">

        <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-24 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-40 -right-24" />

        <div className="relative max-w-4xl px-6">


          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5">
            About <span className="text-yellow-300">Oricon</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-50">
            Preserving India's rich artistic heritage through beautiful
            handmade crafts.
          </p>

          <p className="mt-4 text-blue-100">
            Traditional craftsmanship • Unique designs • Handmade with care
          </p>

        </div>
      </section>


      {/* STORY */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          <div className="relative">
            <img
              src="/Images/bag1.jpg.jpg"
              alt="Handmade Bag"
              className="w-full h-[420px] object-cover rounded-3xl shadow-2xl"
            />

            <img
              src="/Images/cloth1.jpg"
              alt="Handmade Textile"
              className="absolute -bottom-8 -right-5 w-40 h-40 object-cover rounded-2xl border-8 border-white shadow-xl hover:scale-105 transition"
            />

            <img
              src="/Images/bag3.jpg.jpg"
              alt="Traditional Bag"
              className="absolute -top-7 -left-5 w-32 h-32 object-cover rounded-2xl border-8 border-white shadow-xl hover:scale-105 transition"
            />
          </div>


          <div>

            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
              Our Story
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6">
              Crafting Stories,
              <span className="text-blue-600"> One Piece at a Time</span>
            </h2>

            <p className="text-gray-600 text-lg leading-8 mb-5">
              Oricon Handmade Handicrafts celebrates India's rich cultural
              heritage through beautiful handmade products created by talented
              artisans.
            </p>

            <p className="text-gray-600 text-lg leading-8 mb-8">
              Every product reflects creativity, tradition and the human touch
              behind handmade craftsmanship.
            </p>

            <div className="grid grid-cols-3 border-t pt-6">
              {[
                ["100%", "Handmade"],
                ["50+", "Unique Designs"],
                ["India", "Inspired"]
              ].map(([number, label]) => (
                <div key={label}>
                  <h3 className="text-3xl font-bold text-blue-600">
                    {number}
                  </h3>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* PRODUCTS */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">

          <SectionTitle
            small="What We Create"
            title="Explore Our Collection"
            text="Beautiful handmade products inspired by Indian traditions."
          />

          <div className="grid md:grid-cols-3 gap-8">

            {products.map((item) => (
              <div
                key={item.title}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >

                <div className="overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="p-7">
                  <div className="text-3xl mb-4">{item.icon}</div>

                  <h3 className="text-2xl font-bold mb-3">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 leading-7">
                    {item.text}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>


      {/* VALUES */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">

          <SectionTitle
            small="Our Mission"
            title="More Than Just Handicrafts"
            text="We celebrate craftsmanship, support artisans and promote handmade culture."
          />

          <div className="grid md:grid-cols-3 gap-8">

            {values.map((item) => (
              <div
                key={item.title}
                className={`${item.bg} p-8 rounded-3xl hover:-translate-y-2 transition duration-300`}
              >
                <div className="text-4xl mb-5">{item.icon}</div>

                <h3 className="text-2xl font-bold mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-7">
                  {item.text}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>


      {/* GALLERY */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">

          <SectionTitle
            small="Our Gallery"
            title="Made by Hands, Made with Heart"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {gallery.map((img) => (
              <div
                key={img}
                className="overflow-hidden rounded-2xl shadow-md group"
              >
                <img
                  src={`/Images/${img}`}
                  alt="Oricon Handicraft"
                  className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
            ))}

          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-20 px-6 text-center text-white bg-gradient-to-r from-blue-700 to-indigo-800">

        <h2 className="text-4xl md:text-5xl font-bold mb-5">
          Bring Handmade Beauty Into Your Life
        </h2>

        <p className="text-blue-100 text-lg mb-8">
          Discover unique handcrafted products inspired by Indian artistry.
        </p>

        <a
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:scale-105 transition shadow-xl"
        >
          Explore Our Shop →
        </a>

      </section>

      <Footer />
    </div>
  );
}


/* REUSABLE SECTION TITLE */
function SectionTitle({ small, title, text }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
        {small}
      </span>

      <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
        {title}
      </h2>

      {text && (
        <p className="text-gray-600 text-lg">
          {text}
        </p>
      )}
    </div>
  );
}