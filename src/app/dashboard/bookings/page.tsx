"use client";
import React, { useEffect, useState } from "react";
import { Eye, MoreHorizontal, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateRangePicker from "../../../components/AdminComponents/Sub-Components/DateRangePicker";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { dateFormatter } from "@/utils/functions";
import { Input } from "@/components/ui/input";

interface Booking {
  bookingID: string;
  userID: string;
  hotelID: string;
  bookingStartDate: string;
  bookingEndDate: string;
  status: string;
  guests: number;
  bookingInfo: {
    roomType: string;
    rooms: number;
    totalPrice: number;
  };
  hotel: {
    address: string;
    description: string;
    discount: number;
    facilities: string[];
    houseRules: string[];
    imageLinks: string[];
    isRunning: boolean;
    locationID: string;
    name: string;
    primaryImageLink: string;
    rooms: {
      type: string;
      price: number;
      capacity: string;
      bed: {
        bedType: string;
        numberOfBeds: string;
      };
      amenities: string[];
    }[];
  };
  user: {
    agencyName: string | null;
    contactNumber: string;
    dateOfBirth: string;
    email: string;
    firstName: string;
    gradeID: string | null;
    hotelID: string | null;
    lastName: string;
    password: string;
    role: string;
    userID: string;
  };
}

export default function AdminBookingDashboard({}: {}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/getAllBookings");
        const data = await response.json();
        console.log(data, "1123123");
        setBookings(data.bookings);
      } catch (error) {
        console.log("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const calculateBookingStatusCounts = (bookings: Booking[]) => {
    const statusCounts = {
      accepted: 0,
      rejected: 0,
      pending: 0,
      requested: 0,
    };

    bookings.forEach((booking) => {
      switch (booking.status) {
        case "accepted":
          statusCounts.accepted++;
          break;
        case "rejected":
          statusCounts.rejected++;
          break;
        case "pending":
          statusCounts.pending++;
          break;
        case "requested":
          statusCounts.requested++;
          break;
        default:
          break;
      }
    });

    return statusCounts;
  };

  const bookingCounts = calculateBookingStatusCounts(bookings);
  const filteredBookings = bookings
    .filter((booking) => {
      if (activeTab === "all") return true;
      return booking.status === activeTab;
    })
    .filter((booking) => {
      const hotelName = booking.hotel.name.toLowerCase();
      const agentName =
        `${booking.user.firstName} ${booking.user.lastName}`.toLowerCase();
      const searchLower = searchValue.toLowerCase();
      return hotelName.includes(searchLower) || agentName.includes(searchLower);
    });
  return (
    <div>
      <div className="flex flex-col sm:gap-4 ">
        <div className="p-6 flex justify-between ">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">Booking Overview</h1>
            <span>Manage your details form the dashboard</span>
          </div>

          {/* <DateRangePicker />  */}
          {/* Discuss with Sakar dai about the date range picker */}
        </div>
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 ">
          <div className="grid auto-rows-max items-start gap-4 md:gap-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="" x-chunk="dashboard-05-chunk-0">
                <CardHeader className="pb-3">
                  <CardTitle>Requested</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed"></CardDescription>
                  <CardTitle className="text-4xl">
                    {bookingCounts.requested}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription className="font-medium text-black">
                    Pending
                  </CardDescription>
                  <CardTitle className="text-4xl">
                    {bookingCounts.pending}
                  </CardTitle>
                </CardHeader>
                <CardFooter></CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription className="font-medium text-black">
                    Rejected
                  </CardDescription>
                  <CardTitle className="text-4xl">
                    {bookingCounts.rejected}
                  </CardTitle>
                </CardHeader>
                <CardFooter></CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription className="font-medium text-black">
                    Accepted
                  </CardDescription>
                  <CardTitle className="text-4xl">
                    {bookingCounts.accepted}
                  </CardTitle>
                </CardHeader>
                <CardFooter></CardFooter>
              </Card>
            </div>

            <Tabs
              defaultValue="all"
              className="flex flex-col gap-y-2"
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="self-start bg-slate-200">
                <TabsTrigger value="requested" className="py-1.5">
                  Requested
                </TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                <Card x-chunk="dashboard-05-chunk-3">
                  <div className="p-6 flex justify-between items-center">
                    <CardHeader className="p-0">
                      <CardTitle className="text-2xl font-semibold">
                        Bookings
                      </CardTitle>
                      <CardDescription>
                        Manage your booking and view their overall details.
                      </CardDescription>
                    </CardHeader>
                    <div className="relative ml-auto flex-1 md:grow-0">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                      />
                    </div>
                  </div>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hotel ID</TableHead>
                          <TableHead>Hotel Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Agent Name</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings?.map((booking, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{booking.hotelID} </TableCell>

                              <TableCell>{booking.hotel.name} </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    booking.status === "requested"
                                      ? "Requested"
                                      : booking.status === "accepted"
                                      ? "Approved"
                                      : booking.status === "pending"
                                      ? "Pending"
                                      : "Rejected"
                                  }
                                  className="capitalize"
                                >
                                  {booking.status}
                                </Badge>
                              </TableCell>

                              <TableCell className="">
                                {`${booking.user.firstName} ${booking.user.lastName}`}
                              </TableCell>
                              <TableCell>
                                {dateFormatter(booking.bookingStartDate)}
                              </TableCell>
                              <TableCell>
                                {dateFormatter(booking.bookingEndDate)}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">
                                        Toggle menu
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(
                                          `bookings/${booking.bookingID}`
                                        )
                                      }
                                    >
                                      View
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
