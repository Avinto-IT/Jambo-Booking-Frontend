"use client";
import Profile from "@/components/AgentSettings/Profile";
import AgentLayout from "@/components/Layout/AgentLayout";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import PrivacyDetails from "@/components/AgentSettings/PrivacyDetails";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
export default function Page() {
  const [agent, setAgent] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState("profile");

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

  return (
    <Card className="w-10/12 text-[#020617] space-y-5 pb-5">
      <CardHeader className="border-b-2 w-full">
        <CardTitle className="text-2xl font-semibold leading-8">
          Settings
        </CardTitle>
        <CardDescription className="">
          Manage your account settings and set e-mail preferences.
        </CardDescription>
      </CardHeader>
      <div className="w-full flex pr-32 gap-8 pb-1.5 ">
        <div className="w-1/4 text-sm leading-5 font-medium space-y-2">
          <div
            className="py-2 px-4 gap-2.5 rounded-md hover:bg-[#F1F5F9]"
            onClick={() => setCurrentView("profile")}
          >
            Profile
          </div>
          <div
            className={`py-2 px-4 gap-2.5 rounded-md  hover:bg-[#F1F5F9]`}
            onClick={() => setCurrentView("privacyDetails")}
          >
            Privacy Details
          </div>
          <Dialog>
            <DialogTrigger className="w-full flex justify-start py-2 px-4 gap-2.5 rounded-md hover:bg-[#F1F5F9] ">
              Logout
            </DialogTrigger>
            <DialogContent className="px-10">
              <DialogHeader className="gap-1  py-4 px-6">
                <DialogTitle className="text-3xl ">Logout</DialogTitle>
                <DialogDescription className="text-[#64748B]">
                  Are you sure you would like to logout?
                </DialogDescription>
              </DialogHeader>
              <div className="flex outlline  outline-black gap-2">
                <Button variant="outline">Discard</Button>
                {/* <Button asChild className="bg-blue-700 hover:bg-blue-800"> */}
                <Button asChild variant="default">
                  <Link href="/login">Logout</Link>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {currentView === "profile" && <Profile agent={agent} />}
        {currentView === "privacyDetails" && <PrivacyDetails agent={agent} />}
      </div>
    </Card>
  );
}
