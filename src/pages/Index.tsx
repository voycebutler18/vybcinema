import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

// Import movie posters
import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie4 from "@/assets/movie-4.jpg";
import movie5 from "@/assets/movie-5.jpg";
import movie6 from "@/assets/movie-6.jpg";

const Index = () => {
  // Sample movie data
  const trendingMovies = [
    {
      id: "1",
      title: "Neon Nights",
      year: "2024",
      runtime: "2h 18m",
      rating: "PG-13",
      genre: "Sci-Fi Thriller",
      imageUrl: movie1,
    },
    {
      id: "2",
      title: "Golden Hour",
      year: "2024",
      runtime: "1h 54m",
      rating: "PG",
      genre: "Drama",
      imageUrl: movie2,
    },
    {
      id: "3",
      title: "Shadow Protocol",
      year: "2024",
      runtime: "2h 5m",
      rating: "R",
      genre: "Action Thriller",
      imageUrl: movie3,
    },
    {
      id: "4",
      title: "The Haunting",
      year: "2024",
      runtime: "1h 48m",
      rating: "R",
      genre: "Horror",
      imageUrl: movie4,
    },
    {
      id: "5",
      title: "Love Actually",
      year: "2024",
      runtime: "1h 42m",
      rating: "PG-13",
      genre: "Romantic Comedy",
      imageUrl: movie5,
    },
    {
      id: "6",
      title: "Mystic Realms",
      year: "2024",
      runtime: "2h 32m",
      rating: "PG-13",
      genre: "Fantasy Adventure",
      imageUrl: movie6,
    },
  ];

  const newReleases = [
    {
      id: "7",
      title: "Midnight Chase",
      year: "2024",
      runtime: "1h 56m",
      rating: "R",
      genre: "Action",
      imageUrl: movie3,
    },
    {
      id: "8",
      title: "Digital Dreams",
      year: "2024",
      runtime: "2h 12m",
      rating: "PG-13",
      genre: "Sci-Fi",
      imageUrl: movie1,
    },
    {
      id: "9",
      title: "Heart Strings",
      year: "2024",
      runtime: "1h 38m",
      rating: "PG",
      genre: "Romance",
      imageUrl: movie5,
    },
    {
      id: "10",
      title: "Dark Whispers",
      year: "2024",
      runtime: "1h 51m",
      rating: "R",
      genre: "Horror",
      imageUrl: movie4,
    },
    {
      id: "11",
      title: "Sunset Boulevard",
      year: "2024",
      runtime: "2h 8m",
      rating: "PG-13",
      genre: "Drama",
      imageUrl: movie2,
    },
    {
      id: "12",
      title: "Quest for Magic",
      year: "2024",
      runtime: "2h 24m",
      rating: "PG",
      genre: "Fantasy",
      imageUrl: movie6,
    },
  ];

  const staffPicks = [
    {
      id: "13",
      title: "Crystal Kingdom",
      year: "2024",
      runtime: "2h 16m",
      rating: "PG",
      genre: "Fantasy",
      imageUrl: movie6,
    },
    {
      id: "14",
      title: "Urban Legend",
      year: "2024",
      runtime: "1h 47m",
      rating: "R",
      genre: "Thriller",
      imageUrl: movie3,
    },
    {
      id: "15",
      title: "Eternal Sunshine",
      year: "2024",
      runtime: "1h 59m",
      rating: "PG-13",
      genre: "Drama",
      imageUrl: movie2,
    },
    {
      id: "16",
      title: "Cyber Revolution",
      year: "2024",
      runtime: "2h 3m",
      rating: "PG-13",
      genre: "Sci-Fi",
      imageUrl: movie1,
    },
    {
      id: "17",
      title: "Summer Romance",
      year: "2024",
      runtime: "1h 44m",
      rating: "PG",
      genre: "Romance",
      imageUrl: movie5,
    },
    {
      id: "18",
      title: "Nightmare Hotel",
      year: "2024",
      runtime: "1h 52m",
      rating: "R",
      genre: "Horror",
      imageUrl: movie4,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <HeroSection />
        
        {/* Movie Rows */}
        <div className="space-y-12 py-8">
          <MovieRow title="Trending Now" movies={trendingMovies} />
          <MovieRow title="New Releases" movies={newReleases} />
          <MovieRow title="Staff Picks" movies={staffPicks} />
        </div>

        {/* Pricing Section */}
        <PricingSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;