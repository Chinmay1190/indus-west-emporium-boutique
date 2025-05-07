
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/cart-context";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { categories } from "@/lib/data";

export function Navbar() {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center">
        <Button 
          variant="ghost" 
          className="mr-2 px-0 sm:hidden" 
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        {/* Logo */}
        <Link to="/" className="mr-4 flex items-center space-x-2">
          <span className="font-serif text-xl font-bold">Indus West</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden sm:flex sm:flex-1">
          <NavigationMenu>
            <NavigationMenuList>
              {categories.map((category) => (
                <NavigationMenuItem key={category.id}>
                  {category.subcategories ? (
                    <>
                      <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                          <li className="row-span-3">
                            <Link
                              to={`/category/${category.id}`}
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                All {category.name}
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Shop our complete {category.name.toLowerCase()} collection
                              </p>
                            </Link>
                          </li>
                          {category.subcategories.map((subcategory) => (
                            <li key={subcategory.id}>
                              <Link
                                to={`/category/${category.id}/${subcategory.id}`}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {subcategory.name}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Browse our {subcategory.name.toLowerCase()} collection
                                </p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link to={`/category/${category.id}`} className="block px-3 py-2 text-sm font-medium">
                      {category.name}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Search, Account, Cart */}
        <div className="flex items-center space-x-1">
          {/* Search Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-1" 
            onClick={() => setSearchOpen(!searchOpen)}
          >
            {searchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span className="sr-only">Search</span>
          </Button>
          
          {/* Theme Switcher */}
          <ThemeSwitcher />
          
          {/* Account */}
          <Link to="/account">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
          
          {/* Cart */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-border py-3 animate-fade-in">
          <div className="container">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search for products..."
                className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="font-serif">Indus West</SheetTitle>
            <SheetDescription>Traditional Western Emporium</SheetDescription>
          </SheetHeader>
          <nav className="mt-8">
            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.id}`}
                    className="block text-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  
                  {category.subcategories && (
                    <ul className="mt-2 ml-4 space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.id}>
                          <Link
                            to={`/category/${category.id}/${subcategory.id}`}
                            className="block text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subcategory.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
