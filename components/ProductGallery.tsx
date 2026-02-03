import React, { useState, useRef } from 'react';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle Thumbnail Click: IMPERATIVE scroll
  // We don't use useEffect for this to avoid fighting with the scroll event listener
  const scrollToImage = (index: number) => {
    setSelectedIndex(index);
    if (scrollRef.current) {
        const container = scrollRef.current;
        const width = container.offsetWidth;
        container.scrollTo({
            left: index * width,
            behavior: 'smooth'
        });
    }
  };

  // Handle User Scroll/Swipe: PASSIVE state update
  // Updates the badge count without trying to force scroll position back
  const handleScroll = () => {
    if (scrollRef.current) {
        const container = scrollRef.current;
        const width = container.offsetWidth;
        // Calculate index based on scroll position
        const newIndex = Math.round(container.scrollLeft / width);
        
        if (newIndex !== selectedIndex && newIndex >= 0 && newIndex < images.length) {
            setSelectedIndex(newIndex);
        }
    }
  };

  if (!images || images.length === 0) return null;

  return (
    // Added w-full and max-w-full to prevent horizontal overflow
    <div className="space-y-4 w-full max-w-full relative md:sticky md:top-24 z-0">
      
      {/* Main Image Slider */}
      <div className="w-full mx-auto aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden shadow-sm bg-gray-100 border border-gray-100 relative group">
        
        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          onScroll={handleScroll}
          style={{ 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch' // iOS momentum scrolling
          }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                <img 
                  src={img} 
                  alt={`${title} - Visualização ${idx + 1}`} 
                  className="w-full h-full object-cover"
                  draggable={false}
                />
            </div>
          ))}
        </div>

        {/* Counter Badge */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-10 pointer-events-none">
            {selectedIndex + 1} / {images.length}
        </div>

      </div>

      {/* Thumbnails Grid - Placed below main image */}
      {images.length > 1 && (
        <div className="w-full overflow-x-auto pb-2 flex gap-3 justify-center md:justify-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => scrollToImage(idx)}
              className={`
                relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200
                ${selectedIndex === idx 
                  ? 'border-rose-500 ring-2 ring-rose-100 ring-offset-1 opacity-100' 
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'}
              `}
            >
              <img 
                src={img} 
                alt={`Miniatura ${idx + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;