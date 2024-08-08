import Image from "next/image";
import React from "react";
import joinus from "../../../public/images/register/CTA_section.svg";
import { Button } from "../ui/button";

interface JoinWithUsProp {
  // buttonName: string;
}
const JoinWithUs: React.FC<JoinWithUsProp> = (
  {
    // buttonName
  }
) => {
  return (
    <div className=" relative max-h-fit -space-y-40">
      <div className="relative w-full h-fit flex items-center">
        <Image src={joinus} alt="joinus" className="w-full h-auto" />
        <div className="absolute inset-0 w-full h-full bg-black opacity-50"></div>
      </div>
      <div className="flex justify-center h-fit ">
        <div className=" w-2/3 relative bottom-20 flex flex-col justify-center items-center text-center text-[#F8FAFC] leading-7 space-y-4">
          <p className="text-3xl font-semibold">Join with us</p>
          <p className="text-[#F8FAFC] font-light opacity-85">
            Easily book the best hotels at competitive prices and provide your
            clients. Streamline your booking process with our user-friendly
            interface, dedicated support, and exclusive B2B rates.
          </p>
          {/* <Button className="  w-40 h-12 bg-blue-600 hover:bg-blue-800">
            Sign up as {buttonName}
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default JoinWithUs;
