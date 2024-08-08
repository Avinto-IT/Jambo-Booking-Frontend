"use client";
// import { Hotel } from "@/utils/types";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

import ViewOnlyHotel from "@/components/ViewOnlyHotel";

interface Room {
  type: string;
  numberOfRooms: string;
  price: string;
  capacity: string;

  beds: {
    bedType: string;
    numberOfBeds: string;
  }[];

  amenities: { name: string }[];
  roomImageLinks: string[];
}

interface Hotel {
  name: string;
  primaryImageLink: string;
  imageLinks: string[];
  address: string;
  description: string;
  facilities: { name: string; subFacilities: { name: string }[] }[];
  rooms: Room[];
  houseRules: { type: string; details: string }[];
  discount: number;
  hotelID: string;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminViewHotel />
    </Suspense>
  );
}

function AdminViewHotel() {
  const searchParams = useSearchParams();

  const id = searchParams?.get("id");
  const [hotel, setHotel] = useState<Hotel>();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`/api/getHotelById?id=${id}`);
        const data = await response.json();
        setHotel(data.hotel);
      } catch (error) {
        console.log("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  if (!hotel) return <>Loading...</>;

  console.log(hotel.primaryImageLink);
  return <ViewOnlyHotel hotel={hotel} />;
}
