"use client";
import AgentLayout from "@/components/Layout/AgentLayout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
interface User {
  userID: string;
  agencyName: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  affiliatedHotel: string | null;
  contactNumber: string;
  role: string;
  dateOfBirth: string;
  address: string;
  toursCompleted: number;
  gradeID: string | null;
  hotelID: string | null;
  bookings: Booking[];
}

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
}

interface BookingInfo {
  roomType: string;
  rooms: number;
  totalPrice: number;
  beds: Bed[];
  roomCapacity: string;
  roomPrice?: string; // Optional, present only in some cases
}

interface Bed {
  bedType: string;
  numberOfBeds: string;
}

interface Hotel {
  name: string;
  address: string;
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

  const id = searchParams?.get("id");
  //   const [hotel, setHotel] = useState<Hotel>();
  const [booking, setBooking] = useState<User>();

  return (
    <AgentLayout>
      <Card x-chunk="dashboard-06-chunk-0">
        <div className="p-6 flex justify-between ">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-semibold">
              Booking Details
            </CardTitle>
            <CardDescription>
              Manage your booking and view their overall details.
            </CardDescription>
          </CardHeader>
        </div>
      </Card>
    </AgentLayout>
  );
}
