import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Play } from "lucide-react";

const Genre = () => {
  const { genreName } = useParams();
  const capitalizedGenre = genreName?.charAt(0).toUpperCase() + genreName?.slice(1).toLowerCase();

  // This will eventually come from your Supabase database
  const sampleMovies = [
    {
      id: 1,
      title: `${capitalizedGenre} Movie 1`,
      year: "2024",
      rating: "PG-13",
      duration: "2h 15m",
      description: `An exciting ${genreName?.toLowerCase()} film that will keep you on the edge of your seat.`
    },
    {
      id: 2,
      title: `${capitalizedGenre} Movie 2`, 
      year: "2024",
      rating: "R",
      duration: "1h 48m",
      description: `A compelling ${genreName?.toLowerCase()} story with amazing characters.`
    },
    {
      id: 3,
      title: `${capitalizedGenre} Series 1`,
      year: "2024", 
      rating: "TV-14",
      duration: "3 Seasons",
      description: `Binge-worthy ${genreName?.toLowerCase()} series with multiple seasons.`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl md:text-5xl font-bold text-cinema-gradient">
                  {capitalizedGenre}
                </h1>
                <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary-glow">
                  Coming Soon
                </div>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Discover the best {genreName?.toLowerCase()} movies and series, completely free with ads
              </p>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="py-6 border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="default" size="sm" className="rounded-full">
                  All
                </Button>
                <Button variant="secondary" size="sm" className="rounded-full">
                  Movies
                </Button>
                <Button variant="secondary" size="sm" className="rounded-full">
                  Series
                </Button>
                <Button variant="secondary" size="sm" className="rounded-full">
                  New Releases
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid - Coming Soon */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="cinema-card p-12 text-center">
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="text-6xl">🎬</div>
                <h2 className="text-3xl font-bold text-cinema-gradient">
                  {capitalizedGenre} Content Coming Soon
                </h2>
                <p className="text-lg text-muted-foreground">
                  We're curating an amazing collection of {genreName?.toLowerCase()} content. 
                  When creators upload content and select "{capitalizedGenre}" as the genre, 
                  it will automatically appear here.
                </p>
                
                {/* Preview of how content will look */}
                <div className="pt-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Preview: How Content Will Appear</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {sampleMovies.map((movie) => (
                      <div key={movie.id} className="cinema-card p-4 text-left">
                        <div className="aspect-video bg-secondary/50 rounded-lg mb-4 flex items-center justify-center">
                          <Play className="h-12 w-12 text-primary" />
                        </div>
                        <h4 className="font-bold text-foreground mb-2">{movie.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span>{movie.year}</span>
                          <span>•</span>
                          <span>{movie.rating}</span>
                          <span>•</span>
                          <span>{movie.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{movie.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="btn-hero">
                    Get Notified When {capitalizedGenre} Content Arrives
                  </Button>
                  <Link to="/browse">
                    <Button variant="secondary">
                      Browse All Genres
                    </Button>
                  </Link>
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

export default Genre;