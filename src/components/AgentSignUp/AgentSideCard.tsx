import React from "react";
import Image from "next/image";
import tick from "../../../public/images/Tickmark.svg";
import { Card } from "../ui/card";
import { CircleCheck } from "lucide-react";
export default function SideCard() {
  return (
    <Card className="bg-[#FEFCE8] rounded-lg py-6 space-y-1 pr-5 ">
      <div className="flex justify-start items-start pl-5 gap-4 ">
        <Image src={tick} alt="tickmark" className="pt-1" />
        <div className="">
          <p className="text-xl font-semibold">Increased Booking Efficiency</p>
          <p className="text-[#6B7280]">
            Our intuitive platform reduces the time spent on each booking,
            allowing you to serve more clients in less time.
          </p>
        </div>
      </div>
      <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
        <Image src={tick} alt="tickmark" className="pt-1" />
        <div className="">
          <p className="text-xl font-semibold">Higher Client Satisfaction</p>
          <p className="text-[#6B7280]">
            Access exclusive B2B rates and special deals not available to the
            general public.
          </p>
        </div>
      </div>
      <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
        <Image src={tick} alt="tickmark" className="pt-1" />
        <div className="">
          <p className="text-xl font-semibold">Enhanced Profitability</p>
          <p className="text-[#6B7280]">
            Earn higher commissions with our competitive commission. Utilize our
            tools to suggest additional services.
          </p>
        </div>
      </div>
      <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
        <Image src={tick} alt="tickmark" className="pt-1" />
        <div className="">
          <p className="text-xl font-semibold">Dedicated Support</p>
          <p className="text-[#6B7280]">
            Our dedicated support team is available around the clock to assist
            with any issues or queries.
          </p>
        </div>
      </div>
    </Card>
  );
}
