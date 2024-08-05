"use client";
import AgentLayout from "@/components/Layout/AgentLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import bed from "../../../../../public/images/Bed.svg";
import guest from "../../../../../public/images/Guest.svg";
import Image from "next/image";
import { Minus, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { calculateDaysBetweenDates } from "@/utils/functions";
interface HotelContactDetails {
  name: string;
  position: string;
  email: string;
  number: string;
  facebook: string;
  instagram: string;
  linkedin: string;
}

// Define an interface for Hotel
interface Hotel {
  name: string;
  address: string;
  primaryImageLink: string;
  contactDetails: HotelContactDetails;
}

// Define an interface for Bed
interface Bed {
  bedType: string;
  numberOfBeds: string;
}

// Define an interface for Booking Info
interface BookingInfo {
  roomType: string;
  rooms: number;
  totalRoomPrice: number;
  beds: Bed[];
  roomCapacity: string;
  roomPrice: string;
}

// Define an interface for User
interface User {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
}

// Define an interface for Booking
interface Booking {
  bookingID: string;
  userID: string;
  hotelID: string;
  bookingStartDate: string;
  bookingEndDate: string;
  status: string;
  guests: number;
  bookingInfo: BookingInfo[];
  hotel: Hotel;
  user: User;
}
interface ApiResponse {
  booking: Booking;
}
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgentBookingDetails />
    </Suspense>
  );
}
function AgentBookingDetails() {
  const searchParams = useSearchParams();
  const [count, setCount] = useState<number[]>([]);
  const id = searchParams?.get("id");
  const [hotel, setHotel] = useState<Hotel>();
  const [booking, setBooking] = useState<Booking>();
  const [user, setUser] = useState<User>();
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (booking && booking.bookingInfo) {
      setCount(new Array(booking.bookingInfo.length).fill(0));
    }
  }, [booking]);
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/getBookingById?id=${id}`, {
          method: "GET",
        });
        const data: ApiResponse = await response.json();

        console.log("Fetched data:", data); // Debugging line to check the data structure

        setBooking(data.booking);
        setHotel(data.booking.hotel);
        setUser(data.booking.user);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };

    fetchHotel();
  }, [id]);

  useEffect(() => {
    if (booking) {
      console.log(booking, "bokiboki");
    }
  }, [booking, hotel]); // Dependency array to log whenever booking or hotel changes
  //   const incrementCount = (index: number) => {
  //     setCount((prevCounts) => {
  //       const newCounts = [...prevCounts];
  //       newCounts[index] += 1;
  //       return newCounts;
  //     });
  //   };

  //   const decrementCount = (index: number) => {
  //     setCount((prevCounts) => {
  //       const newCounts = [...prevCounts];
  //       if (newCounts[index] > 0) {
  //         newCounts[index] -= 1;
  //       }
  //       return newCounts;
  //     });
  //   };
  const incrementCount = (index: number) => {
    setCount((prevCount) => {
      const newCount = [...prevCount];
      newCount[index] += 1;
      return newCount;
    });
  };

  const decrementCount = (index: number) => {
    setCount((prevCount) => {
      const newCount = [...prevCount];
      if (newCount[index] > 0) {
        newCount[index] -= 1;
      }
      return newCount;
    });
  };

  function Formatteddate(value: string) {
    const date = new Date(value);
    return date.toLocaleDateString("en-US");
  }

  useEffect(() => {
    if (booking && booking.bookingInfo) {
      const nights = calculateDaysBetweenDates(
        booking.bookingStartDate,
        booking.bookingEndDate
      );
      const totalPrice = booking.bookingInfo.reduce((acc, price) => {
        return acc + price.totalRoomPrice;
      }, 0);
      setTotal(totalPrice);
    }
  }, [booking]);
  return (
    <AgentLayout>
      <Card x-chunk="dashboard-06-chunk-0" className="tracking-tighter">
        <div className="p-6 flex justify-between ">
          <CardHeader className="">
            <CardTitle className="text-2xl font-semibold">
              Booking Details
            </CardTitle>
            <CardDescription>
              Manage your booking and view their overall details.
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent className="flex p-6 gap-7 w-full">
          <Card className="w-2/3 p-6 gap-6">
            {booking && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    {hotel?.name}
                  </CardTitle>
                  <CardDescription className="text-[#0F172A] text-base">
                    {hotel?.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-[#0F172A]">
                  <img
                    src={hotel?.primaryImageLink}
                    alt="primaryImage"
                    className="w-full h-80  rounded-md"
                  />
                  <div className="flex w-full">
                    <div className="w-1/2 space-y-3">
                      <Label className="font-semibold">Check In</Label>
                      <Input value={Formatteddate(booking.bookingStartDate)} />
                    </div>
                    <div className="w-1/2 space-y-3">
                      <Label className="font-semibold">Check Out</Label>
                      <Input value={Formatteddate(booking.bookingEndDate)} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold">Guests</Label>
                    <Input type="number" value={booking.guests} />
                  </div>

                  {booking.bookingInfo.map((room, index) => {
                    console.log(room, "rooom");
                    return (
                      <Card
                        key={index}
                        className="p-5 space-y-2 flex justify-between "
                      >
                        <div className="space-y-2">
                          <CardTitle className="text-xl">
                            {room.roomType}
                          </CardTitle>

                          <div className="flex gap-8 items-center ">
                            <div className="flex gap-4">
                              <Image src={bed} alt="bed" />
                              {room.beds.map((bed, bedIndex) => {
                                return (
                                  <div className="flex " key={bedIndex}>
                                    {bed.numberOfBeds}&nbsp;
                                    {bed.bedType} bed
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex gap-4">
                              <Image src={guest} alt="guest" />
                              {room.roomCapacity} Guests
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex flex-col items-start justify-start space-y-3">
                          <p className="flex justify-start text-sm font-semibold">
                            Select Rooms
                          </p>
                          <div className="flex justify-between items-center w-full pr-4">
                            <div
                              className="rounded-full cursor-pointer bg-[#E2E8F0] h-8 w-8 flex items-center justify-center p-2"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                decrementCount(index);
                              }}
                            >
                              <Minus className="" />
                            </div>
                            <p className="">{count[index]}</p>
                            <div
                              className="rounded-full cursor-pointer bg-[#E2E8F0] h-8 w-8 flex items-center justify-center p-2"
                              // onClick={() => incrementCount(roomIndex)}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                incrementCount(index);
                              }}
                            >
                              <Plus />
                            </div>
                          </div>

                          <p className="text-[#64748B] text-sm">
                            Includes taxes and fees{" "}
                          </p>
                          <p className="flex justify-end w-full text-xl font-semibold">
                            USD {room.roomPrice}
                          </p>
                        </div> */}
                      </Card>
                    );
                  })}
                </CardContent>
              </>
            )}
          </Card>
          <div className="space-y-6 w-1/3 ">
            <Card className="h-fit p-6 gap-6 space-y-6">
              <CardTitle className="text-2xl font-semibold">
                Contact Details
              </CardTitle>
              <CardTitle className="text-xl">Hotel</CardTitle>
              <div className="space-y-2">
                <CardDescription className="">Contact Person</CardDescription>
                <p className="">{hotel?.contactDetails.name}</p>
                <CardDescription className="">Phone Number</CardDescription>
                <p className="">{hotel?.contactDetails.number}</p>
                <CardDescription className="">Email</CardDescription>
                <p className="">{hotel?.contactDetails.email}</p>
              </div>
              <CardTitle className="text-xl">Agent</CardTitle>

              <div className=" flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="overflow-hidden rounded-full"
                    >
                      <User />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/agent-dashboard/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {user?.firstName}&nbsp;
                {user?.lastName}
              </div>
              <div className="space-y-2">
                <CardDescription className="">Phone Number</CardDescription>
                <p className="">{user?.contactNumber}</p>
                <CardDescription className="">Email</CardDescription>
                <p className="">{user?.email}</p>
              </div>
            </Card>
            <Card className=" h-fit p-6 gap-6 space-y-6">
              <CardTitle className="text-2xl font-semibold">
                Price Summary
              </CardTitle>
              <div className="space-y-3">
                {booking?.bookingInfo.map((price, priceIndex) => {
                  const nights = calculateDaysBetweenDates(
                    booking.bookingStartDate,
                    booking.bookingEndDate
                  );
                  return (
                    <div key={priceIndex} className="flex justify-between">
                      <div className="flex">
                        USD&nbsp; <strong>{price.roomPrice}</strong>
                        &nbsp;x&nbsp;
                        <strong>{nights}</strong> &nbsp;nights x&nbsp;
                        <strong>{price.rooms}</strong>&nbsp; rooms
                      </div>
                      <div className="flex">
                        USD &nbsp;<strong>{price.totalRoomPrice}</strong>
                      </div>
                    </div>
                  );
                })}

                <div className="w-full border-b-2 border-gray-100 pt-5"></div>
                <div className="text-2xl flex justify-between   pt-5">
                  <strong className="">Total</strong>
                  <strong className="">USD {total}</strong>
                </div>
              </div>
            </Card>
            <Card className=" h-fit p-6 gap-6 space-y-6">
              <CardTitle className="text-2xl font-semibold">
                Booking Status
              </CardTitle>
              <div className="space-y-3 ">
                <p className="">Status</p>

                <strong className=" ">{booking?.status}</strong>
              </div>
              {/* <div className="flex justify-end gap-3 ">
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </div> */}
            </Card>
          </div>
        </CardContent>
      </Card>
    </AgentLayout>
  );
}
