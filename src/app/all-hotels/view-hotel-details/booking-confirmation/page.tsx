"use client";
import LayoutTwo from "@/components/Layout/LayoutTwo";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dot } from "lucide-react";
// import { Hotel } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

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
  discount: number;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingConfirmation />
    </Suspense>
  );
}
function BookingConfirmation() {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  //   const [hotel, setHotel] = useState<Hotel>();
  const [hotel, setHotel] = useState<Hotel>();
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
  return (
    <LayoutTwo imgTitle="Booking Confirmation">
      <div className="flex justify-center items-center">
        <MaxWidthWrapper className="text-[#0F172A]  tracking-tight leading-7">
          <div className="font-semibold text-3xl">Booking Confirmation</div>
          <div className="">{hotel.address}</div>
          <div className="flex items-start py-6 gap-6">
            <div className="w-1/3 space-y-6">
              <Card className="">
                <CardHeader className="space-y-3">
                  <CardTitle>{hotel.name}</CardTitle>
                  <CardDescription className="text-black">
                    {hotel.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-[#64748B] text-sm">
                  {hotel.rooms[0].amenities
                    .slice(0, 5)
                    .map((amenity, amenityIndex) => (
                      <span
                        className="text-sm text-[#64748B] flex items-center gap-x-1"
                        key={amenityIndex}
                      >
                        <div className="whitespace-nowrap">{amenity.name}</div>
                        <Dot />
                      </span>
                    ))}
                </CardContent>
              </Card>
              <Card className="">
                <CardHeader>
                  <CardTitle>Your Price summary</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    ${hotel.rooms[0].price} X 7 nights{" "}
                    <div className="">${hotel.rooms[0].price}</div>
                  </div>

                  <div className="flex justify-between">
                    Weekly Discount
                    <div className="text-[#10B981]">-${hotel.discount}</div>
                  </div>
                  <div className="flex justify-between">
                    Breakfast
                    <div className="">$62</div>
                  </div>
                  <div className="flex justify-between">
                    Dinner
                    <div className="">$83</div>
                  </div>
                  <div className="flex justify-between">
                    Lunch
                    <div className="">$29</div>
                  </div>
                </CardContent>
                <div className=" border-b-2 my-7 mx-5"></div>
                <CardFooter className="flex justify-between text-[#020617] font-semibold text-2xl">
                  Total <div className="">$701</div>
                </CardFooter>
              </Card>

              <Card className="">
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between">
                    <div className="w-1/2 ">
                      <div className="text-[#64748B] text-sm">Check In</div>
                      <div className="font-medium">Thu, Jul 4, 2024</div>
                    </div>
                    <div className="w-1/2 border-l-2 ">
                      <div className=" pl-4 ">
                        <div className="text-[#64748B] text-sm">Check Out</div>
                        <div className="font-medium">Thu, Jul 4, 2024</div>
                      </div>
                    </div>
                  </div>

                  <div className=" ">
                    <div className="text-[#64748B]">Total Length of Stay</div>
                    <div className="font-medium">7 nights</div>
                  </div>
                  <div className=" font-medium">
                    <div className="text-[#64748B] font-normal">
                      You Selected
                    </div>
                    <div className="">3 rooms</div>
                    <div className="">6 x Standard Double or Twin Room</div>
                    <div className="">4 x Suite with Balcony</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Change Your Selection</Button>
                </CardFooter>
              </Card>
            </div>

            <div className="w-2/3 space-y-6">
              <img
                src={hotel.rooms[0].roomImageLinks[0]}
                alt="roomImage"
                className="rounded-lg w-full h-96"
              />
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Special Requests</CardTitle>
                  <CardDescription>
                    Special requests can&apos;t be guaranteed, but the property
                    will do its best to meet your needs. You can always make a
                    special request after your booking is complete.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="font-medium">Description</div>
                  <Textarea
                    id="mssg"
                    placeholder="description"
                    className="min-h-28 mt-2"
                    onChange={(e) => e.target.value}
                  />
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-[#2563EB] text-[white]">
                    Confirm Booking
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </LayoutTwo>
  );
}
