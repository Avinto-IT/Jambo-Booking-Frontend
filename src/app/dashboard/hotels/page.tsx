"use client";
import Image from "next/image";
import { ListFilter, MoreHorizontal, PlusCircle, Search } from "lucide-react";

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
import AdminLayout from "@/components/Layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Hotel } from "@/utils/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { dateFormatter } from "@/utils/functions";

export default function HotelsDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchValue, setSearchValue] = useState<string>("");

  const router = useRouter();

  const filteredData = () => {
    let filteredHotels = hotels;

    if (activeTab === "Active") {
      filteredHotels = filteredHotels.filter((item) => item.isRunning);
    } else if (activeTab === "Inactive") {
      filteredHotels = filteredHotels.filter((item) => !item.isRunning);
    }

    if (searchValue) {
      filteredHotels = filteredHotels.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          hotel.address.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return filteredHotels;
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/getHotels");
        const data = await response.json();
        setHotels(data.hotels); // Corrected this line
      } catch (error) {
        console.log("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  const handleViewClick = (hotelId: string) => {
    router.push(`/dashboard/hotels/view-hotel?id=${hotelId}`);
  };
  const handleEditClick = (hotelId: string) => {
    router.push(`/dashboard/hotels/update-hotel?id=${hotelId}`);
  };

  const handleDeleteClick = async (hotelId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this hotel?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/deleteHotelAdmin?hotelID=${hotelId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure you have the token stored in localStorage
        },
      });

      if (response.ok) {
        setHotels((prevHotels) =>
          prevHotels.filter((hotel) => hotel.hotelID !== hotelId)
        );
        toast.message("Hotel deleted successfully");
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.log("Error deleting hotel:", error);
      toast.message("Error deleting hotel");
    }
  };
  console.log(hotels);
  return (
    <AdminLayout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="requested">Requested</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
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
                    onClick={() => setActiveTab("All")}
                  >
                    All
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    onClick={() => setActiveTab("Active")}
                  >
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    onClick={() => setActiveTab("Inactive")}
                  >
                    Inactive
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" className="h-7 gap-1 py-2 ">
                <PlusCircle className="h-3.5 w-3.5" />
                <Link
                  href="/dashboard/hotels/add-hotel"
                  className="sr-only sm:not-sr-only sm:whitespace-nowrap"
                >
                  Add Hotel
                </Link>
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <div className="p-6 flex justify-between ">
                <CardHeader className="p-0">
                  <CardTitle className="text-2xl font-semibold">
                    Hotels
                  </CardTitle>
                  <CardDescription>
                    Manage your hotel and view their overall details.
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
                      <TableHead className="hidden md:table-cell">
                        Location
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Listed at
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData().map((hotel, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {hotel.hotelID}
                          </TableCell>

                          <TableCell className="font-medium">
                            {hotel.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                hotel.isRunning ? "Approved" : "Rejected"
                              }
                            >
                              {hotel.isRunning ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{hotel.address}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {dateFormatter(hotel.addedDate)}
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
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleViewClick(hotel.hotelID)}
                                >
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditClick(hotel.hotelID)}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteClick(hotel.hotelID)
                                  }
                                >
                                  Delete
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
              {/* <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>32</strong> products
                </div>
              </CardFooter> */}
            </Card>
          </TabsContent>
        </Tabs>
        <Toaster />
      </main>
    </AdminLayout>
  );
}
