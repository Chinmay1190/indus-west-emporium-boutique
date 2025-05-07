
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { categories, getFeaturedProducts, getBestSellerProducts, getNewArrivals } from "@/lib/data";

const Index = () => {
  const featuredProducts = getFeaturedProducts();
  const bestSellerProducts = getBestSellerProducts();
  const newArrivals = getNewArrivals();
  
  const [heroIndex, setHeroIndex] = useState(0);
  const heroSlides = [
    {
      title: "Traditional Western Style",
      subtitle: "Authentic Heritage Designs",
      image: "/placeholder.svg",
      ctaText: "Shop Collection",
      ctaLink: "/category/outfits",
    },
    {
      title: "Premium Leather Boots",
      subtitle: "Handcrafted for Comfort & Style",
      image: "/placeholder.svg",
      ctaText: "Explore Boots",
      ctaLink: "/category/shoes/boots",
    },
    {
      title: "Luxury Timepieces",
      subtitle: "Watches Inspired by the West",
      image: "/placeholder.svg",
      ctaText: "View Watches",
      ctaLink: "/category/watches",
    },
  ];
  
  // Auto-advance hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              heroIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
              <h1 className="mb-2 font-serif text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mb-6 text-lg md:text-xl">{slide.subtitle}</p>
              <Link to={slide.ctaLink}>
                <Button size="lg" className="text-md">
                  {slide.ctaText}
                </Button>
              </Link>
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                heroIndex === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setHeroIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-serif text-3xl font-bold">Shop Categories</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-square bg-muted/50">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <h3 className="text-center font-serif text-xl font-bold text-white md:text-2xl">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="border-t bg-muted/30 py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold">Featured Products</h2>
            <Link to="/category/all" className="text-sm font-medium hover:underline">
              View All Products
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Best Sellers */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold">Best Sellers</h2>
            <Link to="/bestsellers" className="text-sm font-medium hover:underline">
              View All Best Sellers
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {bestSellerProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Promo Banner */}
      <section className="bg-primary text-primary-foreground">
        <div className="container flex flex-col items-center justify-between py-12 text-center md:py-16 lg:flex-row lg:text-left">
          <div className="mb-6 lg:mb-0 lg:mr-6">
            <h2 className="mb-2 font-serif text-2xl font-bold sm:text-3xl">
              Subscribe & Get 10% Off
            </h2>
            <p className="text-primary-foreground/80">
              Join our newsletter for exclusive offers and updates
            </p>
          </div>
          <div className="flex w-full max-w-md flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="mb-2 w-full rounded-md border-0 px-4 py-2 text-foreground sm:mb-0 sm:rounded-r-none"
            />
            <Button variant="secondary" className="sm:rounded-l-none">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold">New Arrivals</h2>
            <Link to="/new-arrivals" className="text-sm font-medium hover:underline">
              View All New Arrivals
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
