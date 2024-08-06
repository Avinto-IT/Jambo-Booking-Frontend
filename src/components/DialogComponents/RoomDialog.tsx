import React from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

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

interface RoomDialogProps {
  selectedRoom: Room | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (index: number | ((prevIndex: number) => number)) => void;
}
// function RoomDialog(selectedRoom,isDialogOpen,setIsDialogOpen,currentIndex,setCurrentIndex) {
const RoomDialog: React.FC<RoomDialogProps> = ({
  selectedRoom,
  isDialogOpen,
  setIsDialogOpen,
  currentIndex,
  setCurrentIndex,
}) => {
  const handleRoomPrevClick = () => {
    setCurrentIndex((prevIndex) => {
      if (!selectedRoom || selectedRoom.roomImageLinks.length === 0)
        return prevIndex; // Safeguard against undefined or empty array
      // if (roomImage > 0) {
      //   const maxIndex = roomImage - 1;
      //   return prevIndex === 0 ? maxIndex : prevIndex - 1;
      // }
      const maxIndex = selectedRoom.roomImageLinks.length - 1;
      const newIndex = prevIndex === 0 ? maxIndex : prevIndex - 1;
      // setRoomImage(selectedRoom.roomImageLinks[newIndex]);
      return newIndex;
      // return prevIndex === 0 ? maxIndex : prevIndex - 1;
    });
  };
  const handleRoomNextClick = () => {
    setCurrentIndex((nextIndex) => {
      if (!selectedRoom || selectedRoom.roomImageLinks.length === 0)
        return nextIndex; // Safeguard against undefined or empty array

      const newIndex =
        nextIndex === selectedRoom.roomImageLinks.length - 1
          ? 0
          : nextIndex + 1;
      // setRoomImage(selectedRoom.roomImageLinks[newIndex]);
      return newIndex;
    });
  };
  const handleRoomSmallImageClick = (image: string, index: number) => {
    // setRoomImage(image);
    setCurrentIndex(index);
  };
  return (
    <>
      {" "}
      {selectedRoom && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {/* <DialogOverlay className="bg-black bg-opacity-10" /> */}
          <div className="">
            <DialogContent className="flex items-center justify-center p-5  min-w-fit  max-h-fit  border-none">
              <div className="w-[1200px] flex gap-10">
                <div className="flex flex-col gap-3 w-7/12 relative">
                  <div className="overflow-hidden w-full h-[30rem]">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                      }}
                    >
                      {selectedRoom.roomImageLinks &&
                        selectedRoom.roomImageLinks.map((image, imgIndex) => (
                          <div
                            className="flex-shrink-0 w-full h-[30rem]"
                            key={imgIndex}
                            style={{ width: "100%" }}
                          >
                            <img
                              src={image}
                              alt={`carouselImage-${imgIndex}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                  <Button
                    className="absolute top-56 right-0 text-white bg-gray-100 bg-opacity-40 rounded-full hover:text-white"
                    onClick={() => handleRoomNextClick()}
                  >
                    &gt;
                  </Button>
                  <Button
                    className="absolute top-56 left-0 text-white bg-gray-100 bg-opacity-40 rounded-full hover:text-white"
                    onClick={() => handleRoomPrevClick()}
                  >
                    &lt;
                  </Button>
                  <div className="flex gap-2 overflow-x-scroll">
                    {selectedRoom.roomImageLinks &&
                      selectedRoom.roomImageLinks.map((image, imgInd) => (
                        <div key={imgInd} className="flex-none w-40 h-40">
                          <img
                            alt={`Image ${imgInd + 1}`}
                            className="w-full h-full rounded-md object-cover hover:border-2 hover:border-blue-600"
                            src={image}
                            onClick={() =>
                              handleRoomSmallImageClick(image, imgInd)
                            }
                          />
                        </div>
                      ))}
                  </div>
                </div>
                <div className="w-5/12 space-y-5 text-sm">
                  <DialogTitle>{selectedRoom.type}</DialogTitle>
                  <div className="">
                    {selectedRoom.beds.map((bed, bedInd) => {
                      return (
                        <div className="flex justify-between" key={bedInd}>
                          <div className="flex">
                            {" "}
                            <div className="font-semibold">
                              {" "}
                              Bed Type :
                            </div>{" "}
                            {bed.bedType}
                          </div>
                          <div className="flex">
                            {" "}
                            <div className="font-semibold">
                              Number of Beds :{" "}
                            </div>{" "}
                            {bed.numberOfBeds}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="">
                    <div className="flex">
                      <div className="font-semibold">Room Facilities :</div>
                    </div>

                    <div className="grid grid-cols-2 mt-2">
                      {selectedRoom.amenities.map((item, itemIndex) => {
                        return (
                          <div className="" key={itemIndex}>
                            <div className="flex" key={itemIndex}>
                              <div className="mr-2">
                                <Check className="h-4 w-4" />
                              </div>
                              {item.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex">
                    <div className="font-semibold">Number of Rooms : </div>

                    {selectedRoom.numberOfRooms}
                  </div>
                  <div className="flex">
                    <div className="font-semibold">Price of the room : </div>
                    USD {selectedRoom.price}
                  </div>
                </div>
              </div>
            </DialogContent>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default RoomDialog;
