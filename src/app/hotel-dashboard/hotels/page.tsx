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
import { Hotel } from "@/utils/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { dateFormatter } from "@/utils/functions";
import HotelLayout from "@/components/Layout/HotelLayout";
import HasMultipleHotel from "@/components/HotelComponent/HasMultipleHotel";
import HasSingleHotel from "@/components/HotelComponent/HasSingleHotel";

export default function HotelsDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hasMultipleHotel, setHasMultipleHotel] = useState<boolean | null>(
    null
  );
  const [hasHotel, setHasHotel] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getUserDetails = () => {
      const userDetails = Cookies.get("userDetails");
      if (userDetails) {
        try {
          const parsedUserDetails = JSON.parse(userDetails);
          setHasMultipleHotel(parsedUserDetails.hasMultipleHotel);
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

    const userID = getUserDetails();
    if (userID) {
      const fetchHotels = async () => {
        try {
          const response = await fetch(`/api/getHotelByUser?id=${userID}`);
          const data = await response.json();
          setHotels(data.hotels); // Corrected this line
          setHasHotel(data.hotels.length > 0);
        } catch (error) {
          console.log("Error fetching hotels:", error);
        }
      };
      fetchHotels();
    }
  }, []);

  const handleViewClick = (hotelId: string) => {
    router.push(`/hotel-dashboard/hotels/${hotelId}`);
  };

  const handleEditClick = (hotelId: string) => {
    router.push(`/hotel-dashboard/hotels/update-hotel?id=${hotelId}`);
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

  if (hasMultipleHotel === null) {
    return <div>Loading...</div>;
  }

  return (
    <HotelLayout>
      {hasMultipleHotel ? (
        <HasMultipleHotel
          hotels={hotels}
          handleViewClick={handleViewClick}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      ) : (
        <HasSingleHotel
          hotels={hotels}
          handleViewClick={handleViewClick}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          hasHotel={hasHotel}
        />
      )}
    </HotelLayout>
  );
}
