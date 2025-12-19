import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Filter, ChevronDown, Grid3X3, LayoutGrid } from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  colors: string[];
}

const allProducts: Product[] = [
  {
    id: 1,
    name: "Tailored Wool Blazer",
    brand: "Modern Classics",
    price: 299,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop",
    category: "Outerwear",
    isNew: true,
    colors: ["#1a1a1a", "#4a4a4a", "#8b7355"],
  },
  {
    id: 2,
    name: "Silk Evening Dress",
    brand: "Elegance",
    price: 459,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop",
    category: "Dresses",
    colors: ["#2d2d2d", "#8b0000"],
  },
  {
    id: 3,
    name: "Premium Cotton Shirt",
    brand: "Essential",
    price: 129,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop",
    category: "Tops",
    isNew: true,
    colors: ["#ffffff", "#87ceeb", "#ffc0cb"],
  },
  {
    id: 4,
    name: "High-Waist Trousers",
    brand: "Modern Classics",
    price: 189,
    originalPrice: 249,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop",
    category: "Bottoms",
    colors: ["#1a1a1a", "#f5f5dc"],
  },
  {
    id: 5,
    name: "Cashmere Sweater",
    brand: "Luxe Knit",
    price: 349,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop",
    category: "Knitwear",
    colors: ["#d3d3d3", "#8b4513", "#000080"],
  },
  {
    id: 6,
    name: "Leather Midi Skirt",
    brand: "Edge",
    price: 279,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uf7a?w=600&auto=format&fit=crop",
    category: "Bottoms",
    isNew: true,
    colors: ["#1a1a1a", "#8b0000"],
  },
  {
    id: 7,
    name: "Linen Summer Dress",
    brand: "Coastal",
    price: 199,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop",
    category: "Dresses",
    colors: ["#ffffff", "#f0e68c"],
  },
  {
    id: 8,
    name: "Structured Coat",
    brand: "Modern Classics",
    price: 549,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&auto=format&fit=crop",
    category: "Outerwear",
    colors: ["#2f4f4f", "#1a1a1a"],
  },
  {
    id: 9,
    name: "Silk Blouse",
    brand: "Elegance",
    price: 189,
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&auto=format&fit=crop",
    category: "Tops",
    colors: ["#fffafa", "#e6e6fa"],
  },
];

const categories = ["All", "Dresses", "Tops", "Bottoms", "Outerwear", "Knitwear"];

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [gridView, setGridView] = useState<"small" | "large">("large");

  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

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
              Showing {filteredProducts.length} products
            </p>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 md:gap-8 ${
            gridView === "large" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"
          }`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted mb-4">
                  <img
                    src={product.image}
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
                    <button className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-md">
                      <ShoppingBag className="h-5 w-5 text-foreground" />
                    </button>
                  </div>

                  {/* Try On Button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button variant="gold" className="w-full">
                      Virtual Try-On
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                        New
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
                        Sale
                      </span>
                    )}
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
                      <span className="font-semibold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {product.colors.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center py-12">
            <Button variant="outline" size="lg">
              Load More Products
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ShopPage;
