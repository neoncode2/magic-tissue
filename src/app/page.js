import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductShowcase from '@/components/ProductShowcase';
import Features from '@/components/Features';
import OfferSection from '@/components/OfferSection';
import Reviews from '@/components/Reviews';
import TrustBadges from '@/components/TrustBadges';
import OrderForm from '@/components/OrderForm';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import DiscreteShipping from '@/components/DiscreteShipping';
import ProductMarquee from '@/components/ProductMarquee';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <Hero />
      <div className="divider-glow" />
      
      <ProductShowcase />
      
      <Features />
      <div className="divider-glow" />
      
      <OfferSection />
      
      <Reviews />
      
      <TrustBadges />
      <div className="divider-glow" />
      
      <OrderForm />
      <DiscreteShipping></DiscreteShipping>
      <FAQ />
      <ProductMarquee />
      <Footer />

      {/* Sticky Mobile Button with Animation */}
      <a
        href="#order-form"
        className="cta-primary fixed inset-x-6 bottom-8 z-50 rounded-2xl py-4 text-center text-base font-black md:hidden uppercase tracking-widest shadow-[0_0_25px_rgba(229,9,20,0.5)] active:scale-95"
      >
        অর্ডার করুন এখনই
      </a>
    </main>
  );
}