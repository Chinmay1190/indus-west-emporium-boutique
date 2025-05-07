
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProductById, formatPrice, getProductsByCategory } from "@/lib/data";
import { useCart } from "@/context/cart-context";
import { MinusIcon, PlusIcon, Heart, Share, BadgeIndianRupee } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Get product details
  const product = id ? getProductById(id) : undefined;
  
  // State for product options
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]
  );
  
  // Related products (same category)
  const relatedProducts = product
    ? getProductsByCategory(product.category)
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
    : [];
  
  // Handle quantity changes
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedSize, selectedColor);
    }
  };
  
  // If product not found
  if (!product) {
    return (
      <Layout>
        <div className="container flex min-h-[50vh] flex-col items-center justify-center py-12">
          <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            The product you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center text-sm">
            <li>
              <Button
                variant="link"
                className="p-0 text-muted-foreground"
                onClick={() => navigate("/")}
              >
                Home
              </Button>
            </li>
            <li className="mx-2 text-muted-foreground">/</li>
            <li>
              <Button
                variant="link"
                className="p-0 text-muted-foreground"
                onClick={() => navigate(`/category/${product.category}`)}
              >
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Button>
            </li>
            {product.subcategory && (
              <>
                <li className="mx-2 text-muted-foreground">/</li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 text-muted-foreground"
                    onClick={() =>
                      navigate(`/category/${product.category}/${product.subcategory}`)
                    }
                  >
                    {product.subcategory.charAt(0).toUpperCase() +
                      product.subcategory.slice(1)}
                  </Button>
                </li>
              </>
            )}
            <li className="mx-2 text-muted-foreground">/</li>
            <li className="truncate font-medium">{product.name}</li>
          </ol>
        </nav>
        
        {/* Product Details */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Images */}
          <div>
            <div className="mb-4 overflow-hidden rounded-lg bg-muted/50">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="cursor-pointer overflow-hidden rounded-md bg-muted/50"
                >
                  <img
                    src={product.image}
                    alt={`${product.name} view ${i}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {product.new && (
                  <Badge className="bg-accent text-accent-foreground">New</Badge>
                )}
                {product.bestSeller && (
                  <Badge className="bg-primary text-primary-foreground">Best Seller</Badge>
                )}
                {product.featured && (
                  <Badge variant="outline">Featured</Badge>
                )}
              </div>
              <h1 className="mt-2 font-serif text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 text-2xl font-bold">{formatPrice(product.price)}</div>
              <p className="mt-4 text-muted-foreground">{product.description}</p>
            </div>
            
            {/* Product Options */}
            <div className="space-y-6">
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Color: <span>{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`h-8 rounded-full border px-4 py-1 text-sm transition-colors hover:bg-muted ${
                          selectedColor === color
                            ? "border-primary bg-primary/10"
                            : "border-muted"
                        }`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Size: <span>{selectedSize}</span>
                  </label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Quantity Selector */}
              <div>
                <label className="mb-2 block text-sm font-medium">Quantity</label>
                <div className="flex w-full max-w-[140px] items-center rounded-md border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-r-none"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">{quantity}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-l-none"
                    onClick={increaseQuantity}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Add to Cart & Wishlist */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Heart className="h-5 w-5" />
                  <span className="hidden sm:inline">Add to Wishlist</span>
                </Button>
              </div>
              
              {/* Additional Info */}
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BadgeIndianRupee className="h-5 w-5" />
                  <span>Secure payment with all major credit cards and UPI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share className="h-5 w-5" />
                  <span>Share this product with friends</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details & Care</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-6">
              <div className="prose max-w-none dark:prose-invert">
                <p>{product.description}</p>
                <p>
                  Our {product.name} exemplifies the perfect blend of traditional Western
                  craftsmanship with modern comfort and durability. Each piece is
                  meticulously crafted to ensure authentic styling while meeting the
                  demands of today's lifestyle.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="py-6">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Material & Construction</h3>
                <p>
                  Made from premium materials selected for both authenticity and
                  durability. Our attention to detail ensures each product meets our
                  exacting quality standards.
                </p>
                <h3>Care Instructions</h3>
                <ul>
                  <li>Follow the specific care instructions on the product label</li>
                  <li>Store in a cool, dry place</li>
                  <li>
                    For leather products, use appropriate leather conditioner regularly
                  </li>
                  <li>Protect from prolonged exposure to direct sunlight</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="py-6">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Shipping Information</h3>
                <p>
                  We ship all across India using trusted courier partners. Standard
                  shipping takes 3-5 business days, while express shipping delivers in 1-2
                  business days.
                </p>
                <h3>Return Policy</h3>
                <p>
                  If you're not completely satisfied with your purchase, you can return it
                  within 30 days of delivery for a full refund or exchange. The product
                  must be unused and in its original packaging.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div className="mt-12">
          <h2 className="mb-6 font-serif text-2xl font-bold">You May Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
