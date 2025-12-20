import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, Grid3X3, LayoutGrid, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const categories = ["All", "Blazers", "Dresses", "Trousers", "Shirts", "Sweaters", "Jackets"];

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [gridView, setGridView] = useState<"small" | "large">("large");
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  
  const { data: products, isLoading } = useProducts(selectedCategory);
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 md:pt-28">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
              Shop Collection
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover pieces that fit perfectly. Every item comes with AI size recommendations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-border">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="flex items-center gap-2 border-l border-border pl-4">
                <button
                  onClick={() => setGridView("large")}
                  className={`p-2 rounded-lg transition-colors ${gridView === "large" ? "bg-secondary" : "hover:bg-muted"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridView("small")}
                  className={`p-2 rounded-lg transition-colors ${gridView === "small" ? "bg-secondary" : "hover:bg-muted"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Showing {products?.length || 0} products
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          )}

          {!isLoading && (
            <div className={`grid gap-6 md:gap-8 ${
              gridView === "large" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"
            }`}>
              {products?.map((product) => (
                <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer">
                  <ProductCard 
                    product={product}
                    onQuickView={(p) => { setQuickViewProduct(p); }}
                    onAddToCart={(p) => { setQuickViewProduct(p); }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="text-center py-12">
            <Button variant="outline" size="lg">
              Load More Products
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <ProductQuickView 
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />

      <Footer />
    </main>
  );
};

export default ShopPage;
