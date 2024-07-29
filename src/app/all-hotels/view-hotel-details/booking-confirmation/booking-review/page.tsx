"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import Lottie from "lottie-react";
import animationdata from "../../../../../../animation/Success.json";
import UserLayout from "@/components/Layout/UserLayout";
import Hero from "@/components/landing/Hero";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout/Layout";
export default function Page() {
  return (
    <UserLayout>
      <div className="flex justify-center">
        <MaxWidthWrapper>
          <div className="flex flex-col justify-center items-center pt-20 pb-40">
            <div className="w-full  flex justify-center h-32 mb-5">
              {/* <Image src={eclipse} alt="eclipse" className=''/> */}
              <Lottie animationData={animationdata} loop={true} />
            </div>
            <p className=" text-3xl font-bold leading-9 my-2">
              Booking Under Review
            </p>
            <div className="text-sm text-[#64748B] text-center w-11/12  leading-7 ">
              Thank you for submitting your booking request with Jambo Hotels
              <br />
              <br />
              Thank you for submitting your booking request! Our team is
              currently reviewing the details. You will be notified as soon as
              the admin approves your request. We appreciate your patience and
              understanding.
            </div>

            <Button
              className="w-2/5 bg-blue-700 hover:bg-blue-900 mt-10 py-4"
              onClick={() => (window.location.href = "/")}
            >
              Go to Dashboard
            </Button>
          </div>
        </MaxWidthWrapper>
      </div>
    </UserLayout>
  );
}
