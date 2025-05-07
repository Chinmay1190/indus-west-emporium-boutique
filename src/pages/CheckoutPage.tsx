
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    upiId: "",
  });
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Calculate order summary
  const subtotal = cartTotal;
  const shipping = cartTotal > 5000 ? 0 : 99;
  const taxes = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + taxes;
  
  // Validate shipping form
  const validateShippingForm = () => {
    const errors: Record<string, string> = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];
    
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = "This field is required";
      }
    });
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = "Please enter a valid 6-digit pincode";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate payment form
  const validatePaymentForm = () => {
    const errors: Record<string, string> = {};
    
    if (paymentMethod === "card") {
      if (!formData.cardNumber) {
        errors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        errors.cardNumber = "Please enter a valid 16-digit card number";
      }
      
      if (!formData.cardName) {
        errors.cardName = "Name on card is required";
      }
      
      if (!formData.cardExpiry) {
        errors.cardExpiry = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        errors.cardExpiry = "Please use MM/YY format";
      }
      
      if (!formData.cardCvv) {
        errors.cardCvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(formData.cardCvv)) {
        errors.cardCvv = "Invalid CVV";
      }
    } else if (paymentMethod === "upi") {
      if (!formData.upiId) {
        errors.upiId = "UPI ID is required";
      } else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(formData.upiId)) {
        errors.upiId = "Please enter a valid UPI ID";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle shipping form submission
  const handleShippingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateShippingForm()) {
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validatePaymentForm()) {
      setIsProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setStep("confirmation");
        clearCart(); // Clear cart after successful payment
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 2000);
    }
  };
  
  // Render shipping form
  const renderShippingForm = () => {
    return (
      <form onSubmit={handleShippingSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              className={formErrors.firstName ? "border-destructive" : ""}
            />
            {formErrors.firstName && (
              <p className="text-xs text-destructive">{formErrors.firstName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
              className={formErrors.lastName ? "border-destructive" : ""}
            />
            {formErrors.lastName && (
              <p className="text-xs text-destructive">{formErrors.lastName}</p>
            )}
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
              className={formErrors.email ? "border-destructive" : ""}
            />
            {formErrors.email && (
              <p className="text-xs text-destructive">{formErrors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="9876543210"
              className={formErrors.phone ? "border-destructive" : ""}
            />
            {formErrors.phone && (
              <p className="text-xs text-destructive">{formErrors.phone}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="123 Main St, Apartment 4"
            className={formErrors.address ? "border-destructive" : ""}
          />
          {formErrors.address && (
            <p className="text-xs text-destructive">{formErrors.address}</p>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Mumbai"
              className={formErrors.city ? "border-destructive" : ""}
            />
            {formErrors.city && (
              <p className="text-xs text-destructive">{formErrors.city}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={formData.state}
              onValueChange={(value) => 
                setFormData((prev) => ({ ...prev, state: value }))
              }
            >
              <SelectTrigger id="state" className={formErrors.state ? "border-destructive" : ""}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Gujarat">Gujarat</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                <SelectItem value="Telangana">Telangana</SelectItem>
                <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                <SelectItem value="West Bengal">West Bengal</SelectItem>
                {/* Add more states as needed */}
              </SelectContent>
            </Select>
            {formErrors.state && (
              <p className="text-xs text-destructive">{formErrors.state}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              placeholder="400001"
              className={formErrors.pincode ? "border-destructive" : ""}
            />
            {formErrors.pincode && (
              <p className="text-xs text-destructive">{formErrors.pincode}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Continue to Payment
          </Button>
        </div>
      </form>
    );
  };
  
  // Render payment form
  const renderPaymentForm = () => {
    return (
      <form onSubmit={handlePaymentSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-2">
          <Label>Select Payment Method</Label>
          <div className="grid gap-4 pt-2 sm:grid-cols-3">
            <div
              className={`flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                paymentMethod === "card" ? "border-primary bg-muted/50" : ""
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <img
                src="https://assets.vercel.com/image/upload/v1558651997/pngs/card-visa.png"
                alt="Credit/Debit Card"
                className="h-8 object-contain"
              />
              <span className="mt-2 text-sm font-medium">Credit/Debit Card</span>
            </div>
            
            <div
              className={`flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                paymentMethod === "upi" ? "border-primary bg-muted/50" : ""
              }`}
              onClick={() => setPaymentMethod("upi")}
            >
              <img
                src="/placeholder.svg"
                alt="UPI"
                className="h-8 object-contain"
              />
              <span className="mt-2 text-sm font-medium">UPI Payment</span>
            </div>
            
            <div
              className={`flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                paymentMethod === "cod" ? "border-primary bg-muted/50" : ""
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <img
                src="/placeholder.svg"
                alt="Cash on Delivery"
                className="h-8 object-contain"
              />
              <span className="mt-2 text-sm font-medium">Cash on Delivery</span>
            </div>
          </div>
        </div>
        
        {/* Card Payment Form */}
        {paymentMethod === "card" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className={formErrors.cardNumber ? "border-destructive" : ""}
              />
              {formErrors.cardNumber && (
                <p className="text-xs text-destructive">{formErrors.cardNumber}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={formErrors.cardName ? "border-destructive" : ""}
              />
              {formErrors.cardName && (
                <p className="text-xs text-destructive">{formErrors.cardName}</p>
              )}
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Expiry Date (MM/YY)</Label>
                <Input
                  id="cardExpiry"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="05/25"
                  className={formErrors.cardExpiry ? "border-destructive" : ""}
                />
                {formErrors.cardExpiry && (
                  <p className="text-xs text-destructive">{formErrors.cardExpiry}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardCvv">CVV</Label>
                <Input
                  id="cardCvv"
                  name="cardCvv"
                  type="password"
                  value={formData.cardCvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength={4}
                  className={formErrors.cardCvv ? "border-destructive" : ""}
                />
                {formErrors.cardCvv && (
                  <p className="text-xs text-destructive">{formErrors.cardCvv}</p>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Your card information is encrypted and secure. We never store your CVV.
            </p>
          </div>
        )}
        
        {/* UPI Payment Form */}
        {paymentMethod === "upi" && (
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              name="upiId"
              value={formData.upiId}
              onChange={handleInputChange}
              placeholder="username@upi"
              className={formErrors.upiId ? "border-destructive" : ""}
            />
            {formErrors.upiId && (
              <p className="text-xs text-destructive">{formErrors.upiId}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Enter your UPI ID to make a payment using apps like Google Pay, PhonePe,
              Paytm, etc.
            </p>
          </div>
        )}
        
        {/* Cash on Delivery */}
        {paymentMethod === "cod" && (
          <div className="rounded-lg bg-muted/50 p-4">
            <p>
              Pay with cash at the time of delivery. Please note that a small verification
              call may be made before dispatch.
            </p>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => setStep("shipping")}>
            Back to Shipping
          </Button>
          <Button type="submit" size="lg" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </form>
    );
  };
  
  // Render order confirmation
  const renderConfirmation = () => {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Order Confirmed!</h2>
        <p className="mb-6 text-muted-foreground">
          Thank you for your purchase. Your order has been confirmed and will be shipped
          soon.
        </p>
        
        <div className="mb-8 w-full max-w-md rounded-lg border p-6">
          <h3 className="mb-4 font-medium">Order Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Order Number:</span>
              <span className="font-medium">#IW{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment Method:</span>
              <span className="font-medium">
                {paymentMethod === "card"
                  ? "Credit/Debit Card"
                  : paymentMethod === "upi"
                  ? "UPI Payment"
                  : "Cash on Delivery"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping Address:</span>
              <span className="text-right font-medium">
                {formData.address}, {formData.city}, {formData.state} - {formData.pincode}
              </span>
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/order-tracking")}>
            Track Order
          </Button>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  };
  
  // Check if cart is empty and redirect if needed
  if (cartItems.length === 0 && step !== "confirmation") {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-16 text-center">
            <h2 className="mb-2 text-xl font-medium">Your cart is empty</h2>
            <p className="mb-6 text-muted-foreground">
              Please add some products to your cart before checkout.
            </p>
            <Button onClick={() => navigate("/")}>Continue Shopping</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="mb-8 font-serif text-3xl font-bold">Checkout</h1>
        
        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            <div
              className={`flex flex-1 flex-col items-center ${
                step === "shipping" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === "shipping" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                1
              </div>
              <span className="mt-2 text-sm">Shipping</span>
            </div>
            <div className="my-4 flex flex-1 items-center">
              <div className={`h-0.5 w-full ${step !== "shipping" ? "bg-primary" : "bg-muted"}`}></div>
            </div>
            <div
              className={`flex flex-1 flex-col items-center ${
                step === "payment" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                2
              </div>
              <span className="mt-2 text-sm">Payment</span>
            </div>
            <div className="my-4 flex flex-1 items-center">
              <div className={`h-0.5 w-full ${step === "confirmation" ? "bg-primary" : "bg-muted"}`}></div>
            </div>
            <div
              className={`flex flex-1 flex-col items-center ${
                step === "confirmation" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                3
              </div>
              <span className="mt-2 text-sm">Confirmation</span>
            </div>
          </div>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form Content */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-card p-6">
              {step === "shipping" && renderShippingForm()}
              {step === "payment" && renderPaymentForm()}
              {step === "confirmation" && renderConfirmation()}
            </div>
          </div>
          
          {/* Order Summary */}
          {step !== "confirmation" && (
            <div>
              <div className="rounded-lg border bg-card">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
                  
                  {/* Product List */}
                  <div className="mb-4 max-h-64 overflow-y-auto space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-start space-x-3">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted/50">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.product.name}</h4>
                          <div className="mt-1 text-xs text-muted-foreground">
                            <span>Qty: {item.quantity}</span>
                            {item.color && <span> / {item.color}</span>}
                            {item.size && <span> / {item.size}</span>}
                          </div>
                          <div className="mt-1 text-sm font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
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
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes (18% GST)</span>
                      <span>{formatPrice(taxes)}</span>
                    </div>
                    
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
                </div>
              </div>
              
              {/* Payment Security */}
              <div className="mt-4 rounded-lg border bg-card p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Secure Checkout</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your payment information is securely processed and never stored. We use
                  industry-standard encryption to keep your data safe.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
