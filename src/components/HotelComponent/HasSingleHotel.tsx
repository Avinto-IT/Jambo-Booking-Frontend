import Image from "next/image";
import {
  Check,
  Cross,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
  X,
} from "lucide-react";
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
import { Hotel } from "@/utils/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { dateFormatter } from "@/utils/functions";
import HotelLayout from "@/components/Layout/HotelLayout";
export default function HasSingleHotel({
  hotels,
  handleViewClick,
  handleEditClick,
  handleDeleteClick,
  hasHotel,
}: {
  hotels: Hotel[];
  handleViewClick: (hotelId: string) => void;
  handleEditClick: (hotelId: string) => void;
  handleDeleteClick: (hotelId: string) => Promise<void>;
  hasHotel: boolean;
}) {
  if (hotels.length === 0 && hasHotel === undefined) {
    return null;
  }
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        {!hasHotel && (
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" className="h-7 gap-1 py-2 bg-blue-600">
                <PlusCircle className="h-3.5 w-3.5" />
                <Link
                  href="/hotel-dashboard/hotels/add-hotel"
                  className="sr-only sm:not-sr-only sm:whitespace-nowrap"
                >
                  Add Hotel
                </Link>
              </Button>
            </div>
          </div>
        )}

        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <div className="p-6 flex justify-between ">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-semibold">Hotels</CardTitle>
                <CardDescription>
                  Manage your hotel and view their overall details.
                </CardDescription>
              </CardHeader>
            </div>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead>Hotel ID</TableHead> */}
                    <TableHead>
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Hotel Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Location
                    </TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Listed at
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotels.map((hotel, index) => {
                    return (
                      <TableRow key={index}>
                        {/* <TableCell className="font-medium">
                          {hotel.hotelID}
                        </TableCell> */}
                        <TableCell className="relative max-w-16">
                          <div className="min-h-16 min-w-16 ">
                            <Image
                              src={hotel.primaryImageLink}
                              alt={""}
                              fill
                              className="rounded-[0.5rem] p-2 object-fit"
                            />
                          </div>
                        </TableCell>

                        <TableCell className="font-medium">
                          {hotel.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              hotel.isApproved === "requested"
                                ? "Requested"
                                : hotel.isApproved === "accepted"
                                ? "Approved"
                                : hotel.isApproved === "pending"
                                ? "Pending"
                                : "Rejected"
                            }
                            className="capitalize"
                          >
                            {hotel.isApproved}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-40">
                          {hotel.address}
                        </TableCell>
                        <TableCell>
                          {hotel.isRunning ? (
                            <Check className="text-[#22C55E]" />
                          ) : (
                            <X className="text-[#EF4444]" />
                          )}
                        </TableCell>
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
                                onClick={() => handleDeleteClick(hotel.hotelID)}
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
  );
}
