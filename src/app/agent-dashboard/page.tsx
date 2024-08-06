"use client";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import React, { useEffect, useState } from "react";
// import { Agent,  } from "@/utils/types";
import Cookies from "js-cookie";
import withAuth from "@/lib/loginAuth";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import AgentBookings from "./booking/page";

interface User {
  userID: string;
  agencyName: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  affiliatedHotel: string | null;
  contactNumber: string;
  role: string;
  dateOfBirth: string;
  address: string;
  toursCompleted: number;
  gradeID: string | null;
  hotelID: string | null;
  bookings: Booking[];
}

interface Booking {
  bookingID: string;
  userID: string;
  hotelID: string;
  bookingStartDate: string;
  bookingEndDate: string;
  status: string;
  guests: number;
  bookingInfo: BookingInfo[];
  hotel: Hotel;
}

interface BookingInfo {
  roomType: string;
  rooms: number;
  totalPrice: number;
  beds: Bed[];
  roomCapacity: string;
  totalRoomPrice: string;
  roomPrice?: string; // Optional, present only in some cases
}

interface Bed {
  bedType: string;
  numberOfBeds: string;
}

interface Hotel {
  name: string;
  address: string;
}

const Dashboard: React.FC = ({}) => {
  const [agent, setAgent] = useState<User | null>(null);

  const userDetails = Cookies.get("userDetails");
  const getUserIDFromCookie = () => {
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
  const agentId = getUserIDFromCookie();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`/api/getAgentById?id=${agentId}`, {
          method: "GET",
        });
        const data = await response.json();
        setAgent(data.user);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };

    fetchAgents();
  }, []);

  return <>{agent && <AgentDashboard agent={agent} />} </>;
};

export default withAuth(Dashboard);
