import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VirtualTryOn from "@/components/VirtualTryOn";

const TryOnPage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <VirtualTryOn />
      </div>
      <Footer />
    </main>
  );
};

export default TryOnPage;
