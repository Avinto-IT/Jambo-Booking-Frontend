"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dot } from "lucide-react";
import { GuestIcon } from "./Icons/AdminIcons";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

import { Room, Hotel } from "@/app/all-hotels/view-hotel-details/page";
import * as Icons from "lucide-react";
import { CustomIcons } from "@/utils/icons";
import Bed from "@/components/Icons/Bed";

import MaxWidthWrapper from "./MaxWidthWrapper";
import { Card, CardTitle } from "./ui/card";

const cleanFacilityName = (name: string) => name.replace(/[^a-zA-Z0-9]/g, "");

const ViewOnlyHotel: React.FC<{ hotel: Hotel }> = ({ hotel }) => {
  const [showMore, setShowMore] = useState(false);
  const [showAmenities, setShowAmentities] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [visibleFacilitiesCount, setVisibleFacilitiesCount] = useState(4);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRoomsClick = (room: Room) => {
    setSelectedRoom(room);
    setIsDialogOpen(true);
  };

  const handleRoomSmallImageClick = (image: string, index: number) => {
    setCurrentIndex(index);
  };

  const toggleShowMore = () => setShowMore(!showMore);
  const toggleShowAmenities = () => {
    setShowAmentities(!showAmenities);
    setVisibleFacilitiesCount(showAmenities ? 4 : hotel.facilities.length);
  };

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setIsCarouselOpen(true);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? hotel.imageLinks.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === hotel.imageLinks.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleRoomPrevClick = () => {
    setCurrentIndex((prevIndex) => {
      if (!selectedRoom || selectedRoom.roomImageLinks.length === 0)
        return prevIndex; // Safeguard against undefined or empty array
      const maxIndex = selectedRoom.roomImageLinks.length - 1;
      const newIndex = prevIndex === 0 ? maxIndex : prevIndex - 1;
      return newIndex;
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
      return newIndex;
    });
  };

  return (
    <div>
      <Card className="w-full">
        <div className="flex justify-center py-12">
          <MaxWidthWrapper className="max-w-screen-2xl">
            <div className="text-[#020617] my-7 space-y-10 tracking-tight">
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="text-3xl font-semibold">{hotel.name}</div>
                  <div className="">{hotel.address}</div>
                </div>
                <div className="flex h-[550px] gap-2">
                  <div className="w-1/2 relative overflow-hidden rounded-l-xl">
                    <img
                      src={hotel.primaryImageLink}
                      alt="PrimaryImage"
                      className="h-full min-h-[30rem] object-cover transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
                      onClick={() => handleImageClick(0)}
                    />
                  </div>
                  <div
                    className={`grid ${
                      hotel.imageLinks.length <= 2 ? "flex" : "grid-cols-2"
                    } gap-2 w-1/2`}
                  >
                    {hotel.imageLinks.slice(0, 4).map((image, index) => (
                      <div
                        className={`relative overflow-hidden ${
                          hotel.imageLinks.length === 1
                            ? "rounded-r-xl"
                            : hotel.imageLinks.length <= 2
                            ? index === 0
                              ? "rounded-tr-xl"
                              : index === 1
                              ? "rounded-br-xl"
                              : ""
                            : index === 1
                            ? "rounded-tr-xl"
                            : index === 3
                            ? "rounded-br-xl"
                            : ""
                        }`}
                        onClick={() => handleImageClick(index + 1)}
                        key={index}
                      >
                        <img
                          src={image}
                          alt={`smallImage-${index}`}
                          className="h-full w-full transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
                        />
                      </div>
                    ))}
                  </div>

                  <Dialog
                    open={isCarouselOpen}
                    onOpenChange={setIsCarouselOpen}
                  >
                    <DialogOverlay className="bg-black bg-opacity-50" />
                    <DialogContent className="flex items-center justify-center p-1 min-w-fit max-h-fit bg-transparent border-none">
                      <div className="w-full">
                        <div className="flex overflow-hidden">
                          <div
                            className="flex transition-transform duration-500 ease-in-out items-center"
                            style={{
                              transform: `translateX(-${currentIndex * 100}%)`,
                            }}
                          >
                            <div className="flex-shrink-0 w-full">
                              <img
                                src={hotel.primaryImageLink}
                                alt="PrimaryImage"
                              />
                            </div>
                            {hotel.imageLinks.map((image, imageIndex) => (
                              <div
                                className="flex-shrink-0 w-full"
                                key={imageIndex}
                              >
                                <img
                                  src={image}
                                  alt={`carouselImage-${imageIndex}`}
                                  className="w-full"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button
                          className="absolute top-1/2 right-8 text-white bg-gray-50 bg-opacity-40 rounded-full"
                          onClick={() => handleNextClick()}
                        >
                          &gt;
                        </Button>
                        <Button
                          className="absolute top-1/2 left-8 text-white bg-gray-50 bg-opacity-40 rounded-full"
                          onClick={() => handlePrevClick()}
                        >
                          &lt;
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-20">
                <div className="space-y-4 col-span-4 ">
                  <div className="space-y-3">
                    <div className="text-2xl font-semibold">Basic Overview</div>
                    <div className="pb-5">{hotel.address}</div>
                    <div className="leading-7 border-t-2 border-slate-200 pt-7">
                      {hotel.description.length > 350 ? (
                        <div className="space-y-5">
                          <div className="">
                            {showMore
                              ? hotel.description
                              : hotel.description.substring(0, 350) + "..."}
                          </div>
                          <div
                            className="text-blue-600 text-sm font-medium cursor-pointer"
                            onClick={toggleShowMore}
                          >
                            <u>{!showMore ? "Show More" : "Show Less"}</u>
                          </div>
                        </div>
                      ) : (
                        hotel.description
                      )}
                    </div>
                  </div>
                  <div className="border-b-2 border-slate-200 pt-1"></div>
                  <div className="space-y-6">
                    <div className="text-2xl font-semibold pt-1">
                      Top Facilities
                    </div>
                    <div className="grid gap-6 grid-cols-2">
                      {hotel.facilities.map((facility, facilityIndex) => {
                        const cleanedName = cleanFacilityName(facility.name);
                        const IconComponent = CustomIcons[cleanedName];
                        return (
                          <div
                            key={facilityIndex}
                            className="flex items-center gap-4"
                          >
                            {IconComponent && (
                              <IconComponent
                                height={24}
                                width={24}
                                weight="light"
                              />
                            )}
                            {facility.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="border-b-2 border-slate-200 pt-2"></div>
                    <div className="space-y-7">
                      <div className="text-2xl font-semibold mt-7">Rooms</div>
                      {hotel.rooms.map((value, roomIndex: number) => {
                        return (
                          <Card
                            key={roomIndex}
                            className="py-6 px-4 space-y-2 hover:bg-[#EFF6FF] hover:border-[#2563EB]"
                            onClick={() => handleRoomsClick(value)}
                          >
                            <CardTitle className="text-xl">
                              {value.type}
                            </CardTitle>
                            <div className="flex justify-between">
                              <div className="space-y-2 w-2/3">
                                <div className="flex justify-start w-full font-medium gap-8">
                                  <div className="flex flex-col font-normal items-start">
                                    {value.beds.map((bed, bedIndex) => (
                                      <div
                                        className="flex gap-4"
                                        key={bedIndex}
                                      >
                                        <div className="flex gap-4 items-center">
                                          <Bed />
                                          <span className="font-normal">
                                            {bed.numberOfBeds} {bed.bedType}{" "}
                                            <span> bed(s)</span>
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex px-4 font-normal items-start">
                                    <div className="flex gap-4">
                                      <GuestIcon />
                                      <span>{value.capacity} guests</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap">
                                  {value.amenities
                                    .slice(0, 12)
                                    .map((amenity, amenityIndex) => (
                                      <span
                                        className="text-sm text-[#64748B] flex items-center gap-x-1"
                                        key={amenityIndex}
                                      >
                                        <div className="whitespace-nowrap">
                                          {amenity.name}
                                        </div>
                                        <Dot />
                                      </span>
                                    ))}
                                </div>
                                <div className="text-[#64748B]">
                                  {value.amenities.length > 12 && (
                                    <div className="underline">
                                      {value.amenities.length - 12}+ Amenities
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-start justify-end space-y-3">
                                <p className="text-[#64748B] text-sm">
                                  Includes taxes and fees
                                </p>
                                <p className="flex justify-end w-full text-xl font-semibold">
                                  USD {value.price}
                                </p>
                              </div>
                            </div>
                          </Card>
                        );
                      })}

                      {selectedRoom && (
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <div className="">
                            <DialogContent className="flex items-center justify-center p-6 min-w-fit max-h-fit border-none">
                              <div className="w-[1200px] flex gap-10">
                                <div className="flex flex-col gap-3 w-7/12">
                                  <div className="relative overflow-hidden w-full h-[30rem]">
                                    <div
                                      className="flex transition-transform duration-500 ease-in-out"
                                      style={{
                                        transform: `translateX(-${
                                          currentIndex * 100
                                        }%)`,
                                      }}
                                    >
                                      {selectedRoom.roomImageLinks &&
                                        selectedRoom.roomImageLinks.map(
                                          (image, imgIndex) => (
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
                                          )
                                        )}
                                    </div>
                                    <Button
                                      className="absolute top-1/2 right-8 text-white bg-gray-100 bg-opacity-40 rounded-full hover:text-white"
                                      onClick={() => handleRoomNextClick()}
                                    >
                                      &gt;
                                    </Button>
                                    <Button
                                      className="absolute top-1/2 left-8 text-white bg-gray-100 bg-opacity-40 rounded-full hover:text-white"
                                      onClick={() => handleRoomPrevClick()}
                                    >
                                      &lt;
                                    </Button>
                                  </div>

                                  <div className="flex gap-2 overflow-x-scroll">
                                    {selectedRoom.roomImageLinks &&
                                      selectedRoom.roomImageLinks.map(
                                        (image, imgInd) => (
                                          <div
                                            key={imgInd}
                                            className="flex-none w-40 h-40"
                                          >
                                            <img
                                              alt={`Image ${imgInd + 1}`}
                                              className="w-full h-full rounded-md object-cover hover:border-2 hover:border-blue-600"
                                              src={image}
                                              onClick={() =>
                                                handleRoomSmallImageClick(
                                                  image,
                                                  imgInd
                                                )
                                              }
                                            />
                                          </div>
                                        )
                                      )}
                                  </div>
                                </div>
                                <div className="w-5/12 space-y-5 text-sm">
                                  <DialogTitle>{selectedRoom.type}</DialogTitle>
                                  <div className="">
                                    {selectedRoom.beds.map((bed, bedInd) => {
                                      return (
                                        <div
                                          className="flex justify-between"
                                          key={bedInd}
                                        >
                                          <div className="flex">
                                            <div className="font-semibold">
                                              Bed Type :
                                            </div>
                                            {bed.bedType}
                                          </div>
                                          <div className="flex">
                                            <div className="font-semibold">
                                              Number of Beds :
                                            </div>
                                            {bed.numberOfBeds}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="">
                                    <div className="flex">
                                      <div className="font-semibold">
                                        Room Facilities :
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 mt-2">
                                      {selectedRoom.amenities.map(
                                        (item, itemIndex) => {
                                          return (
                                            <div className="" key={itemIndex}>
                                              <div
                                                className="flex"
                                                key={itemIndex}
                                              >
                                                <div className="mr-2">
                                                  <Icons.Check className="h-4 w-4" />
                                                </div>
                                                {item.name}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex">
                                    <div className="font-semibold">
                                      Number of Rooms :
                                    </div>
                                    {selectedRoom.numberOfRooms}
                                  </div>
                                  <div className="flex">
                                    <div className="font-semibold">
                                      Price of the room :
                                    </div>
                                    USD {selectedRoom.price}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </div>
                        </Dialog>
                      )}
                    </div>
                    <div className="border-t-2 my-7"></div>
                  </div>
                  <div className="space-y-7">
                    <div className="text-2xl font-semibold">
                      Explore All Facilities
                    </div>
                    <div className="grid grid-cols-3">
                      {hotel.facilities
                        .slice(0, visibleFacilitiesCount)
                        .map((value, facilityIndex) => {
                          const cleanedName = cleanFacilityName(value.name);
                          const IconComponent = CustomIcons[cleanedName];
                          return (
                            <div
                              className="col-span-1 my-4"
                              key={facilityIndex}
                            >
                              <div className="flex items-center gap-4">
                                {IconComponent && (
                                  <IconComponent
                                    height={24}
                                    width={24}
                                    weight="light"
                                  />
                                )}
                                <span>{value.name}</span>
                              </div>
                              <div className="">
                                {value.subFacilities.map(
                                  (subValue, subIndex) => {
                                    return (
                                      <div
                                        className="text-sm text-[#64748B] flex items-end ml-10"
                                        key={subIndex}
                                      >
                                        <Dot />
                                        <span>{subValue.name}</span>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {hotel.facilities.length > 4 && (
                      <Button variant={"outline"} onClick={toggleShowAmenities}>
                        {!showAmenities
                          ? `Show all ${hotel.facilities.length} amenities`
                          : "Show Less"}
                      </Button>
                    )}
                    <div className="border-b-2 mt-7"></div>
                    <div className="space-y-7 my-8">
                      <div className="text-2xl font-semibold">House Rules</div>
                      <div className="">
                        {hotel.houseRules.map((value, ruleIndex) => {
                          const cleanedName = cleanFacilityName(value.type);
                          const IconComponent = CustomIcons[cleanedName];
                          return (
                            <div key={ruleIndex}>
                              <div className="flex w-full">
                                <div className="flex gap-4 w-1/4">
                                  {IconComponent && (
                                    <IconComponent
                                      height={24}
                                      width={24}
                                      weight="light"
                                    />
                                  )}
                                  {value.type}
                                </div>
                                <div className="w-3/4">{value.details}</div>
                              </div>
                              {ruleIndex !== hotel.houseRules.length - 1 && (
                                <div className="border-t-2 my-5"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 "></div>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </Card>
    </div>
  );
};

export default ViewOnlyHotel;
