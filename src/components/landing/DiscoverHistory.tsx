"use client";
import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";

import Image from "next/image";

import discoverimg from "../../../public/images/static-from-landing/image.svg";

function DiscoverHistory() {
  return (
    <>
      <div className=" flex justify-center items-center">
        <div className="h-full gap-6">
          <div className="  w-full flex justify-between rounded-2xl bg-[#F0FDFA] ">
            <div className=" w-5/12 ">
              <Image src={discoverimg} alt="discoverimg" className="h-full " />
            </div>
            <div className="w-6/12  flex justify-center items-center pr-20 pl-5  py-16">
              <div className="   gap-5  flex flex-col">
                <p className=" font-semibold text-2xl">Discover our History</p>
                <p className="text-[#334155] leading-7 text-base">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s{" "}
                </p>

                <p className="text-[#334155] leading-7 text-base">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy Lorem Ipsum is simply dummy text of the
                  printing and typesetting industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </>
  );
}

export default DiscoverHistory;
