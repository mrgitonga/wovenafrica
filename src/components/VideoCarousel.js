import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { PlayCircle } from 'lucide-react'; // An icon for our interaction button

const VideoCarousel = ({ youtubeIds }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // This state is the master control: -1 means all are in "browsing" mode.
  // A number (e.g., 0, 1, 2) means that specific slide is in "viewing" mode.
  const [interactiveIndex, setInteractiveIndex] = useState(-1);

  const playerRefs = useRef({});

  // This function runs once when the component mounts to set up the YouTube API
  const initializePlayers = useCallback(() => {
    youtubeIds.forEach((id, index) => {
      if (!playerRefs.current[index]) {
        playerRefs.current[index] = new window.YT.Player(`youtube-iframe-${index}`, {
          videoId: id,
          playerVars: {
            autoplay: index === 0 ? 1 : 0, // Autoplay first video muted
            mute: 1,
            controls: 1,
            loop: 1,
            playlist: id,
          },
        });
      }
    });
  }, [youtubeIds]);

  useEffect(() => {
    const onApiReady = () => window.YT && window.YT.Player && initializePlayers();
    if (window.YT && window.YT.Player) {
      onApiReady();
    } else {
      window.onYouTubeIframeAPIReady = onApiReady;
    }
  }, [initializePlayers]);
  
  // This runs when the user lands on a new slide
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);

    Object.keys(playerRefs.current).forEach(key => {
      const player = playerRefs.current[key];
      if (player && typeof player.playVideo === 'function') {
        if (parseInt(key, 10) === newIndex) {
          player.mute();
          player.playVideo();
        } else {
          player.stopVideo();
        }
      }
    });
  }, [emblaApi]);

  // This runs the moment a swipe *starts*
  const onScroll = useCallback(() => {
    // If we are in "viewing" mode, reset back to "browsing" mode
    if (interactiveIndex !== -1) {
      setInteractiveIndex(-1);
    }
  }, [interactiveIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll); // Add the scroll listener
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', onScroll);
    };
  }, [emblaApi, onSelect, onScroll]);
  
  const totalSlides = youtubeIds.length;

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {youtubeIds.map((id, index) => {
            const isInteractive = index === interactiveIndex;
            return (
              <div className="embla__slide" key={index}>
                <div className="video-container">
                  {/* The placeholder div that the API will replace */}
                  <div id={`youtube-iframe-${index}`} className={!isInteractive ? 'is-swipeable' : ''} />
                  
                  {/* The interaction overlay is only shown in browsing mode */}
                  {!isInteractive && (
                    <div 
                      className="interaction-overlay" 
                      onClick={() => {
                        const player = playerRefs.current[index];
                        if (player) {
                          setInteractiveIndex(index);
                          player.unMute();
                          player.playVideo();
                        }
                      }}
                    >
                      <PlayCircle size={60} className="play-icon" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="embla__dots">
        {totalSlides <= 3 ? (
          youtubeIds.map((_, index) => (
            <div key={index} className={`embla__dot ${index === selectedIndex ? 'is-selected' : ''}`} />
          ))
        ) : (
          <>
            <div className={`embla__dot ${selectedIndex === 0 ? 'is-selected' : ''}`} />
            <div className={`embla__dot ${selectedIndex > 0 && selectedIndex < totalSlides - 1 ? 'is-selected' : ''}`} />
            <div className={`embla__dot ${selectedIndex === totalSlides - 1 ? 'is-selected' : ''}`} />
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCarousel;