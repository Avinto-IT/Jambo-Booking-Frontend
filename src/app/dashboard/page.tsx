"use client";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import React, { useEffect, useState } from "react";
import { Agent, Booking, Hotel, UserDetails } from "@/utils/types";

import withAuth from "@/lib/loginAuth";

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

  return <AdminDashboard hotels={hotels} agents={agents} bookings={bookings} />;
};

export default withAuth(Dashboard);
