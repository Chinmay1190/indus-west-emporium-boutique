
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const SuccessPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // This effect could be used to update order status with API
    // or perform other actions upon successful payment
  }, []);

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        
        <h1 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
          Payment Successful!
        </h1>
        
        <p className="mb-8 max-w-md text-muted-foreground">
          Thank you for your purchase. Your order has been processed successfully and will
          be shipped soon. You'll receive a confirmation email with all the details.
        </p>
        
        <div className="mb-8 w-full max-w-md rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-medium">Order Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number:</span>
              <span>#IW{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-600 dark:text-green-400">Paid</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button variant="outline" onClick={() => navigate("/order-tracking")}>
            Track Your Order
          </Button>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessPage;
