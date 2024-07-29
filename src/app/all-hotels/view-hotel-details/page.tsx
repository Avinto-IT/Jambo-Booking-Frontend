"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardTitle } from "@/components/ui/card";
// import { Hotel } from "@/utils/types";
import { Dot } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import bed from "../../../../public/images/Bed.svg";
import guest from "../../../../public/images/Guest.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import facilitiesIcon from "../../../../data/facilities.json";
import * as Icons from "lucide-react";
import UseFacilityIcon from "../../../utils/facilityIcon";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Layout from "@/components/Layout/Layout";
// import Hero from "@/components/landing/Hero";
import Hero from "@/components/HotelHero/Hero";
// import BookingConfirmation from "./booking-confirmation/page";
// import UseFacilityIcon from "../../../utils/facilityIcon";

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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientViewHotel />
    </Suspense>
  );
}
function ClientViewHotel() {
  const [showMore, setShowMore] = useState(false);
  const [showAmenities, setShowAmentities] = useState(false);
  const [visibleFacilitiesCount, setVisibleFacilitiesCount] = useState(4);

  const searchParams = useSearchParams();

  const id = searchParams?.get("id");
  //   const [hotel, setHotel] = useState<Hotel>();
  const [hotel, setHotel] = useState<Hotel>();
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const [token, setToken] = useState<string | null>(null);

  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [count, setCount] = useState<number[]>([]);
  // const { getIconComponent } = useFacilityIcon();
  useEffect(() => {
    if (hotel?.rooms) {
      setCount(Array(hotel.rooms.length).fill(0));
    }
  }, [hotel]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`/api/getHotelById?id=${id}`);
        const data = await response.json();
        setHotel(data.hotel);
      } catch (error) {
        console.log("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);
  if (!hotel) return <>Loading...</>;

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const toggleShowAmenities = () => {
    if (showAmenities) {
      setVisibleFacilitiesCount(4); // Show only the first 3 facilities
    } else {
      setVisibleFacilitiesCount(hotel.facilities.length); // Show all facilities
    }
    setShowAmentities(!showAmenities);
  };

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setIsCarouselOpen(true);
  };

  const handleRoomSmallImageClick = (image: string, index: number) => {
    // setRoomImage(image);
    setCurrentIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? hotel.imageLinks.length : prevIndex - 1
    );
  };
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === hotel.imageLinks.length ? 0 : prevIndex + 1
    );
  };
  let roomImageLength = 0;

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
  const handleRoomsClick = (room: Room) => {
    setSelectedRoom(room);
    setIsDialogOpen(true);
  };
  const incrementCount = (index: number) => {
    setCount((prevCounts) => {
      const newCounts = [...prevCounts];
      newCounts[index] += 1;
      return newCounts;
    });
  };

  const decrementCount = (index: number) => {
    setCount((prevCounts) => {
      const newCounts = [...prevCounts];
      if (newCounts[index] > 0) {
        newCounts[index] -= 1;
      }
      return newCounts;
    });
  };

  return (
    <Layout>
      {/* <Hero title={hotel.address.slice(0, hotel.address.indexOf(","))} /> */}
      <Hero title={hotel.name} />
      <Card className="w-full">
        <div className="flex justify-center ">
          <MaxWidthWrapper>
            <div className="text-[#020617] my-7 space-y-10 tracking-tight">
              <div className="space-y-5">
                <div className="space-y-3">
                  <div
                    className="text-3xl  font-semibold
            "
                  >
                    {hotel.name}
                  </div>
                  <div className="">{hotel.address}</div>
                </div>
                <div className="  flex  h-[550px] gap-2  ">
                  <div className="w-1/2 relative overflow-hidden rounded-l-xl">
                    <img
                      src={hotel.primaryImageLink}
                      alt="PrimaryImage"
                      className="h-full min-h-[30rem] object-cover transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
                      onClick={() => handleImageClick(0)}
                    />
                  </div>
                  <div
                    className={`grid
                    ${hotel.imageLinks.length <= 2 ? "flex" : "grid-cols-2 "}
                     gap-2 w-1/2`}
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
                    {/* {hotel.imageLinks.length > 5 ? (
                      <Button
                        variant="outline"
                        className="absolute bottom-3 bg-[#F1F5F9] right-48 "
                        onClick={() => handleImageClick(0)}
                      >
                        Show all photos
                      </Button>
                    ) : (
                      ""
                    )} */}
                  </div>

                  <Dialog
                    open={isCarouselOpen}
                    onOpenChange={setIsCarouselOpen}
                  >
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
                              <img
                                // src={staticimg3}
                                src={hotel.primaryImageLink}
                                alt="PrimaryImage"
                                className=""

                                // objectFit="cover"
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
                                  className="w-full "
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button
                          className="absolute top-1/2 right-1 text-white bg-gray-50 bg-opacity-40 rounded-full"
                          onClick={() => handleNextClick()}
                        >
                          &gt;
                        </Button>
                        <Button
                          className="absolute top-1/2 left-1 text-white bg-gray-50 bg-opacity-40 rounded-full"
                          onClick={() => handlePrevClick()}
                        >
                          &lt;
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="text-2xl font-semibold">Basic Overview</div>
                  <div className="pb-5">{hotel.address}</div>
                  <div className="leading-7 border-t-2 pt-7">
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
                <div className=" border-b-2 pt-1 "></div>
                <div className="space-y-7">
                  <div className="text-2xl font-semibold pt-1">
                    Top Facilities
                  </div>
                  <div className="grid gap-5 grid-cols-3">
                    {/* icon is rendered here but comes from facilityIcon*/}
                    {/* {hotel.facilities.map((facility, facilityIndex) => {
                
                  
                      const IconComponent = (Icons as any)[
                        `${getIconName(facility.name)}`
                        
                      ];
                      
                      if (facilityNames.includes(facility.name))
                        return (
                          <div
                            key={facilityIndex}
                            className="flex items-center space-x-4"
                          >
                            <div>{IconComponent && <IconComponent />}</div>
                            <div className="">{facility.name}</div>
                          </div>
                        );
                    })} */}

                    {hotel.facilities.map((facility, facilityIndex) => {
                      // const IconComponent = getIconComponent(facility.name);

                      return (
                        <div
                          key={facilityIndex}
                          className="flex items-center space-x-4"
                        >
                          <div>
                            {UseFacilityIcon && (
                              <UseFacilityIcon nameOfFacility={facility.name} />
                            )}
                          </div>
                          <div className="">{facility.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-2/3">
                  <div className=" border-b-2  pt-2"></div>
                  <div className="space-y-7">
                    <div className="text-2xl font-semibold mt-7">Rooms</div>
                    {hotel.rooms.map((value, roomIndex: number) => {
                      //   console.log(value, "asasas");
                      return (
                        <Card
                          key={roomIndex}
                          className="p-5 space-y-2 hover:bg-[#EFF6FF] hover:border-[#2563EB] "
                          onClick={() => handleRoomsClick(value)}
                        >
                          <CardTitle className="text-xl">
                            {value.type}
                          </CardTitle>
                          <div className="flex justify-between">
                            <div className="space-y-2 w-2/3 pr-5 ">
                              <div className="flex  justify-between w-3/5 font-medium">
                                <div className="flex ">
                                  <Image src={bed} alt="bed" />
                                  {value.beds.map((bed, bedIndex) => {
                                    return (
                                      <>
                                        <div className="flex">
                                          <div className="pl-4 pr-1">
                                            {value.beds[bedIndex].numberOfBeds}
                                          </div>
                                          <div className="">
                                            {value.beds[bedIndex].bedType}
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })}
                                </div>
                                <div className="flex space-x-4">
                                  <Image src={guest} alt="guest" />
                                  {/* <div className=""> {value.capacity}</div> */}
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
                                  <div>
                                    {value.amenities.length - 12}+ Amenities
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-start justify-start space-y-3">
                              <p className="flex justify-start text-sm font-semibold">
                                Select Rooms
                              </p>
                              <div className="flex justify-between items-center w-full pr-4">
                                <div
                                  className="rounded-full cursor-pointer bg-[#E2E8F0] h-8 w-8 flex items-center justify-center p-2"
                                  // onClick={() => decrementCount(roomIndex)}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    decrementCount(roomIndex);
                                  }}
                                >
                                  <Icons.Minus className="" />
                                </div>
                                <p className="">{count[roomIndex]}</p>
                                <div
                                  className="rounded-full cursor-pointer bg-[#E2E8F0] h-8 w-8 flex items-center justify-center p-2"
                                  // onClick={() => incrementCount(roomIndex)}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    incrementCount(roomIndex);
                                  }}
                                >
                                  <Icons.Plus />
                                </div>
                              </div>

                              <p className="text-[#64748B] text-sm">
                                Includes taxes and fees{" "}
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
                        {/* <DialogOverlay className="bg-black bg-opacity-10" /> */}
                        <div className="">
                          <DialogContent className="flex items-center justify-center p-5  min-w-fit  max-h-fit  border-none">
                            <div className="w-[1200px] flex gap-10">
                              <div className="flex flex-col gap-3 w-7/12 relative">
                                <div className="overflow-hidden w-full h-[30rem]">
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
                                    Number of Rooms :{" "}
                                  </div>

                                  {selectedRoom.numberOfRooms}
                                </div>
                                <div className="flex">
                                  <div className="font-semibold">
                                    Price of the room :{" "}
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
                  <div className=" border-b-2 my-7  "></div>
                </div>
                <div className="space-y-7">
                  <div className="text-2xl font-semibold">
                    Explore All Facilities
                  </div>
                  <div className="grid grid-cols-3 space-y-2">
                    {hotel.facilities
                      .slice(0, visibleFacilitiesCount)
                      .map((value, facilityIndex) => {
                        // const IconComponent = getIconComponent(value.name);

                        return (
                          <div className="" key={facilityIndex}>
                            <div className="flex items-center space-x-4 ">
                              {UseFacilityIcon && (
                                <UseFacilityIcon nameOfFacility={value.name} />
                              )}

                              <div className="">{value.name}</div>
                            </div>
                            <div className="">
                              {value.subFacilities.map((subValue, subIndex) => {
                                return (
                                  <span
                                    className="text-sm text-[#64748B]    flex  items-end ml-10"
                                    key={subIndex}
                                  >
                                    <Dot className="" />
                                    <div className="">{subValue.name}</div>
                                  </span>
                                );
                              })}
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

                  <div className=" border-b-2 mt-7"></div>
                  <div className="space-y-7">
                    <div className="text-2xl font-semibold">House Rules</div>
                    <div className="">
                      {hotel.houseRules.map((value, ruleIndex) => {
                        return (
                          <div key={ruleIndex}>
                            <div className="flex w-full">
                              <div className="w-1/4">{value.type}</div>
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
            </div>
          </MaxWidthWrapper>
        </div>
      </Card>
    </Layout>
  );
}
