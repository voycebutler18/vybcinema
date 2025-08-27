import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Browse = () => {
  console.log("Browse component rendering - simple version");
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground">
                Browse Content
              </h1>
              <p className="text-xl text-muted-foreground mt-4">
                This is a simplified Browse page to test for errors
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Browse;