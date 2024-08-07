"use client";

import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Hotel, Room } from "../all-hotels/view-hotel-details/page";
import { Dot } from "lucide-react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import Image from "next/image";

interface BookingInfo {
  roomType: string;
  rooms: number;
}

interface BookingData {
  userID: string;
  hotelID: string;
  bookingStartDate: string;
  bookingEndDate: string;
  guests: number;
  bookingInfo: BookingInfo[];
  totalPrice: number;
  numberOfDays: number;
  discountAmount: number;
  finalPrice: number;
  userChoices: { room: Room; count: number }[];
}

const token = localStorage.getItem("token");

export default function BookingReviewPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const router = useRouter();

  const [request, setRequest] = useState<string>("");

  const handleChangeSelection = () => {
    if (bookingData) {
      const params = new URLSearchParams({
        id: bookingData.hotelID,
        checkin: format(new Date(bookingData.bookingStartDate), "yyyy-MM-dd"),
        checkout: format(new Date(bookingData.bookingEndDate), "yyyy-MM-dd"),
      });
      router.push(`/all-hotels/view-hotel-details?${params.toString()}`);
    }
  };

  const handleCancel = () => {
    router.push("/all-hotels");
  };

  const handleSubmit = async () => {
    if (!bookingData) return;

    const {
      userID,
      hotelID,
      bookingStartDate,
      bookingEndDate,
      guests,
      bookingInfo,
    } = bookingData;

    const payload = {
      userID,
      hotelID,
      bookingStartDate,
      bookingEndDate,
      guests,
      bookingInfo,
      specialRequest: request,
    };

    try {
      const response = await fetch("/api/bookRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Booking successful!");
        Cookies.remove("bookingData"); // Remove bookingData from cookies
        router.push("/booking-confirm");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Booking failed");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      toast.error("Internal Server Error");
    }
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          `/api/getHotelById?id=${bookingData?.hotelID}`
        );
        const data = await response.json();
        setHotel(data.hotel);
        console.log(data.hotel, "hotel data");
      } catch (error) {
        console.log("Error fetching hotels:", error);
      }
    };
    if (bookingData?.hotelID) {
      fetchHotels();
    }
  }, [bookingData]);

  useEffect(() => {
    if (!bookingData) {
      const storedBookingData = Cookies.get("bookingData");
      if (storedBookingData) {
        setBookingData(JSON.parse(storedBookingData));
      }
    }
  }, [bookingData]);

  if (!bookingData) {
    return <div>Loading...</div>;
  }

  const firstRoomWithImage = hotel?.rooms.find(
    (room) => room.roomImageLinks && room.roomImageLinks.length > 0
  );
  const firstImageLink = firstRoomWithImage?.roomImageLinks[0];

  return (
    <div className="py-12">
      <Toaster />
      <MaxWidthWrapper className="max-w-screen-2xl">
        <div className="space-y-3">
          <div className="text-3xl font-semibold">Booking Confirmation</div>
          <div className="">{hotel?.address}</div>
        </div>
        <div className="grid grid-cols-6 gap-6 py-6">
          <div className="col-span-2 flex flex-col h-full gap-6">
            <Card className="p-6">
              <CardTitle className="flex flex-col gap-2">
                <div className="text-2xl font-semibold">{hotel?.name}</div>
                <div className="text-base font-normal text-gray-700">
                  {hotel?.address}
                </div>
              </CardTitle>
              <CardContent className="p-0 mt-6">
                {hotel && hotel.facilities && (
                  <div className="flex justify-start flex-wrap text-gray-500">
                    {hotel.facilities
                      .slice(0, 5)
                      .map((facility, facilityIndex) => (
                        <div key={facilityIndex} className="flex items-center">
                          {facility.name}
                          {facilityIndex <
                            Math.min(4, hotel.facilities.length - 1) && (
                            <span className="mx-2">
                              <Dot />
                            </span>
                          )}
                        </div>
                      ))}
                    {hotel.facilities.length > 5 && (
                      <div className="flex items-center">
                        <Dot />
                        {hotel.facilities.length - 5}+ Amenities
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardTitle className="flex flex-col">
                <div className="text-2xl font-semibold">Your Price Summary</div>
              </CardTitle>
              <CardContent className="p-0 mt-6">
                <div className="flex flex-col w-full  text-foreground font-normal text-base  space-y-2">
                  <div className="flex justify-between">
                    <span>
                      ${bookingData.totalPrice.toFixed(0)} x{" "}
                      {bookingData.numberOfDays} days{" "}
                    </span>
                    <span>
                      $
                      {(
                        bookingData.totalPrice * bookingData.numberOfDays
                      ).toFixed(0)}
                    </span>
                  </div>
                  {bookingData.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount </span>
                      <span className="text-[#10B981]">
                        -${bookingData.discountAmount.toFixed(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between  border-t border-slate-200 pt-4 text-2xl">
                    <span>Total</span>
                    <span>${bookingData.finalPrice.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardTitle className="flex flex-col">
                <div className="text-2xl font-semibold">Booking Details</div>
              </CardTitle>
              <CardContent className="p-0 mt-6 space-y-4">
                <div className="flex h-full justify-between">
                  <div className="border-r pr-6">
                    <div className="text-sm text-gray-500">Check In</div>
                    <div className="text-lg font-medium">
                      {format(
                        new Date(bookingData.bookingStartDate),
                        "EEE, MMM d, yyyy"
                      )}
                    </div>
                  </div>
                  <div className="">
                    <div className="text-sm text-gray-500">Check Out</div>
                    <div className="text-lg font-medium">
                      {format(
                        new Date(bookingData.bookingEndDate),
                        "EEE, MMM d, yyyy"
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">
                    Total Length of Stay
                  </div>
                  <div className="text-lg font-medium">
                    {bookingData.numberOfDays} nights
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">You Selected</div>
                  <div className="text-lg font-medium">
                    {bookingData.bookingInfo.reduce(
                      (acc, info) => acc + info.rooms,
                      0
                    )}{" "}
                    room(s)
                  </div>
                  {bookingData.bookingInfo.map((info, index) => (
                    <div key={index}>
                      {info.rooms} x {info.roomType}
                    </div>
                  ))}
                </div>
                <div className="flex justify-start mt-4">
                  <Button onClick={handleChangeSelection} variant="outline">
                    Change Your Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-4 flex flex-col  pr-[20%] gap-6 ">
            <div className="relative w-full h-[500px]">
              {firstImageLink && (
                <Image
                  src={firstImageLink}
                  alt="First room image"
                  fill
                  className="rounded-lg object-cover"
                />
              )}
            </div>
            <div className="size-full">
              <Card className="p-6 space-y-6">
                <CardTitle>
                  <div className="text-2xl font-semibold">Special Requests</div>
                  <div className="text-muted-foreground font-normal text-sm">
                    Special requests can`&apos;`t be guaranteed, but the
                    property will do its best to meet your needs. You can always
                    make a special request after your booking is complete.
                  </div>
                </CardTitle>
                <CardContent className="p-0 space-y-3">
                  <p>Description</p>
                  <Textarea
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder="Enter your request here..."
                    maxLength={400}
                    className="min-h-[150px]"
                  />
                  <div className="flex w-full justify-end gap-2">
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>

                    <Button onClick={handleSubmit}>Confirm Booking</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
