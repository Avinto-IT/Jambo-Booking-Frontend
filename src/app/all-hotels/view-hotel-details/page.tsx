"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel } from "@/utils/types";
import { Dot } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import bed from "../../../../public/images/Bed.svg";
import guest from "../../../../public/images/Guest.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import facilitiesIcon from "../../../../data/facilities.json";
import * as Icons from "lucide-react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import DatePicker from "react-datepicker";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import Layout from "@/components/Layout/Layout";
import Link from "next/link";

interface Room {
  type: string;
  numberOfBeds: number;
  bedType: string;
  capacity: number;
  amenities: { name: string }[];
  price: number;
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
  const [count, setCount] = useState(0);
  const [showAmenities, setShowAmentities] = useState(false);
  const [visibleFacilitiesCount, setVisibleFacilitiesCount] = useState(4);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [currentDate, setCurrentDate] = useState("");
  const searchParams = useSearchParams();
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const id = searchParams?.get("id");
  //   const [hotel, setHotel] = useState<Hotel>();
  const [hotel, setHotel] = useState<{
    name: string;
    address: string;
    primaryImageLink: string;
    imageLinks: string[];
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
    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);
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
  const handleCardClick = (value: Room) => {
    console.log(value);
  };
  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 0) setCount(count - 1);
    else alert("must be more than 0");
  };
  return (
    // <AdminLayout>
    <Layout>
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
                          className="h-full w-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
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
                                src={hotel.primaryImageLink}
                                alt="PrimaryImage"
                                className=""
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
                                  className="w-full object-cover"
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
                <div className="flex justify-between ">
                  <div className="space-y-3 w-2/3">
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
                    <div className=" border-b-2 pt-1 "></div>
                  </div>
                  <Card className="w-1/3  p-5 ml-20 shadow-lg space-y-5">
                    <div className="flex">${hotel.rooms[0].price} / night</div>
                    <div className="flex  justify-between items-center">
                      <div className="">
                        <Label>Check In</Label>
                        <Input
                          type="date"
                          value={currentDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-fit"
                        />
                      </div>
                      <div className="">
                        <Label>Check In</Label>
                        <Input
                          type="date"
                          value={currentDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-fit"
                        />
                      </div>
                    </div>
                    <div className="">
                      <p className="">Guests</p>
                      <Input type="Number" />
                    </div>
                    <div className="flex items-center">
                      <RadioGroup defaultValue="lunch" className="flex ">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="breakfast" id="breakfast" />
                          <Label htmlFor="breakfast">Breakfast</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="lunch" id="lunch" />
                          <Label htmlFor="lunch">Lunch</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dinner" id="dinner" />
                          <Label htmlFor="dinner">Dinner</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-700 h-10 rounded-md w-full flex items-center justify-center ">
                        <p className="text-white"> Reserve</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="">Breakfast</p>
                          <p className="">USD 62</p>
                        </div>

                        <div className="flex justify-between">
                          <p className="">Breakfast</p>
                          <p className="">USD 62</p>
                        </div>

                        <div className="flex justify-between">
                          <p className="">Breakfast</p>
                          <p className="">USD 62</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="">Total</p>
                          <p className="">USD 20</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

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
                          onClick={() => handleCardClick(value)}
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

                            <div className="flex flex-col items-start justify-start space-y-3">
                              <p className="flex justify-start text-sm font-semibold">
                                Select Rooms
                              </p>
                              <div className="flex justify-between items-center w-full pr-4">
                                <div
                                  className="rounded-full cursor-pointer bg-[#E2E8F0] h-8 w-8 flex items-center justify-center p-2"
                                  onClick={decrementCount}
                                >
                                  <Icons.Minus className="" />
                                </div>
                                <p className="">{count}</p>
                                <div
                                  className="rounded-full cursor-pointer bg-[#E2E8F0] h-8 w-8 flex items-center justify-center p-2"
                                  onClick={incrementCount}
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
    </Layout>
  );
}
