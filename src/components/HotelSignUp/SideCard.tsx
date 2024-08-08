import React from "react";
import Image from "next/image";
import tick from "../../../public/images/Tickmark.svg";
import { Card } from "../ui/card";
import { CircleCheck } from "lucide-react";

export default function SideCard() {
  return (
    <Card className="bg-[#FEFCE8] rounded-lg py-6 space-y-1 pr-5 ">
      <div className="flex justify-start items-start pl-5 gap-4 ">
        <CircleCheck className="w-8 h-8" />
        <div className="">
          <p className="text-xl font-semibold">
            Increased Bookings and Revenue
          </p>
          <p className="text-[#6B7280]">
            Our extensive network of travel agents ensures higher visibility and
            increased bookings.
          </p>
        </div>
      </div>
      <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
        <CircleCheck className="w-8 h-8" />
        <div className="">
          <p className="text-xl font-semibold">Enhanced Market Reach</p>
          <p className="text-[#6B7280]">
            Connect with a worldwide network of travel agencies and agents,
            expanding your market reach.
          </p>
        </div>
      </div>
      <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
        <CircleCheck className="w-8 h-8" />
        <div className="">
          <p className="text-xl font-semibold">Improved Guest Satisfaction</p>
          <p className="text-[#6B7280]">
            Provide seamless booking experiences with real-time room
            availability and instant confirmations.
          </p>
        </div>
      </div>
      <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
        <CircleCheck className="w-8 h-8" />
        <div className="">
          <p className="text-xl font-semibold">
            Comprehensive Performance Analytics
          </p>
          <p className="text-[#6B7280]">
            Access in-depth reports on booking trends, guest demographics, and
            market performance.
          </p>
        </div>
      </div>
    </Card>
  );
}
