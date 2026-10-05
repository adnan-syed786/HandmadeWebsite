import React from 'react';

// Import all the components
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import TrendingProducts from '../components/TrendingProducts';
import Services from '../components/Services';
import CraftStory from '../components/CraftStory';
import WhyChooseUs from '../components/WhyChooseUs';
import Reviews from '../components/Reviews';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

function HomePage() {
  return (
    // <> is a "fragment" to wrap all the components
    <>
      <Header />
      <Hero />
      <CategorySection />
      <TrendingProducts />
      <Services />
      <CraftStory />
      <WhyChooseUs />
      <Reviews />
      <Newsletter />
      <Footer />
    </>
  );
}

export default HomePage;