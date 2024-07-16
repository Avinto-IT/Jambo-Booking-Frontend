import React from "react";
import hotelroom from "../../../public/images/register/KPI_Image.svg";
import Image from "next/image";

function BuildSomethingGreat() {
  return (
    <div className="bg-[#F0FDFA] p-12 space-y-5">
      <div className="w-8/12 leading-7 tracking-tight">
        <p className="text-3xl font-semibold">Build something great</p>
        <br />
        <p className="text-[#475467]">
          Easily book the best hotels at competitive prices and provide your
          clients. Streamline your booking process with our user-friendly
          interface, dedicated support, and exclusive B2B rates.
        </p>
      </div>
      <div className="flex">
        <div className="w-1/2 flex items-center justify-start pr-20">
          <div className="grid grid-cols-2 grid-rows-2  tracking-tighter text-center gap-10">
            <div className="flex flex-col justify-center items-center space-y-2">
              <p className="text-[#2563EB] text-3xl font-semibold">4,000+</p>
              <p className="text-lg font-semibold">Global customers</p>
              <p className="text-[#475467]">
                We've helped over 4,000 amazing global companies
              </p>
            </div>
            <div className="flex flex-col justify-center items-center space-y-2">
              <p className="text-[#2563EB] text-3xl font-semibold">600%</p>
              <p className="text-lg font-semibold">Return on investment</p>
              <p className="text-[#475467]">
                Our customers have reported an average of ~600% ROI.s
              </p>
            </div>
            <div className="flex flex-col justify-center items-center space-y-2">
              <p className="text-[#2563EB] text-3xl font-semibold">10k</p>
              <p className="text-lg font-semibold">Global customers</p>
              <p className="text-[#475467]">
                We've helped over 4,000 amazing global companies
              </p>
            </div>
            <div className="flex flex-col justify-center items-center space-y-2">
              <p className="text-[#2563EB] text-3xl font-semibold">600%</p>
              <p className="text-lg font-semibold">Return on investment</p>
              <p className="text-[#475467]">
                Our customers have reported an average of ~600% ROI.s
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <Image src={hotelroom} alt="hotelroom" />
        </div>
      </div>
    </div>
  );
}

export default BuildSomethingGreat;
