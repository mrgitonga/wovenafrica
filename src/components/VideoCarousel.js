import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const VideoSlide = ({ videoId, isMuted, onUnmute }) => {
  const getYouTubeUrl = (id) => {
    const params = new URLSearchParams({
      autoplay: '1',
      loop: '1',
      controls: '1', // We can show controls, but they won't be clickable
      playlist: id,
    });
    if (isMuted) {
      params.append('mute', '1');
    }
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  };

  return (
    <div className="embla__slide">
      <div className="video-container">
        {isMuted && (
          <div className="unmute-overlay" onClick={onUnmute}>
            <div className="unmute-text">Click to Unmute</div>
          </div>
        )}
        <iframe
          // The key is to force a re-render when the mute state changes
          key={isMuted ? `muted-${videoId}` : `unmuted-${videoId}`}
          src={getYouTubeUrl(videoId)}
          title={`YouTube video player ${videoId}`}
          frameBorder="0"
          className="video-iframe" // A new class to target the iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

const VideoCarousel = ({ youtubeIds }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [isMuted, setIsMuted] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  const handleUnmute = () => {
    setIsMuted(false);
  };

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {youtubeIds.map((id, index) => (
            <VideoSlide
              key={`${id}-${index}`}
              videoId={id}
              isMuted={isMuted}
              onUnmute={handleUnmute}
            />
          ))}
        </div>
      </div>

      <div className="embla__dots">
        {scrollSnaps.map((_, index) => (
          <div 
            key={index} 
            className={`embla__dot ${index === selectedIndex ? 'is-selected' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;