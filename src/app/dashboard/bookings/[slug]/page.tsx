"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Booking } from "@/utils/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { calculateDaysBetweenDates, dateFormatter } from "@/utils/functions";
import { Title } from "@/components/AdminComponents/Sub-Components/ReviewComponents";
import { BedDouble, User, UsersRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { differenceInCalendarDays } from "date-fns";

interface Bed {
  bedType: string;
  numberOfBeds: string;
}

export default function BookingDetails({
  params,
}: {
  params: { slug: string };
}) {
  const [bookingStatus, setBookingStatus] = useState("");
  const [bookingRemarks, setBookingRemarks] = useState("");
  const [isConfirmButtonClicked, setIsConfirmButtonClicked] = useState(false);
  const [booking, setBooking] = useState<Booking>();
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/getBookingById?id=${params.slug}`);
        const data = await response.json();
        setBooking(data.booking);
        setBookingStatus(data.booking.status);
        setBookingRemarks(data.booking.bookingRemarks);
      } catch (error) {
        console.log("Error fetching booking");
        new Error("Error fetching booking information.");
      }
    };
    fetchBooking();
  }, [params.slug]);

  if (!booking) return <>Loading...</>;
  const daysBooked = differenceInCalendarDays(
    booking?.bookingEndDate,
    booking?.bookingStartDate
  );

  const handleConfirm = async () => {
    try {
      setIsConfirmButtonClicked(true);

      const response = await fetch("/api/updateBookingStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          bookingID: booking?.bookingID,
          newStatus: bookingStatus,
          bookingRemarks: bookingRemarks,
          bookingStartDate: booking?.bookingStartDate,
          bookingEndDate: booking?.bookingEndDate,
          bookingInformation: booking?.bookingInfo,
          totalAmount: booking.totalBookingPrice,
          hotelName: booking.hotel.name,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.message(data.message);
        setIsConfirmButtonClicked(false);
      } else {
        toast.error(data.error);
        setIsConfirmButtonClicked(false);
      }
    } catch (error) {
      toast.error("Error updating the booking status");
      console.error("Error updating the booking status", error);
      setIsConfirmButtonClicked(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Booking Details</CardTitle>
          <CardDescription>
            Manage your booking and view their overall details.
          </CardDescription>
          <CardContent className="flex gap-4">
            <Card className="mt-2 border-2 rounded-md shadow-none w-3/5">
              <CardHeader>
                <CardTitle className="text-2xl">{booking.hotel.name}</CardTitle>
                <CardDescription className="text-black">
                  {booking.hotel.address}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-y-6">
                <Image
                  src={booking.hotel.primaryImageLink}
                  alt="Hotel Image"
                  width={700}
                  height={300}
                  className="rounded self-start justify-self-start"
                  priority
                />
                <div className="flex gap-x-5">
                  <div className="w-1/2">
                    <Title>Check In</Title>
                    <div className="border rounded-md px-3 py-2">
                      {dateFormatter(booking.bookingStartDate, "MMMM d, yyyy")}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <Title>Check Out</Title>
                    <div className="border rounded-md px-3 py-2">
                      {dateFormatter(booking.bookingEndDate, "MMMM d, yyyy")}
                    </div>
                  </div>
                </div>
                <div>
                  <Title>Guests</Title>
                  <div className="border rounded-md px-3 py-2">
                    {booking.guests}
                  </div>
                </div>
                {booking.bookingInfo.map((bookInfo, index: number) => {
                  console.log(bookInfo);
                  return (
                    <Card key={index} className="shadow-none rounded-md">
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {bookInfo.roomType}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-4">
                        <div className="col-span-3">
                          <div className="flex items-center gap-8">
                            {bookInfo.beds.map((bedInfo, index: number) => {
                              return (
                                <div key={index} className="flex gap-x-4">
                                  <BedDouble />
                                  <div>
                                    {bedInfo.numberOfBeds} {bedInfo.bedType}
                                  </div>
                                </div>
                              );
                            })}
                            <div className="flex gap-x-4">
                              <UsersRound />
                              <div>{bookInfo.roomCapacity} Guests</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-end text-end text-sm col-span-1">
                          <div>
                            <div>Selected Room</div>
                            <div className="text-base font-medium">
                              {bookInfo.rooms}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">
                              Includes taxes and fees
                            </div>
                            <div className="text-xl font-semibold">
                              ${bookInfo.roomPrice}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                <div>
                  <div className="text-lg font-semibold">Special Reqeusts</div>
                  <div className="border px-3 py-2 rounded w-full min-h-20">
                    {booking.specialRequest}
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="w-2/5 flex flex-col gap-y-6">
              <Card className="mt-2 border-2 rounded-md shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="text-xl font-semibold">Hotel</div>

                  <div className="flex flex-col gap-1">
                    <div className="text-muted-foreground">Contact Person</div>
                    <div>{booking.hotel.contactDetails.name}</div>
                    <div className="text-muted-foreground">Phone Number</div>
                    <div>{booking.hotel.contactDetails.number}</div>
                    <div className="text-muted-foreground">Email</div>
                    <div>{booking.hotel.contactDetails.email}</div>
                  </div>
                  <div className="text-xl font-semibold">Agent</div>
                  <div className="flex items-center gap-x-2">
                    <div className="border rounded-full p-2">
                      <User />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        {`${booking.user.firstName} ${booking.user.lastName}`}
                      </div>
                      <div className="text-xs">Tier Badge</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Phone Number</div>
                    <div>{booking.user.contactNumber}</div>
                    <div className="text-muted-foreground">Email</div>
                    <div>{booking.user.email}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-none rounded-md border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Price Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    {booking.bookingInfo.map((bookInfo, index: number) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div>
                            $
                            <span className="font-semibold">
                              {bookInfo.roomPrice}
                            </span>{" "}
                            x{" "}
                            <span className="font-semibold">{daysBooked}</span>{" "}
                            Nights x{" "}
                            <span className="font-semibold">
                              {bookInfo.rooms}
                            </span>{" "}
                            rooms
                          </div>

                          <div>${bookInfo.totalRoomPrice}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border" />
                  <div className="text-2xl font-semibold flex justify-between">
                    <div>Total</div>
                    <div>${booking.totalBookingPrice}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-none rounded-md border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Booking Status</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-4">
                  <div>
                    <div className="font-medium">Status</div>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-full py-2 px-3 border text-start capitalize">
                          {bookingStatus
                            ? bookingStatus
                            : "Select booking status"}
                        </DropdownMenuTrigger>
                        <div>
                          <DropdownMenuContent className="md:w-[30rem]">
                            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                            {/* <DropdownMenuSeparator /> */}
                            <DropdownMenuItem
                              className="w-full"
                              onClick={() => setBookingStatus("accepted")}
                            >
                              Accept
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="w-full"
                              onClick={() => setBookingStatus("pending")}
                            >
                              Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="w-full"
                              onClick={() => setBookingStatus("rejected")}
                            >
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </div>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Remarks</div>
                    <Textarea
                      id="booking-remarks"
                      onChange={(event) =>
                        setBookingRemarks(event.target.value)
                      }
                      value={bookingRemarks || ""}
                    />
                  </div>
                  <div className="flex gap-x-2.5 items-center justify-end">
                    <Button className="bg-white text-black hover:bg-gray-200">
                      <Link href={"/dashboard/bookings"}>Cancel</Link>
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-900"
                      onClick={handleConfirm}
                      disabled={isConfirmButtonClicked}
                    >
                      Confirm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
      <Toaster />
    </div>
  );
}
