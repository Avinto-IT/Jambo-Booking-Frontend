"use client";

import LayoutThree from "@/components/Layout/LayoutThree";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import Worldmap from "@/components/landing/WorldMap";
import JoinWithUs from "@/components/AgentSignUp/JoinWithUs";
import RegisterHotel from "@/components/HotelSignUp/RegisterHotel";
import GettingStarted from "@/components/HotelSignUp/GettingStarted";

const HotelSignup = () => {
  return (
    <div>
      <LayoutThree
        imgTitle="Sign Up and Transform Your Hotel’s 
Booking Experience"
        description="As a hotel, you need a reliable booking platform that not only drives reservations but also offers valuable insights to grow your business. Here’s why [Your Company Name] is the perfect partner for you:"
        buttonName="Hotel"
      >
        <div className=" flex justify-center items-center">
          <MaxWidthWrapper className="mb-20 mt-7 space-y-16">
            <RegisterHotel />
            <GettingStarted />

            <JoinWithUs buttonName="Hotel" />
            <Worldmap />
          </MaxWidthWrapper>
        </div>
      </LayoutThree>
    </div>
  );
};
export default HotelSignup;
