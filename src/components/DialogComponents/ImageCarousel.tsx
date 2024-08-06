import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
interface Room {
  type: string;
  numberOfRooms: string;
  price: string;

  beds: {
    bedType: string;
    numberOfBeds: string;
  }[];

  amenities: { name: string }[];
  roomImageLinks: string[];
}

interface Hotel {
  name: string;
  primaryImageLink: string;
  imageLinks: string[];
  address: string;
  description: string;
  facilities: { name: string; subFacilities: { name: string }[] }[];
  rooms: Room[];
  houseRules: { type: string; details: string }[];
}
interface ImageCarouselProps {
  hotel: Hotel;
  isCarouselOpen: boolean;
  setIsCarouselOpen: (isOpen: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (index: number | ((prevIndex: number) => number)) => void;
}
// const ImageCarousel: React.FC<ImageCarouselProps> = ({ hotel }) => {
// export default function ImageCarousel({
//   hotel,
//   isCarouselOpen,
//   setIsCarouselOpen,
// }) {

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  hotel,
  isCarouselOpen,
  setIsCarouselOpen,
  currentIndex,
  setCurrentIndex,
}) => {
  //   const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  //   const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? (hotel.imageLinks.length || 0) - 1 : prevIndex - 1
    );
  };
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === hotel.imageLinks.length ? 0 : prevIndex + 1
    );
  };
  return (
    <Dialog open={isCarouselOpen} onOpenChange={setIsCarouselOpen}>
      <DialogOverlay className="bg-black bg-opacity-50" />
      <DialogContent className="flex items-center justify-center p-1 min-w-fit max-h-fit bg-transparent border-none">
        <div className=" w-full">
          <div className="flex overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out items-center
            "
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              <div className="flex-shrink-0 w-full">
                {hotel && (
                  <img
                    // src={staticimg3}
                    src={hotel.primaryImageLink}
                    alt="PrimaryImage"
                    className=""

                    // objectFit="cover"
                  />
                )}
              </div>
              {hotel && hotel.imageLinks && hotel.imageLinks.length > 0 && (
                <>
                  {hotel.imageLinks.map((image, imageIndex) => (
                    <div className="flex-shrink-0 w-full" key={imageIndex}>
                      <img
                        src={image}
                        alt={`carouselImage-${imageIndex}`}
                        className="w-full"
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <Button
            className="absolute top-1/2 right-1 text-white bg-gray-50 bg-opacity-40 hover:bg-gray-500 rounded-full"
            onClick={() => handleNextClick()}
          >
            &gt;
          </Button>
          <Button
            className="absolute top-1/2 left-1 text-white bg-gray-50 bg-opacity-40 hover:bg-gray-500 rounded-full"
            onClick={() => handlePrevClick()}
          >
            &lt;
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ImageCarousel;
