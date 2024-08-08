import React, { useEffect, useState } from "react";

import { ArrowUpRight, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import DateRangePicker from "../AdminComponents/Sub-Components/DateRangePicker";

import AgentLayout from "../Layout/AgentLayout";
import Link from "next/link";
import { Toaster } from "sonner";

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
  totalBookingPrice: number;
}

interface BookingInfo {
  roomType: string;
  rooms: number;
  totalPrice: number;
  beds: Bed[];
  roomCapacity: string;
  totalRoomPrice: string;
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
interface AgentDashboardProps {
  agent: User;
}

export default function AgentDashboard({ agent }: AgentDashboardProps) {
  console.log(agent, "agentssad");

  return (
    <div className="flex flex-col sm:gap-4 ">
      <Toaster />
      <div className="p-6 flex justify-between ">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <span>Manage your details form the dashboard</span>
        </div>

        <DateRangePicker />
      </div>
      <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 ">
        <div className="grid auto-rows-max items-start gap-4 md:gap-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Requested</CardTitle>
              </CardHeader>
              <CardContent className="max-w-lg text-[#020617] text-2xl font-bold text-balance leading-relaxed">
                +12,234
              </CardContent>
              <CardFooter className="text-[#64748B] text-sm -mt-5">
                +19% from last month
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardTitle> Pending</CardTitle>
              </CardHeader>
              <CardContent className="max-w-lg text-[#020617] text-2xl font-bold text-balance leading-relaxed">
                100
              </CardContent>
              <CardFooter className="text-[#64748B] text-sm -mt-5">
                +5.1% from last month
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardTitle> Rejected</CardTitle>
              </CardHeader>
              <CardContent className="max-w-lg text-[#020617] text-2xl font-bold text-balance leading-relaxed">
                100
              </CardContent>
              <CardFooter className="text-[#64748B] text-sm -mt-5">
                +5.1% from last month
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardTitle> Approved(Total Bookings)</CardTitle>
              </CardHeader>
              <CardContent className="max-w-lg text-[#020617] text-2xl font-bold text-balance leading-relaxed">
                +12,234
              </CardContent>
              <CardFooter className="text-[#64748B] text-sm -mt-5">
                +19% from last month
              </CardFooter>
            </Card>
          </div>
          <div className="w-full justify-between flex gap-6">
            <Tabs className="w-full">
              <Card x-chunk="dashboard-05-chunk-3">
                <div className="p-6 flex justify-between items-center">
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-semibold">
                      Bookings
                    </CardTitle>
                    <CardDescription>
                      Recent bookings in Jambo Hotels.
                    </CardDescription>
                  </CardHeader>
                  <button
                    onClick={() =>
                      (window.location.href = "/agent-dashboard/booking")
                    }
                    className=" flex gap-x-1 py-2 px-6 bg-blue-600 h-10 rounded-md text-[#F8FAFC]"
                  >
                    View All
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>
                <CardContent>
                  <Table className="text-[#020617] font-medium">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hotel Name</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agent?.bookings?.map((booking, index: number) => (
                        <TableRow key={index} className="">
                          <TableCell className="leading-7">
                            <div className="">{booking.hotel?.name}</div>
                            <div className="text-[#64748B] font-normal">
                              {booking.hotel?.address}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <strong>${booking.totalBookingPrice}</strong>
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* {hotels?.map((hotel, index) => {
                          return (
                            <TableRow key={index} className="">
                              <TableCell className="leading-7">
                                <div className="">{hotel.name}</div>
                                <div className="text-[#64748B] font-normal">
                                  {hotel.address}
                                </div>
                              </TableCell>
                              

                              <TableCell>
                                {renderTotalPrices(bookings)}
                              </TableCell>
                            </TableRow>
                          );
                        })} */}
                      {/* {bookings.map((booking, index) => {
                                const totalPrices = booking.bookingInfo.reduce(
                                  (sum, room) => sum + room.totalPrice,
                                  0
                                );

                                return (
                                  <TableCell className="text-right" key={index}>
                                    USD {totalPrices}
                                  </TableCell>
                                );
                              })} */}
                      {/* {agent.user.booking.map((agent, index) => (
                          <TableRow key={index}>
                            <TableCell className="leading-7">
                              <div>{agent.name}</div>
                              <div className="text-[#64748B] font-normal">
                                {hotel.address}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                            
                            </TableCell>
                          </TableRow>
                        ))} */}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
