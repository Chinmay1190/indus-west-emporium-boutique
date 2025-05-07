
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="mb-4 font-serif text-6xl font-bold">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Oops! The page you're looking for can't be found.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
