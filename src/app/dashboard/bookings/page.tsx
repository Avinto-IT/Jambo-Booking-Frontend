"use client";
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import DateRangePicker from "../../../components/AdminComponents/Sub-Components/DateRangePicker";
import AdminLayout from "@/components/Layout/AdminLayout";
interface Hotel {
  hotelID: string;
  name: string;
  address: string;
  locationID: string;
  facilities: {
    name: string;
    comment: string;
    subFacilities: string[];
  }[];
  description: string;
  houseRules: { [key: string]: boolean };
  imageLinks: string[];
  primaryImageLink: string;
  isRunning: boolean;
  rooms: {
    type: string;
    price: number;
    capacity: string;
    bed: {
      bedType: string;
      numberOfBeds: string;
    };
    amenities: { [key: string]: boolean };
  }[];
  discount: number;
}

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

interface Agent {
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
}

interface Booking {}
export default function AdminBookingDashboard({}: {}) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/getHotels");
        const data = await response.json();
        setHotels(data.hotels); // Corrected this line
      } catch (error) {
        console.log("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);
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
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/getAgents");
        const data = await response.json();
        setAgents(data.agents);
      } catch (error) {
        console.log("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);
  console.log(bookings);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:gap-4 ">
        <div className="p-6 flex justify-between ">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">Booking Overview</h1>
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
                  <CardDescription className="max-w-lg text-balance leading-relaxed"></CardDescription>
                </CardHeader>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription className="font-medium text-black">
                    Hotels
                  </CardDescription>
                  <CardTitle className="text-4xl">{hotels?.length}</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter>
                  <Progress value={25} aria-label="25% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription className="font-medium text-black">
                    Agents
                  </CardDescription>
                  <CardTitle className="text-4xl">{agents.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription className="font-medium text-black">
                    Bookings
                  </CardDescription>
                  <CardTitle className="text-4xl">{bookings?.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
            </div>

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
                  <button className=" py-2 px-6 bg-blue-400 h-10">
                    View All
                  </button>
                </div>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hotel Name</TableHead>
                        <TableHead className="text-right">Agent Name</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings?.map((booking, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{booking.hotel.name} </TableCell>
                            <TableCell className="text-right">
                              {`${booking.user.firstName} ${booking.user.lastName}`}
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
        </main>
      </div>
    </AdminLayout>
  );
}
