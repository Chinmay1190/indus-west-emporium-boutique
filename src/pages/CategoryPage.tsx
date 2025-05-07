
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { getProductsByCategory, categories } from "@/lib/data";
import { Product } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const CategoryPage = () => {
  const { categoryId, subcategoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 60000]); // in INR
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  // Get category info
  const category = categories.find((c) => c.id === categoryId);
  const subcategory = category?.subcategories?.find((s) => s.id === subcategoryId);
  
  // Get all available colors and sizes for filtering
  const allColors = Array.from(
    new Set(
      products
        .map((product) => product.colors || [])
        .flat()
    )
  );
  
  const allSizes = Array.from(
    new Set(
      products
        .map((product) => product.sizes || [])
        .flat()
    )
  );
  
  // Load products based on category and subcategory
  useEffect(() => {
    if (categoryId) {
      const productsData = getProductsByCategory(categoryId, subcategoryId);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    }
  }, [categoryId, subcategoryId]);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply price filter
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply color filter if any selected
    if (selectedColors.length > 0) {
      result = result.filter((product) =>
        product.colors?.some((color) => selectedColors.includes(color))
      );
    }
    
    // Apply size filter if any selected
    if (selectedSizes.length > 0) {
      result = result.filter((product) =>
        product.sizes?.some((size) => selectedSizes.includes(size))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      // Featured is default
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.bestSeller && !b.bestSeller) return -1;
          if (!a.bestSeller && b.bestSeller) return 1;
          if (a.new && !b.new) return -1;
          if (!a.new && b.new) return 1;
          return 0;
        });
    }
    
    setFilteredProducts(result);
  }, [products, sortBy, priceRange, selectedColors, selectedSizes]);
  
  // Handle color checkbox changes
  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };
  
  // Handle size checkbox changes
  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };
  
  // Format price label for the slider
  const formatPriceLabel = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold md:text-4xl">
            {subcategory ? subcategory.name : category?.name || "Products"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {filteredProducts.length} products
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filters</h3>
                <button 
                  className="text-sm text-muted-foreground hover:text-primary"
                  onClick={() => {
                    setSelectedColors([]);
                    setSelectedSizes([]);
                    setPriceRange([0, 60000]);
                  }}
                >
                  Clear all
                </button>
              </div>
              
              {/* Price Range Filter */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Price Range</h4>
                <div className="px-2 pt-2">
                  <Slider
                    defaultValue={[0, 60000]}
                    value={priceRange}
                    min={0}
                    max={60000}
                    step={1000}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatPriceLabel(priceRange[0])}</span>
                    <span>{formatPriceLabel(priceRange[1])}</span>
                  </div>
                </div>
              </div>
              
              {/* Color Filter */}
              {allColors.length > 0 && (
                <Accordion type="single" collapsible defaultValue="colors">
                  <AccordionItem value="colors">
                    <AccordionTrigger className="text-sm font-medium">
                      Colors
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {allColors.map((color) => (
                          <div key={color} className="flex items-center space-x-2">
                            <Checkbox
                              id={`color-${color}`}
                              checked={selectedColors.includes(color)}
                              onCheckedChange={() => handleColorChange(color)}
                            />
                            <Label
                              htmlFor={`color-${color}`}
                              className="text-sm cursor-pointer"
                            >
                              {color}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              
              {/* Size Filter */}
              {allSizes.length > 0 && (
                <Accordion type="single" collapsible defaultValue="sizes">
                  <AccordionItem value="sizes">
                    <AccordionTrigger className="text-sm font-medium">
                      Sizes
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {allSizes.map((size) => (
                          <div key={size} className="flex items-center space-x-2">
                            <Checkbox
                              id={`size-${size}`}
                              checked={selectedSizes.includes(size)}
                              onCheckedChange={() => handleSizeChange(size)}
                            />
                            <Label
                              htmlFor={`size-${size}`}
                              className="text-sm cursor-pointer"
                            >
                              {size}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Products */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted"></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <h3 className="mb-2 text-lg font-medium">No products found</h3>
                <p className="text-center text-muted-foreground">
                  Try changing your filters or check back later for new products.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
