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

import { Agent, Booking, Hotel } from "@/utils/types";
import HotelLayout from "../Layout/HotelLayout";
import { Button } from "../ui/button";
export default function HotelDashboard({
  hotels,
  bookings,
  agents,
}: {
  hotels: Hotel[];
  bookings: Booking[];
  agents: Agent[];
}) {
  return (
    <HotelLayout>
      <div className="flex flex-col sm:gap-4 ">
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
                  <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
                <CardContent className="max-w-lg text-[#020617] text-2xl font-bold text-balance leading-relaxed">
                  +12,234
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardTitle> Pending</CardTitle>
                </CardHeader>
                <CardContent className="max-w-lg text-[#020617] text-2xl font-bold text-balance leading-relaxed">
                  100
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardTitle> Rejected</CardTitle>
                </CardHeader>
                <CardContent className="max-w-lg text-[#020617] text-2xl font-bold text-balance leading-relaxed">
                  100
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardTitle> Approved(Total Bookings)</CardTitle>
                </CardHeader>
                <CardContent className="max-w-lg text-[#020617] text-2xl font-bold text-balance leading-relaxed">
                  +12,234
                </CardContent>
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
                    <Button className=" flex gap-x-1 bg-blue-600 hover:bg-blue-800">
                      View All
                      <ArrowUpRight className="h-5 w-5" />
                    </Button>
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
                        {hotels?.slice(0, 5).map((hotel, index) => {
                          return (
                            <TableRow key={index} className="">
                              <TableCell className="leading-7">
                                <div className="">{hotel.name}</div>
                                <div className="text-[#64748B] font-normal">
                                  {hotel.address}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {/* {`${booking.user.firstName} ${booking.user.lastName}`} */}
                                USD {hotel.rooms[0].price}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </HotelLayout>
  );
}
