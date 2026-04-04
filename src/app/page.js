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
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

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
      {/* <DiscreteShipping></DiscreteShipping> */}
      <FAQ />
      <ProductMarquee />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
