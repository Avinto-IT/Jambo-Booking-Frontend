"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Hotel } from "@/utils/types";
import { Dot } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import bed from "../../../../../public/images/Bed.svg";
import guest from "../../../../../public/images/Guest.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import facilitiesIcon from "../../../../../data/facilities.json";
import * as Icons from "lucide-react";
import AdminLayout from "@/components/Layout/AdminLayout";
import staticimg from "../../../../../public/images/static-from-landing/image.svg";
import staticimg2 from "../../../../../public/images/an_image_for_hotel_booking.svg";
import staticimg3 from "../../../../../public/images/explore-east-africa/Photo1.svg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Room {
  type: string;
  numberOfRooms: string;
  price: string;

  beds: {
    bedType: string;
    numberOfBeds: string;
  }[];

  amenities: { name: string }[];
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
      <AdminViewHotel />
    </Suspense>
  );
}
function AdminViewHotel() {
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
  const [locations, setLocations] = useState<Location[]>([]);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  //   console.log(hotel);

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

  const handleCloseCarousel = () => {
    setIsCarouselOpen(false);
  };
  let imageLength = 0;
  const handlePrevClick = (imageLength: number) => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? hotel.imageLinks.length - imageLength : prevIndex - 1
    );
  };
  const handleNextClick = (imageLength: number) => {
    setCurrentIndex((prevIndex) =>
      prevIndex === hotel.imageLinks.length - imageLength ? 0 : prevIndex + 1
    );
  };

  const handleRoomsClick = (value: Room) => {
    setSelectedRoom(value);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      {" "}
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
                <div className="  flex h-[550px] gap-2  ">
                  <div className="w-1/2 relative overflow-hidden rounded-l-xl">
                    <img
                      src={hotel.primaryImageLink}
                      alt="PrimaryImage"
                      className="h-full transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
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
                            className="flex transition-transform duration-500 ease-in-out"
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
                                className="flex-shrink-0 w-full "
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
                          className="absolute top-1/2 -right-4 text-white bg-black bg-opacity-75 rounded-full"
                          onClick={() => handleNextClick(imageLength)}
                        >
                          &gt;
                        </Button>
                        <Button
                          className="absolute top-1/2 -left-4 text-white bg-black bg-opacity-75 rounded-full"
                          onClick={() => handlePrevClick(imageLength)}
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
                    {hotel.facilities.map((facility, facilityIndex) => {
                      console.log(facility);
                      const facilityIcon = facilitiesIcon.facilitiesIcon.find(
                        (icon) => {
                          console.log(icon);
                          return icon.name === facility.name;
                        }
                      );

                      const IconComponent = (Icons as any)[
                        `${facilityIcon?.icon}`
                      ];

                      return (
                        <div
                          key={facilityIndex}
                          className="flex items-center space-x-4"
                        >
                          <div className="">
                            {IconComponent && <IconComponent className="" />}
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
                    {hotel.rooms.map((value, roomIndex) => {
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

                            <div className="flex flex-col items-end justify-end space-y-2">
                              <div className="text-[#64748B] text-sm">
                                Includes taxes and fees{" "}
                              </div>
                              <div className="flex justify-end text-xl font-semibold">
                                USD {value.price}
                              </div>
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
                            <div className=" w-[1200px] flex gap-10">
                              <div className="flex flex-col gap-3 w-7/12 relative">
                                <div className="flex overflow-hidden">
                                  <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{
                                      transform: `translateX(-${
                                        currentIndex * 100
                                      }%)`,
                                    }}
                                  >
                                    {/* <div className="flex-shrink-0 w-full">
                                      <img
                                        // src={staticimg3}
                                        src={hotel.primaryImageLink}
                                        alt="PrimaryImage"
                                        className=""

                                        // objectFit="cover"
                                      />
                                    </div> */}
                                    {hotel.imageLinks.map((image, imgIndex) => (
                                      <div
                                        className="flex-shrink-0 w-full "
                                        key={imgIndex - 1}
                                      >
                                        <img
                                          src={image}
                                          alt={`carouselImage-${imgIndex}`}
                                          className="w-full"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <Button
                                  className="absolute top-52 right-0 text-black bg-white bg-opacity-75 rounded-full hover:text-white"
                                  onClick={() =>
                                    handleNextClick((imageLength = 1))
                                  }
                                >
                                  &gt;
                                </Button>
                                <Button
                                  className="absolute top-52 left-0 text-black bg-white bg-opacity-75 rounded-full hover:text-white"
                                  onClick={() =>
                                    handlePrevClick((imageLength = 1))
                                  }
                                >
                                  &lt;
                                </Button>

                                <div className="grid grid-cols-5 gap-2 overflow-x-scroll">
                                  {hotel.imageLinks?.map((image, imgInd) => (
                                    <img
                                      key={imgInd}
                                      alt={`Image ${imgInd + 1}`}
                                      className="w-full rounded-md object-cover"
                                      src={image}
                                    />
                                  ))}
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
                        const facilityIcon = facilitiesIcon.facilitiesIcon.find(
                          (icon) => {
                            console.log(icon);
                            return icon.name === value.name;
                          }
                        );

                        const IconComponent = (Icons as any)[
                          `${facilityIcon?.icon}`
                        ];
                        return (
                          <div className="" key={facilityIndex}>
                            <div className="flex items-center space-x-4 ">
                              {IconComponent && <IconComponent className="" />}

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
    </AdminLayout>
  );
}
