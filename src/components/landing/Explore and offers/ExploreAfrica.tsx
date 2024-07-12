import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";
import one from "../../../../public/images/explore-east-africa/one.svg";
import two from "../../../../public/images/explore-east-africa/two.svg";
import three from "../../../../public/images/explore-east-africa/three.svg";
import four from "../../../../public/images/explore-east-africa/four.svg";
import five from "../../../../public/images/explore-east-africa/five.svg";
import six from "../../../../public/images/explore-east-africa/six.svg";
import Image from "next/image";

function ExploreAfrica() {
  return (
    <div className="flex justify-center items-center text-[#0F172A]">
      <MaxWidthWrapper className="px-14">
        <div className=" gap-2">
          <p className=" text-3xl font-semibold tracking-tight leading-10 mb-1">
            Explore East Africa
          </p>
          <p className="leading-7 tracking-tight ">
            These popular destinations have a lot to offer
          </p>
        </div>
        <div className="grid grid-cols-6 gap-4 mt-7 ">
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={one}
              alt="one"
              className=" transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={two}
              alt="one"
              className=" transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={three}
              alt="one"
              className=" transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={four}
              alt="one"
              className=" transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
            />
          </div>{" "}
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={five}
              alt="one"
              className=" transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={six}
              alt="one"
              className=" transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default ExploreAfrica;
