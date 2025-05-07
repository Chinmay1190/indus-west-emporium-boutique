import { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "@/lib/types";
import { toast } from "sonner";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    
    // Update cart count and total
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setCartTotal(total);
  }, [cartItems]);

  // Add product to cart
  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    setCartItems((prevCartItems) => {
      // Check if the product is already in the cart with the same size/color
      const existingItemIndex = prevCartItems.findIndex(
        (item) => 
          item.product.id === product.id && 
          item.size === size && 
          item.color === color
      );

      // If product exists, update the quantity
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevCartItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success(`Updated quantity in cart`);
        return updatedItems;
      }

      // Otherwise add new item
      toast.success(`Added to cart`);
      return [
        ...prevCartItems,
        { product, quantity, size, color },
      ];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.product.id !== productId)
    );
    toast.success(`Removed from cart`);
  };

  // Update quantity of product in cart
  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
