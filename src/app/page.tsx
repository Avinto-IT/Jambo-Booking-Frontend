"use client";
import Layout from "@/components/Layout/Layout";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import BlogLanding from "@/components/blog/BlogLanding";
import ExploreAfrica from "@/components/landing/explore/ExploreAfrica";
import FindHotels from "@/components/landing/explore/FindHotels";
import Offersforyou from "@/components/landing/explore/OffersForYou";
import Hero from "@/components/landing/Hero";
import Offer from "@/components/landing/Offer";
import StaticPage from "@/components/landing/StaticPage";
import WorldMap from "@/components/landing/WorldMap";
import { useEffect, useState } from "react";
import DiscoverHistory from "@/components/landing/DiscoverHistory";
import Lottie from "lottie-react";
import loadingData from "../../animation/Hotel Loading.json";
import LandingSkeleton from "@/components/AllSkeletons/LandingSkeleton";

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
      <div className="flex justify-center items-center text-[#111827]">
        <MaxWidthWrapper className="my-14 space-y-14">
          <Offersforyou />
          <ExploreAfrica />

          <FindHotels />

          <StaticPage />

          <DiscoverHistory />
          <br />
          <Offer />
          <BlogLanding />
          <br />
          <WorldMap />
        </MaxWidthWrapper>
      </div>
    </Layout>
  );
}
