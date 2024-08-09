"use client";

import React, { useEffect, useState } from "react";
import { Agent, Booking, Hotel, UserDetails } from "@/utils/types";
import Cookies from "js-cookie";
import withAuth from "@/lib/loginAuth";
import HotelDashboard from "@/components/dashboard/HotelDashboard";
import { Toaster } from "sonner";

const Dashboard: React.FC = ({}) => {
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
    const getUserDetails = () => {
      const userDetails = Cookies.get("userDetails");
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

    const userID = getUserDetails();

    if (userID) {
      const fetchBookings = async () => {
        try {
          const response = await fetch(
            `/api/getBookingByHotelUser?userID=${userID}`
          );
          const data = await response.json();
          // console.log(data, "1123123");
          setBookings(data.bookings);
        } catch (error) {
          console.log("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, []);
  console.log(bookings, "bookings");
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

  return (
    <>
      <Toaster />
      <HotelDashboard hotels={hotels} agents={agents} bookings={bookings} />
    </>
  );
};

export default withAuth(Dashboard);
