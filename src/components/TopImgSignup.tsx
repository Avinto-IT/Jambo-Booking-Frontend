import React from "react";

import Image from "next/image";
import { Button } from "./ui/button";

interface TopImgProp {
  title: string;
  description: string;
  // buttonName: string;
  topimg: string;
}
const TopImgSignUp: React.FC<TopImgProp> = ({
  title,
  description,
  // buttonName,
  topimg,
}) => {
  return (
    <div className="">
      <div className="w-full relative mb-14">
        <Image
          src={topimg}
          alt="topimage"
          className=" w-full "
          priority={true}
          // objectFit="cover"
        />
        <div className="absolute inset-0 w-full h-full bg-[#020617] opacity-75"></div>
        <div className="w-7/12 absolute top-24 left-10 flex flex-col  text-white  ">
          <div className=" text-5xl font-semibold">{title}</div>
          <br />
          <p className="leading-7 mt-2">{description}</p>
          <br />
          {/* <Button className="  w-40 h-12 bg-blue-600 hover:bg-blue-800">
            Signup as {buttonName}
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default TopImgSignUp;
