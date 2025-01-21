import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { preloadImages } from '@/utils/preloadManager';

const Hero = () => {
  const banners = [
    {
      image: 'banner.png',
      mobileImage: 'bannerMobile.png',
      title: 'Univers cadeau'
    },
    {
      image: 'banner2.png',
      mobileImage: 'banner2Mobile.png',
      title: 'Nouvelle collection'
    },
    {
      image: 'banner3.png',
      mobileImage: 'banner3Mobile.png',
      title: 'Le sur mesure'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const preloadBanners = async () => {
      try {
        // Preload both desktop and mobile images
        const allImages = [
          ...banners.map(banner => banner.image),
          ...banners.map(banner => banner.mobileImage)
        ];
        await preloadImages(allImages);
        console.log('All banner images preloaded successfully');
      } catch (error) {
        console.error('Error preloading banner images:', error);
      }
    };

    preloadBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Mobile Banner */}
        <motion.div
          key={`mobile-${currentIndex}`}
          className="absolute inset-0 bg-cover bg-center md:hidden"
          style={{
            backgroundImage: `url('${banners[currentIndex].mobileImage}')`,
            willChange: 'transform'
          }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 1.2,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
        >
          <img
            src={banners[currentIndex].mobileImage}
            alt={banners[currentIndex].title}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            style={{ display: 'none' }}
          />
        </motion.div>

        {/* Desktop Banner */}
        <motion.div
          key={`desktop-${currentIndex}`}
          className="absolute inset-0 bg-cover bg-center hidden md:block"
          style={{
            backgroundImage: `url('${banners[currentIndex].image}')`,
            willChange: 'transform'
          }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 1.2,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
        >
          <img
            src={banners[currentIndex].image}
            alt={banners[currentIndex].title}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            style={{ display: 'none' }}
          />
        </motion.div>
      </AnimatePresence>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        aria-label="Next banner"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;