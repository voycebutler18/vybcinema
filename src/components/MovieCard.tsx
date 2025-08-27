import { Button } from "@/components/ui/button";
import { Play, Plus, Info } from "lucide-react";
import { useState } from "react";

interface MovieCardProps {
  title: string;
  year: string;
  runtime: string;
  rating: string;
  genre: string;
  imageUrl: string;
  isLarge?: boolean;
}

export const MovieCard = ({ 
  title, 
  year, 
  runtime, 
  rating, 
  genre, 
  imageUrl, 
  isLarge = false 
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer ${
        isLarge ? "h-96" : "h-64"
      } cinema-card`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-overlay opacity-60 group-hover:opacity-80 transition-opacity" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Movie Info */}
        <div className="space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className={`font-bold text-white ${isLarge ? "text-2xl" : "text-lg"}`}>
            {title}
          </h3>
          
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span>{year}</span>
            <span>•</span>
            <span>{runtime}</span>
            <span>•</span>
            <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
              {rating}
            </span>
          </div>
          
          <p className="text-sm text-gray-400">{genre}</p>
          
          {/* Action Buttons */}
          <div 
            className={`flex items-center gap-2 pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isHovered ? "animate-slide-up" : ""
            }`}
          >
            <Button size="sm" className="bg-white text-black hover:bg-gray-200 flex items-center gap-1">
              <Play className="h-4 w-4" />
              Play
            </Button>
            <Button size="sm" variant="ghost" className="text-white border-white/20 hover:bg-white/10">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white border-white/20 hover:bg-white/10">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Badge */}
      {Math.random() > 0.7 && (
        <div className="absolute top-3 left-3">
          <div className="bg-gradient-primary px-2 py-1 rounded text-xs font-bold text-white">
            PREMIUM
          </div>
        </div>
      )}
    </div>
  );
};