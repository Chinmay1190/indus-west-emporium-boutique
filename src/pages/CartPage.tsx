
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/data";
import { Trash2 } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  
  // Apply coupon code
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      const discountAmount = cartTotal * 0.1;
      setDiscount(discountAmount);
      setCouponApplied(true);
    }
  };
  
  // Handle quantity change for cart items
  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity >= 1) {
      updateQuantity(productId, quantity);
    }
  };
  
  // Calculate order summary
  const subtotal = cartTotal;
  const shipping = cartTotal > 0 ? (cartTotal > 5000 ? 0 : 99) : 0;
  const total = subtotal + shipping - discount;

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="mb-8 font-serif text-3xl font-bold">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-16 text-center">
            <h2 className="mb-2 text-xl font-medium">Your cart is empty</h2>
            <p className="mb-6 text-muted-foreground">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button onClick={() => navigate("/")}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-card">
                <div className="p-6">
                  <div className="flex justify-between">
                    <h2 className="text-lg font-medium">
                      Cart Items ({cartItems.length})
                    </h2>
                    <Button
                      variant="ghost"
                      className="text-sm text-muted-foreground"
                      onClick={clearCart}
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="mt-6 divide-y">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="py-6 first:pt-0 last:pb-0">
                        <div className="flex flex-col gap-4 sm:flex-row">
                          {/* Product Image */}
                          <div className="aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted/50">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex flex-1 flex-col">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{item.product.name}</h3>
                              <p className="ml-4 font-medium">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                            </div>
                            
                            <p className="mt-1 text-sm text-muted-foreground">
                              {formatPrice(item.product.price)} each
                            </p>
                            
                            {/* Options (if any) */}
                            {(item.color || item.size) && (
                              <div className="mt-1 text-sm text-muted-foreground">
                                {item.color && <span>Color: {item.color}</span>}
                                {item.color && item.size && <span> / </span>}
                                {item.size && <span>Size: {item.size}</span>}
                              </div>
                            )}
                            
                            {/* Actions */}
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-r-none"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-none"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-muted-foreground hover:text-destructive"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Remove</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="rounded-lg border bg-card">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0
                          ? "Free"
                          : formatPrice(shipping)}
                      </span>
                    </div>
                    
                    {couponApplied && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount (10%)</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Including taxes & duties
                      </p>
                    </div>
                  </div>
                  
                  {/* Coupon Code */}
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium">
                      Coupon Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponApplied}
                        placeholder="Enter code"
                        className="w-full rounded-l-md border bg-background p-2 text-sm disabled:opacity-60"
                      />
                      <Button
                        className="rounded-l-none"
                        disabled={!couponCode || couponApplied}
                        onClick={handleApplyCoupon}
                      >
                        Apply
                      </Button>
                    </div>
                    {couponApplied && (
                      <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                        Coupon "WELCOME10" applied successfully!
                      </p>
                    )}
                    {!couponApplied && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Try "WELCOME10" for 10% off your order
                      </p>
                    )}
                  </div>
                  
                  {/* Checkout Button */}
                  <Button
                    className="mt-6 w-full"
                    size="lg"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  {/* Continue Shopping */}
                  <Button
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="mt-4 rounded-lg border bg-card p-4">
                <h3 className="text-sm font-medium">We Accept</h3>
                <div className="mt-2 flex items-center space-x-2">
                  <img
                    src="https://assets.vercel.com/image/upload/v1558651997/pngs/card-visa.png"
                    alt="Visa"
                    className="h-8"
                  />
                  <img
                    src="https://assets.vercel.com/image/upload/v1558651997/pngs/card-mastercard.png"
                    alt="Mastercard"
                    className="h-8"
                  />
                  <img
                    src="https://assets.vercel.com/image/upload/v1558651997/pngs/card-amex.png"
                    alt="American Express"
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
