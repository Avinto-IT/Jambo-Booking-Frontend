"use client";
import React, { useEffect, useState } from "react";

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
  discount: { startDate: string; endDate: string; discountPercentage: string };
  hotelID: string;
}

export default function Page({ params }: { params: { slug: string } }) {
  const [hotel, setHotel] = useState<Hotel>();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`/api/getHotelById?id=${params.slug}`);
        const data = await response.json();
        setHotel(data.hotel);
      } catch (error) {
        console.log("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);
  if (!hotel) return <>Loading...</>;

  return <ViewOnlyHotel hotel={hotel} />;
}
