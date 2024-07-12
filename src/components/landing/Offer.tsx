import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import fivestar from "../../../public/images/static-from-landing/logos/Group 10490.svg";
import one from "../../../public/images/static-from-landing/logos/Group 10577.svg";
import two from "../../../public/images/static-from-landing/logos/Group 10578.svg";
import three from "../../../public/images/static-from-landing/logos/Group 10579.svg";
import four from "../../../public/images/static-from-landing/logos/Group 10580.svg";
import Image from "next/image";

function Offer() {
  return (
    <div className="flex justify-center items-center bg-[#FFFCF0] my-7">
      <MaxWidthWrapper className="">
        <div className="flex items-center py-14 ">
          <div className="w-1/3 gap-20 mt-7">
            <div className="gap-6">
              <p className="text-2xl font-semibold h-8">What do we offer</p>
              <div className="gap-2.5 w-52 h-14 flex  flex-col justify-evenly  mt-5 ">
                <Image src={fivestar} alt="fivestars" />
                <p className="text-[#0F172A] opacity-[70%] font-semibold">
                  Excellent 5000+ agents
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className=" w-fit relative">
              <div className=" grid grid-cols-2 grid-rows-2 w-full rounded-md gap-8  ">
                <div className="bg-white hover:shadow-xl flex justify-center items-center p-6 pr-7">
                  <div className="gap-15  pt-5">
                    <Image src={one} alt="one" className="mb-3" />
                    <div className="w-72 h-24 gap-2.5 mt-1.5">
                      <p className="text-xl font-semibold">Hotel Choices</p>
                      <p className="text-sm opacity-30 mt-1.5 leading-7">
                        Amet minim mollit non deserunt ullamco est sit aliqua
                        dolor do
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white hover:shadow-xl flex justify-center items-center p-6 pr-7">
                  <div className="gap-15 pt-5">
                    <Image src={two} alt="two" className="mb-3" />
                    <div className="w-72 h-24 gap-2.5 mt-1.5">
                      <p className="text-xl font-semibold">SPA & Wellness</p>
                      <p className="text-sm opacity-30 mt-1.5 leading-7">
                        Amet minim mollit non deserunt ullamco est sit aliqua
                        dolor do
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white hover:shadow-xl flex justify-center items-center p-6 pr-7">
                  <div className="gap-15 pt-5">
                    <Image src={three} alt="three" className="mb-3" />
                    <div className="w-72 h-24 gap-2.5 mt-1.5">
                      <p className="text-xl font-semibold">The Best Room</p>
                      <p className="text-sm opacity-30 mt-1.5 leading-7">
                        Amet minim mollit non deserunt ullamco est sit aliqua
                        dolor do
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white hover:shadow-xl  flex justify-center items-center p-6 pr-7">
                  <div className="gap-15  pt-5">
                    <Image src={four} alt="four" className="mb-3" />
                    <div className="w-72 h-24 gap-2.5 mt-1.5">
                      <p className="text-xl font-semibold">Lounge Bar</p>
                      <p className="text-sm opacity-30 mt-1.5 leading-7">
                        Amet minim mollit non deserunt ullamco est sit aliqua
                        dolor do
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default Offer;
