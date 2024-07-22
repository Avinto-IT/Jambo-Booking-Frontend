"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel } from "@/utils/types";
import { Dot } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Page() {
  const [showMore, setShowMore] = useState(false);
  const [showAmenities, setShowAmentities] = useState(false);
  const [visibleFacilitiesCount, setVisibleFacilitiesCount] = useState(4);
  const searchParams = useSearchParams();

  const id = searchParams?.get("id");
  //   const [hotel, setHotel] = useState<Hotel>();
  const [hotel, setHotel] = useState<{
    name: string;
    primaryImageLink: string;
    imageLinks: string[];
    address: string;
    description: string;
    facilities: { name: string; subFacilities: { name: string }[] }[];
    rooms: {
      type: string;
      numberOfBeds: number;
      bedType: string;
      capacity: number;
      amenities: { name: string }[];
      price: number;
    }[];
    houseRules: { type: string; details: string }[];
  }>();
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const [token, setToken] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setIsCarouselOpen(true);
  };

  const handleCloseCarousel = () => {
    setIsCarouselOpen(false);
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

  return (
    <AdminLayout>
      {" "}
      <Card className="w-full">
        <div className="flex justify-center ">
          <MaxWidthWrapper>
            <div className="text-[#020617] my-7 space-y-10 tracking-tight">
              <div className="space-y-5">
                <div className="space-y-3">
                  <p
                    className="text-3xl  font-semibold
            "
                  >
                    {hotel.name}
                  </p>
                  <p className="">{hotel.address}</p>
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
                                layout="fill"
                                // objectFit="cover"
                              />
                            </div>
                            {hotel.imageLinks.map((image, index) => (
                              <div
                                className="flex-shrink-0 w-full "
                                key={index}
                              >
                                <img
                                  src={image}
                                  alt={`carouselImage-${index}`}
                                  className="w-full"
                                  objectFit="cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button
                          className="absolute top-1/2 -right-4 text-white bg-black bg-opacity-75 rounded-full"
                          onClick={handleNextClick}
                        >
                          &gt;
                        </Button>
                        <Button
                          className="absolute top-1/2 -left-4 text-white bg-black bg-opacity-75 rounded-full"
                          onClick={handlePrevClick}
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
                  <p className="text-2xl font-semibold">Basic Overview</p>
                  <p className="pb-5">{hotel.address}</p>
                  <p className="leading-7 border-t-2 pt-7">
                    {hotel.description.length > 350 ? (
                      <div className="space-y-5">
                        <p className="">
                          {showMore
                            ? hotel.description
                            : hotel.description.substring(0, 350) + "..."}
                        </p>
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
                  </p>
                </div>
                <div className=" border-b-2 pt-1 "></div>
                <div className="space-y-7">
                  <p className="text-2xl font-semibold pt-1">Top Facilities</p>
                  <div className="grid gap-5 grid-cols-3">
                    {hotel.facilities.map((facility, index) => {
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
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <div className="">
                            {IconComponent && <IconComponent className="" />}
                          </div>

                          <p className="">{facility.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-2/3">
                  <div className=" border-b-2  pt-2"></div>
                  <div className="space-y-7">
                    <p className="text-2xl font-semibold mt-7">Rooms</p>
                    {hotel.rooms.map((value, index) => {
                      //   console.log(value, "asasas");
                      return (
                        <Card
                          key={index}
                          className="p-5 space-y-2 hover:bg-[#EFF6FF] hover:border-[#2563EB] "
                        >
                          <CardTitle className="text-xl">
                            {value.type}
                          </CardTitle>
                          <div className="flex justify-between">
                            <div className="space-y-2 w-2/3 pr-5 ">
                              <div className="flex  justify-between w-3/5 font-medium">
                                <div className="flex ">
                                  <Image src={bed} alt="bed" />
                                  <p className="pl-4 pr-1">
                                    {value.numberOfBeds}
                                  </p>
                                  <p className="">{value.bedType}</p>
                                </div>
                                <div className="flex space-x-4">
                                  <Image src={guest} alt="guest" />
                                  <p className=""> {value.capacity}</p>
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
                                      <p className="whitespace-nowrap">
                                        {amenity.name}
                                      </p>
                                      <Dot />
                                    </span>
                                  ))}
                              </div>
                              <div className="text-[#64748B]">
                                {value.amenities.length > 12 && (
                                  <p>
                                    {value.amenities.length - 12}+ Amenities
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-end space-y-2">
                              <p className="text-[#64748B] text-sm">
                                Includes taxes and fees{" "}
                              </p>
                              <p className="flex justify-end text-xl font-semibold">
                                Rs.{value.price}
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                  <div className=" border-b-2 my-7  "></div>
                </div>
                <div className="space-y-7">
                  <p className="text-2xl font-semibold">
                    Explore All Facilities
                  </p>
                  <div className="grid grid-cols-3 space-y-2">
                    {hotel.facilities
                      .slice(0, visibleFacilitiesCount)
                      .map((value, index) => {
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
                          <div className="" key={index}>
                            <div className="flex items-center space-x-4 ">
                              {IconComponent && <IconComponent className="" />}

                              <p className="">{value.name}</p>
                            </div>
                            <div className="">
                              {value.subFacilities.map((subValue, subIndex) => {
                                return (
                                  <span
                                    className="text-sm text-[#64748B]    flex  items-end ml-10"
                                    key={subIndex}
                                  >
                                    <Dot className="" />
                                    <p className="">{subValue.name}</p>
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
                    <p className="text-2xl font-semibold">House Rules</p>
                    <div className="">
                      {hotel.houseRules.map((value, index) => {
                        return (
                          <div key={index}>
                            <div className="flex w-full">
                              <p className="w-1/4">{value.type}</p>
                              <p className="w-3/4">{value.details}</p>
                            </div>
                            {index !== hotel.houseRules.length - 1 && (
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
