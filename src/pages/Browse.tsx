import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

const Browse = () => {
  const genres = [
    "Action", "Drama", "Comedy", "Horror", "Sci-Fi", "Romance", 
    "Thriller", "Documentary", "Animation", "Fantasy"
  ];

  const contentTypes = ["All", "Movies", "Series", "Documentaries"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-cinema-gradient">
                Browse Content
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover amazing movies, series, and documentaries - all completely free with ads
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for movies, shows, documentaries..."
                    className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Coming Soon */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="flex flex-wrap gap-3">
                {contentTypes.map((type) => (
                  <Button
                    key={type}
                    variant={type === "All" ? "default" : "secondary"}
                    size="sm"
                    className="rounded-full"
                  >
                    {type}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="ghost" size="sm">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Genres */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Browse by Genre</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {genres.map((genre) => (
                  <div
                    key={genre}
                    className="cinema-card p-6 text-center cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  >
                    <div className="text-lg font-semibold text-foreground">
                      {genre}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Soon Message */}
            <div className="cinema-card p-12 text-center">
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="text-6xl">🎬</div>
                <h3 className="text-3xl font-bold text-cinema-gradient">
                  Content Library Coming Soon
                </h3>
                <p className="text-lg text-muted-foreground">
                  We're curating an amazing collection of movies, series, and documentaries. 
                  Our content library will be available soon with thousands of titles to explore.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="btn-hero">
                    Get Notified When We Launch
                  </Button>
                  <Button variant="secondary">
                    Learn More About VYB Cinema
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Browse;