"use client";
import Image from "next/image";
import { ListFilter, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import Cookies from "js-cookie";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import AgentLayout from "@/components/Layout/AgentLayout";
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

// export default function AgentBookings() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <AgentBooking />
//     </Suspense>
//   );
// }

export default function AgentBookings() {
  // const AgentBooking = () => {
  const [booking, setBooking] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchValue, setSearchValue] = useState<string>("");
  //   const [agent, setAgent] = useState<User[]>([]);
  const [agent, setAgent] = useState<User | null>(null);
  const userDetails = Cookies.get("userDetails");
  const getUserIDFromCookie = () => {
    if (userDetails) {
      try {
        const parsedUserDetails = JSON.parse(userDetails);
        return parsedUserDetails.userID;
      } catch (error) {
        console.error("Error parsing user details from cookie:", error);
        return null;
      }
    } else {
      console.warn("User details not found in cookie");
      return null;
    }
  };
  const agentId = getUserIDFromCookie();
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`/api/getAgentById?id=${agentId}`, {
          method: "GET",
        });
        const data = await response.json();

        setAgent(data.user);
        setBooking(data.user.bookings);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };

    fetchAgents();
  }, []);
  console.log("agents", agent);
  const filteredData = () => {
    let filteredHotels = booking;

    if (activeTab === "accepted") {
      filteredHotels = filteredHotels.filter(
        (item) => item.status === "accepted"
      );
    } else if (activeTab === "requested") {
      filteredHotels = filteredHotels.filter(
        (item) => item.status === "requested"
      );
    } else if (activeTab === "pending") {
      filteredHotels = filteredHotels.filter(
        (item) => item.status === "pending"
      );
    } else if (activeTab === "rejected") {
      filteredHotels = filteredHotels.filter(
        (item) => item.status === "rejected"
      );
    }

    if (searchValue) {
      let filterHotel = agent;

      filteredHotels = filteredHotels.filter(
        (booking) =>
          booking.hotel.name
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          (agent &&
            `${agent.firstName} ${agent.lastName}`
              .toLowerCase()
              .includes(searchValue.toLowerCase()))
      );
    }

    return filteredHotels;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <AgentLayout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger
                value="requested"
                onClick={() => setActiveTab("Requested")}
              >
                Requested
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                onClick={() => setActiveTab("Pending")}
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                onClick={() => setActiveTab("Rejected")}
              >
                Rejected
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                onClick={() => setActiveTab("Accepted")}
              >
                Approved
              </TabsTrigger>
              <TabsTrigger value="all" onClick={() => setActiveTab("All")}>
                All
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 py-2"
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    defaultChecked
                    onClick={() => setActiveTab("all")}
                  >
                    All
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    onClick={() => setActiveTab("accepted")}
                  >
                    Accepted
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    onClick={() => setActiveTab("requested")}
                  >
                    Requested
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" className="h-7 gap-1 py-2 bg-blue-600">
                <PlusCircle className="h-3.5 w-3.5" />
                <Link
                  href="/agent-dashboard/booking/add-booking"
                  className="sr-only sm:not-sr-only sm:whitespace-nowrap"
                >
                  Add Booking
                </Link>
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <div className="p-6 flex justify-between ">
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
                    {filteredData().map((booking, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {booking.hotelID}
                        </TableCell>

                        <TableCell className="font-medium">
                          {booking.hotel?.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "accepted"
                                ? "Approved"
                                : "Requested"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {agent?.firstName} {agent?.lastName}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(booking.bookingStartDate)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(booking.bookingEndDate)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Toaster />
      </main>
    </AgentLayout>
  );
}
