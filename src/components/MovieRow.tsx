import { MovieCard } from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

interface MovieRowProps {
  title: string;
  movies: Array<{
    id: string;
    title: string;
    year: string;
    runtime: string;
    rating: string;
    genre: string;
    imageUrl: string;
  }>;
}

export const MovieRow = ({ title, movies }: MovieRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 320;
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth"
    });
    
    // Update scroll button states
    setTimeout(() => {
      if (scrollRef.current) {
        setCanScrollLeft(scrollRef.current.scrollLeft > 0);
        setCanScrollRight(
          scrollRef.current.scrollLeft < 
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        );
      }
    }, 300);
  };

  return (
    <div className="space-y-4 group">
      {/* Row Title */}
      <h2 className="text-2xl font-bold text-foreground px-4 md:px-8">
        {title}
      </h2>
      
      {/* Movie Scroll Container */}
      <div className="relative">
        {/* Scroll Buttons */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        
        {canScrollRight && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
        
        {/* Movies Grid */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            <div key={movie.id} className="flex-none w-72">
              <MovieCard
                title={movie.title}
                year={movie.year}
                runtime={movie.runtime}
                rating={movie.rating}
                genre={movie.genre}
                imageUrl={movie.imageUrl}
                isLarge={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};