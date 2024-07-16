import React from "react";
import multimg from "../../../public/images/register/Contents.svg";
import Image from "next/image";

function GettingStarted() {
  return (
    <div className="bg-[#F0FDFA]">
      <div className="flex p-12">
        <div className="w-7/12 flex items-center justify-start pr-10 space-y-5">
          <div className="leading-7 tracking-tight">
            <p className="text-3xl font-semibold">We’re just getting started</p>
            <br />
            <p className="text-[#475467]">
              Partnering with Jambo Hotels significantly increases bookings and
              overall revenue. Their platform is user-friendly and their support
              is exceptional. Partnering with Jambo Hotels significantly
              increases bookings and overall revenue. Their platform is
              user-friendly and their support is exceptional.
            </p>
          </div>
        </div>
        <div className="w-5/12">
          <Image src={multimg} alt="images" />
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;
