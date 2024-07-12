import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import semicircle from "../../../public/images/static-from-landing/Vector.svg";
import Image from "next/image";
import logos from "../../../public/images/static-from-landing/Logos.svg";
import discoverimg from "../../../public/images/static-from-landing/image.svg";

function Static_page() {
  return (
    <div className="flex justify-center items-center text-[#111827]">
      <MaxWidthWrapper className=" ">
        <div className="outline outline-gray-100 outline-1 w-7/12 relative -mb-2 top-20"></div>
        <div className="   py-20 ">
          <div className="flex justify-between ">
            <div className="w-1/2 py-10 gap-6 h-64  ">
              <div className="gap-2 h-24">
                <p className="text-3xl font-semibold leading-9 tracking-tight mb-2 ">
                  Explore Over 170 Hotels in Africa
                </p>
                <p className="h-14 leading-7">
                  Choose from a diverse selection of over 170 hotels, offering a
                  variety of options to suit every traveler's needs and
                  preferences.
                </p>
              </div>
              <br />
              <Button className="w-32 h-14 gap-10 bg-[#2563EB] ">
                Search Hotels
              </Button>
            </div>

            <div className="  w-1/2 h-72 flex justify-center items-center align-middle relative -top-1">
              <div className="  h-full relative flex justify-center ">
                <Image
                  src={semicircle}
                  alt="semicircle"
                  className="w-11/12 h-64 "
                />
                <Image
                  src={logos}
                  alt="semicircle"
                  className="absolute top-10 h-48 p-5"
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" flex justify-center items-center">
          <div className="h-full gap-6 py-6">
            <div className="  w-full flex justify-between rounded-2xl bg-[#F0FDFA] ">
              <div className=" w-5/12 ">
                <Image
                  src={discoverimg}
                  alt="discoverimg"
                  className="h-full "
                />
              </div>
              <div className="w-6/12  flex justify-center items-center pr-20 pl-5  py-16">
                <div className="   gap-5  flex flex-col">
                  <p className=" font-semibold text-2xl">
                    Discover our History
                  </p>
                  <p className="text-[#334155] leading-7 text-base">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's{" "}
                  </p>

                  <p className="text-[#334155] leading-7 text-base">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
      </MaxWidthWrapper>
    </div>
  );
}

export default Static_page;
