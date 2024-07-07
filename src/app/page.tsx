"use client";
import Layout from "@/components/Layout/Layout";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Bloglanding from "@/components/blog/Bloglanding";
import Explore_Africa from "@/components/landing/Explore and offers/Explore_Africa";
import Find_Hotels from "@/components/landing/Explore and offers/Find_Hotels";
import Offers_for_you from "@/components/landing/Explore and offers/Offers_for_you";
import Hero from "@/components/landing/Hero";
import Offer from "@/components/landing/Offer";
import Static_page from "@/components/landing/Static_page";
import Worldmap from "@/components/landing/Worldmap";
import { useEffect, useState } from "react";

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
    [key: string]: {
      type: string;
      price: number;
      capacity: string;
      bed: {
        bedType: string;
        numberOfBeds: string;
      };
      amenities: { [key: string]: boolean };
    };
  };
  discount: number;
}

interface Location {
  locationID: string;
  city: string;
  country: string;
}

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/getHotels");
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.log("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/getLocation");
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.log("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <Layout>
      <Hero />
      <Offers_for_you/>
      <Explore_Africa/>
      <Find_Hotels/>
      <Static_page/>
      <Offer/>
      <Bloglanding/>
      <Worldmap/>



    </Layout>
  );
}
