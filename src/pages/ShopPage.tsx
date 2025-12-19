import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Filter, ChevronDown, Grid3X3, LayoutGrid, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = ["All", "Blazers", "Dresses", "Trousers", "Shirts", "Sweaters", "Jackets"];

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [gridView, setGridView] = useState<"small" | "large">("large");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  
  const { data: products, isLoading } = useProducts(selectedCategory);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate('/auth');
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart.mutate({
      productId: selectedProduct.id,
      size: selectedSize,
      color: selectedColor,
    });
    setSelectedProduct(null);
    setSelectedSize("");
    setSelectedColor("");
  };

  const handleTryOn = (productId: string) => {
    if (!user) {
      toast.error("Please sign in to use virtual try-on");
      navigate('/auth');
      return;
    }
    navigate(`/try-on?product=${productId}`);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 md:pt-28">
        {/* Header */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
              Shop Collection
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover pieces that fit perfectly. Every item comes with AI size recommendations.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-border">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
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
                  className={`p-2 rounded ${gridView === "large" ? "bg-secondary" : ""}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridView("small")}
                  className={`p-2 rounded ${gridView === "small" ? "bg-secondary" : ""}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Showing {products?.length || 0} products
            </p>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && (
            <div className={`grid gap-6 md:gap-8 ${
              gridView === "large" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"
            }`}>
              {products?.map((product) => (
                <div key={product.id} className="group relative">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted mb-4">
                    <img
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                    
                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-md">
                        <Heart className="h-5 w-5 text-foreground" />
                      </button>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-md"
                      >
                        <ShoppingBag className="h-5 w-5 text-foreground" />
                      </button>
                    </div>

                    {/* Try On Button */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Button 
                        variant="gold" 
                        className="w-full"
                        onClick={() => handleTryOn(product.id)}
                      >
                        Virtual Try-On
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-medium mb-2 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${Number(product.price).toFixed(0)}</span>
                      </div>
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1">
                          {product.colors.slice(0, 3).map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: color.toLowerCase() }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          <div className="text-center py-12">
            <Button variant="outline" size="lg">
              Load More Products
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add to Cart Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Cart</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <img 
                  src={selectedProduct.images?.[0]} 
                  alt={selectedProduct.name}
                  className="w-24 h-32 object-cover rounded-lg"
                />
                <div>
                  <p className="text-sm text-muted-foreground">{selectedProduct.brand}</p>
                  <h3 className="font-medium">{selectedProduct.name}</h3>
                  <p className="font-semibold mt-2">${Number(selectedProduct.price).toFixed(0)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes?.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Color</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedColor === color
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                variant="gold" 
                className="w-full" 
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
              >
                {addToCart.isPending ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
};

export default ShopPage;
