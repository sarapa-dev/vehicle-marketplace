import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListingPhoto } from "@/types/listings";

interface ImageGalleryProps {
  photos: ListingPhoto[];
  title: string;
}

export function ImageGallery({ photos, title }: ImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-muted flex aspect-4/3 items-center justify-center rounded-lg">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {photos.map((photo, index) => (
              <CarouselItem key={photo.listing_photo_id}>
                <Dialog>
                  <div className="relative aspect-4/3 overflow-hidden rounded-lg">
                    <img
                      src={photo.url}
                      alt={`${title} - Image ${index + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute top-4 left-4 rounded-md bg-black/70 px-3 py-1.5 text-sm font-medium text-white">
                      {index + 1}/{photos.length}
                    </div>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-4 bottom-4"
                        onClick={() => setFullscreenIndex(index)}
                      >
                        <Expand className="mr-2 size-4" />
                        Enlarge
                      </Button>
                    </DialogTrigger>
                  </div>
                  <DialogContent className="max-w-[95vw] border-none bg-black/95 p-0 sm:max-w-[90vw]">
                    <FullscreenGallery
                      photos={photos}
                      title={title}
                      initialIndex={fullscreenIndex}
                    />
                  </DialogContent>
                </Dialog>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={photo.listing_photo_id}
              onClick={() => scrollTo(index)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                current === index
                  ? "border-primary ring-primary/20 ring-2"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img
                src={photo.url}
                alt={`${title} - Thumbnail ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                sizes="80px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface FullscreenGalleryProps {
  photos: ListingPhoto[];
  title: string;
  initialIndex: number;
}

function FullscreenGallery({ photos, title, initialIndex }: FullscreenGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex h-[90vh] flex-col items-center justify-center">
      <div className="absolute top-4 left-4 z-10 rounded-md bg-black/70 px-3 py-1.5 text-sm font-medium text-white">
        {currentIndex + 1}/{photos.length}
      </div>

      <div className="relative h-full w-full">
        <img
          src={photos[currentIndex].url}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="absolute inset-0 h-full w-full object-contain"
          sizes="90vw"
          loading="eager"
        />
      </div>

      {photos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      <div className="absolute bottom-4 flex max-w-[90%] gap-2 overflow-x-auto rounded-lg bg-black/50 p-2">
        {photos.map((photo, index) => (
          <button
            key={photo.listing_photo_id}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all",
              currentIndex === index
                ? "border-white"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <img
              src={photo.url}
              alt={`${title} - Thumbnail ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              sizes="80px"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
