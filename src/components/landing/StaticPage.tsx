"use client";
import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import semicircle from "../../../public/images/static-from-landing/Logos_1.svg";
import Image from "next/image";

function StaticPage() {
  return (
    <div>
      <div className="outline outline-gray-100 outline-1 w-7/12 relative  top-7"></div>

      <div className="     ">
        <div className="flex justify-between ">
          <div className="w-1/2 py-10 gap-6 h-64 mt-5  ">
            <div className="gap-2 h-24">
              <p className="text-3xl font-semibold leading-9 tracking-tight mb-2 ">
                Explore Over 170 Hotels in Africa
              </p>
              <p className="h-14 leading-7">
                Choose from a diverse selection of over 170 hotels, offering a
                variety of options to suit every traveler&apos;s needs and
                preferences.
              </p>
            </div>
            <br />
            <Button className="w-32 h-14 gap-10  ">Search Hotels</Button>
          </div>

          <div className="  w-1/2 h-72 flex justify-center items-center align-middle relative -top-1">
            <div className="  h-full relative flex justify-center ">
              <Image src={semicircle} alt="semicircle" className=" " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaticPage;
