"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dot } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import guest from "../../../../public/images/Guest.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

import { addDays, differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import * as Icons from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import Hero from "@/components/HotelHero/Hero";
import { DatePickerWithRange } from "@/components/DateRangePicker";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CustomIcons } from "@/utils/icons";
import Cookies from "js-cookie";
import Bed from "@/components/Icons/Bed";

export interface Room {
  type: string;
  numberOfRooms: string;
  price: string;
  capacity: string;

  beds: {
    bedType: string;
    numberOfBeds: string;
  }[];

  amenities: { name: string }[];
  roomImageLinks: string[];
}

export interface Hotel {
  name: string;
  primaryImageLink: string;
  imageLinks: string[];
  address: string;
  description: string;
  facilities: { name: string; subFacilities: { name: string }[] }[];
  rooms: Room[];
  houseRules: { type: string; details: string }[];
  discount: number;
  hotelID: string;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientViewHotel />
    </Suspense>
  );
}

const cleanFacilityName = (name: string) => name.replace(/[^a-zA-Z0-9]/g, "");

function ClientViewHotel() {
  const [showMore, setShowMore] = useState(false);
  const [showAmenities, setShowAmentities] = useState(false);
  const [visibleFacilitiesCount, setVisibleFacilitiesCount] = useState(4);

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const urlStartDate = searchParams?.get("checkin");
  const urlEndDate = searchParams?.get("checkout");
  let userID = null;

  const [hotel, setHotel] = useState<Hotel>();
  // const [token, setToken] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: urlStartDate ? new Date(urlStartDate) : addDays(new Date(), 10),
    to: urlEndDate ? new Date(urlEndDate) : addDays(new Date(), 14),
  });

  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [count, setCount] = useState<number[]>([]);
  const [guests, setGuests] = useState<number | undefined>(undefined);

  // New state to store user choices
  const [userChoices, setUserChoices] = useState<
    { room: Room; count: number }[]
  >([]);

  const router = useRouter(); // Initialize router for navigation

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDateRange(newDate);
  };

  useEffect(() => {
    if (hotel?.rooms) {
      setCount(Array(hotel.rooms.length).fill(0));
    }
  }, [hotel]);

  useEffect(() => {
    const storedUserDetails = Cookies.get("userDetails");

    if (storedUserDetails) {
      try {
        const userDetails = JSON.parse(storedUserDetails);
        userID = userDetails.userID;
      } catch (e) {
        console.warn("Error fetching user details");
      }
    }
  }, [userID]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`/api/getHotelById?id=${id}`);
        const data = await response.json();
        setHotel(data.hotel);
        console.log(data.hotel, "hotel data");
      } catch (error) {
        console.log("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, [id]);

  useEffect(() => {
    const storedBookingData = Cookies.get("bookingData");
    if (storedBookingData) {
      const parsedBookingData = JSON.parse(storedBookingData);
      if (!urlStartDate && !urlEndDate) {
        setDateRange({
          from: new Date(parsedBookingData.bookingStartDate),
          to: new Date(parsedBookingData.bookingEndDate),
        });
      }
      setGuests(parsedBookingData.guests);
      // console.log(parsedBookingData.guests, "lol");
      setCount(
        hotel?.rooms.map((room) => {
          const userChoice = parsedBookingData.userChoices.find(
            (choice: any) => choice.room.type === room.type
          );
          return userChoice ? userChoice.count : 0;
        }) || []
      );
    }
  }, [hotel, urlStartDate, urlEndDate]);

  useEffect(() => {
    const newChoices =
      hotel?.rooms
        .map((room, index) => ({
          room,
          count: count[index],
        }))
        .filter((choice) => choice.count > 0) || [];
    setUserChoices(newChoices);
  }, [count, hotel]);

  if (!hotel) return <>Loading...</>;

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const toggleShowAmenities = () => {
    if (showAmenities) {
      setVisibleFacilitiesCount(4); // Show only the first 3 facilities
    } else {
      if (hotel) {
        setVisibleFacilitiesCount(hotel.facilities.length); // Show all facilities if hotel is defined
      } else {
        setVisibleFacilitiesCount(0); // Handle the case where hotel is undefined
      }
    }
    setShowAmentities(!showAmenities);
  };

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setIsCarouselOpen(true);
  };

  const handleRoomSmallImageClick = (image: string, index: number) => {
    setCurrentIndex(index);
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

  const handleRoomsClick = (room: Room) => {
    setSelectedRoom(room);
    setIsDialogOpen(true);
  };

  const incrementCount = (index: number) => {
    setCount((prevCounts) => {
      const newCounts = [...prevCounts];
      const maxCount = parseInt(hotel?.rooms[index].numberOfRooms || "0");
      if (newCounts[index] < maxCount) {
        newCounts[index] += 1;
      }
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

  const totalOccupancy = userChoices.reduce(
    (sum, choice) => sum + parseInt(choice.room.capacity) * choice.count,
    0
  );

  const guestOptions = Array.from({ length: totalOccupancy }, (_, i) => i + 1);

  const numberOfDays =
    dateRange && dateRange.from && dateRange.to
      ? differenceInCalendarDays(dateRange.to, dateRange.from) + 1
      : 0;

  const totalPrice = userChoices.reduce((sum, choice) => {
    const price = parseFloat(choice.room.price);
    return sum + price * choice.count;
  }, 0);

  const finalPriceBeforeDiscount = totalPrice * numberOfDays;
  const discountAmount = (finalPriceBeforeDiscount * hotel.discount) / 100;
  const finalPrice = finalPriceBeforeDiscount - discountAmount;

  const handleSubmit = () => {
    // Retrieve user details from cookies
    const storedUserDetails = Cookies.get("userDetails");
    let userID = null;

    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      userID = userDetails.userID;
    }

    // Redirect to login if user ID is not found
    if (!userID) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    if (!dateRange || !dateRange.from || !dateRange.to) {
      toast.error("Please select a valid date range.");
      return;
    }
    if (userChoices.length === 0) {
      toast.error("Please select at least one room.");
      return;
    }
    if (!guests || guests === 0) {
      toast.error("Please select the number of guests.");
      return;
    }

    const bookingData = {
      userID, // Use the retrieved user ID
      hotelID: hotel.hotelID,
      bookingStartDate: dateRange.from.toISOString(),
      bookingEndDate: dateRange.to.toISOString(),
      guests,
      bookingInfo: userChoices.map((choice) => ({
        roomType: choice.room.type,
        rooms: choice.count,
      })),
      totalPrice,
      numberOfDays,
      discountAmount,
      finalPrice,
      userChoices,
    };

    // Store booking data in cookies
    Cookies.set("bookingData", JSON.stringify(bookingData), {
      expires: 1, // 1 day
      secure: true, // Only sent over HTTPS
      sameSite: "Strict", // Only sent in a first-party context
    });

    router.push(`/booking-review`);
  };

  return (
    <div>
      <Hero
        title={hotel.name}
        startDate={dateRange?.from}
        endDate={dateRange?.to}
      />

      <Toaster />
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
                                      <Image src={guest} alt="guest" />
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
                              <div className="flex flex-col items-start justify-start space-y-3">
                                <p className="flex justify-start text-sm font-semibold text-muted-foreground">
                                  Select Rooms
                                </p>
                                <div className="flex justify-between items-center w-full pr-4">
                                  <div
                                    className="rounded-full cursor-pointer bg-[#E2E8F0] h-8 w-8 flex items-center justify-center p-2"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent card click
                                      decrementCount(roomIndex);
                                    }}
                                  >
                                    <Icons.Minus />
                                  </div>
                                  <p className="">{count[roomIndex]}</p>
                                  <div
                                    className="rounded-full cursor-pointer bg-[#E2E8F0] h-8 w-8 flex items-center justify-center p-2"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent card click
                                      incrementCount(roomIndex);
                                    }}
                                  >
                                    <Icons.Plus />
                                  </div>
                                </div>

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
                <div className="col-span-2 ">
                  <Card className="shadow-xl p-6 gap-4 border border-slate-200 max-w-[370px] text-[16px]">
                    <CardTitle>
                      <span className="text-xl font-medium">
                        ${totalPrice.toFixed(0)}
                      </span>
                      <span className="text-[16px] font-normal text-foreground">
                        / night
                      </span>
                    </CardTitle>
                    <CardContent className="space-y-4 text-sm font-medium p-0">
                      <div className="flex flex-col my-4">
                        <div className="grid grid-cols-2 my-3">
                          <div>Check in</div>
                          <div>Check out</div>
                        </div>
                        <DatePickerWithRange
                          onDateChange={handleDateChange}
                          from={dateRange?.from}
                          to={dateRange?.to}
                        />
                      </div>
                      <div>Guests</div>
                      <Select
                        onValueChange={(value) => setGuests(Number(value))}
                        disabled={userChoices.length === 0}
                        value={guests ? String(guests) : undefined} // Set the value here
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {guestOptions.map((option) => (
                            <SelectItem key={option} value={String(option)}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        className="w-full bg-[#2563EB]"
                        onClick={handleSubmit}
                      >
                        Reserve
                      </Button>
                      <div className="flex flex-col w-full  text-foreground font-normal text-base  space-y-2">
                        <div className="flex justify-between">
                          <span>
                            ${totalPrice.toFixed(0)} x {numberOfDays} days{" "}
                          </span>
                          <span>${(totalPrice * numberOfDays).toFixed(0)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between">
                            <span>Discount </span>
                            <span className="text-[#10B981]">
                              -${discountAmount.toFixed(0)} | {hotel.discount}%
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between  border-t border-slate-200 pt-4">
                          <span>Total</span>
                          <span>${finalPrice.toFixed(0)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </Card>
    </div>
  );
}
