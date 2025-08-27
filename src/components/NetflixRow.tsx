import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NetflixCard } from './NetflixCard';

interface NetflixRowProps {
  title: string;
  content: any[];
  contentType: string;
  onContentClick: (content: any) => void;
  onContentPlay: (content: any) => void;
}

export const NetflixRow: React.FC<NetflixRowProps> = ({
  title,
  content,
  contentType,
  onContentClick,
  onContentPlay
}) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  if (!content || content.length === 0) return null;

  return (
    <div className="relative group mb-12">
      {/* Row Title */}
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 px-8">
        {title}
      </h2>

      {/* Navigation Arrows */}
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="lg"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}

      {showRightArrow && (
        <Button
          variant="ghost"
          size="lg"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}

      {/* Content Grid */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 px-8 overflow-x-auto scrollbar-hide scroll-smooth"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {content.map((item, index) => (
          <NetflixCard
            key={item.id}
            content={item}
            contentType={contentType}
            index={index}
            onClick={() => onContentClick(item)}
            onPlay={() => onContentPlay(item)}
          />
        ))}
      </div>
    </div>
  );
};