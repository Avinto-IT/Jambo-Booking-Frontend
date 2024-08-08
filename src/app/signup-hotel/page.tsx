"use client";

import LayoutThree from "@/components/Layout/LayoutThree";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import JoinWithUs from "@/components/AgentSignUp/JoinWithUs";
import RegisterHotel from "@/components/HotelSignUp/RegisterHotel";
import GettingStarted from "@/components/HotelSignUp/GettingStarted";
import WorldMap from "@/components/landing/WorldMap";

const HotelSignup = () => {
  return (
    <div>
      <LayoutThree
        imgTitle="Sign Up and Transform Your Hotels Booking Experience"
        description="As a hotel, you need a reliable booking platform that not only drives reservations but also offers valuable insights to grow your business. Heres why [Your Company Name] is the perfect partner for you:"
        // buttonName="Hotel"
      >
        <div className=" flex justify-center items-center">
          <MaxWidthWrapper className="mb-20 mt-7 space-y-16">
            <RegisterHotel />
            <GettingStarted />

            <JoinWithUs
            //  buttonName="Hotel"
            />
            <WorldMap />
          </MaxWidthWrapper>
        </div>
      </LayoutThree>
    </div>
  );
};
export default HotelSignup;
