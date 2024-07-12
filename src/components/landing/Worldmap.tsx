import React from "react";
import world from "../../../public/images/static-from-landing/Locations.svg";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Image from "next/image";

function Worldmap() {
  return (
    <div className="flex justify-center items-center mt-10  text-[#0F172A] ">
      <MaxWidthWrapper className="py-20">
        <div className=" bg-[#F0FDF4] w-full flex justify-center items-center   rounded-2xl">
          <div className="">
            <div className=" flex flex-col justify-center items-center  mt-20">
              <p className="font-semibold text-3xl leading-10 tracking-tight">
                Find Your Hotels
              </p>
              <p className="mt-4 leading-7">
                Find your desired hotel near your desired trip location
              </p>
            </div>
            <Image
              src={world}
              alt="locations"
              className=" gap-2.5 pb-14 pt-5 px-20"
            />
          </div>
        </div>
        {/* <div className="relative bottom-[650px]   flex flex-col items-center">
                <p className="font-semibold text-2xl leading-9 tracking-[-0.0075em]">Find Your Hotels</p>
                <p className="mt-2">Find your desired hotel near your desired trip location</p>
            </div> */}
      </MaxWidthWrapper>
    </div>
  );
}

export default Worldmap;
