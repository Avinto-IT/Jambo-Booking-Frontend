import React from "react";
import topimg from "../../public/images/head/Header Image.svg";
import Image from "next/image";

interface topimgprop {
  title: string;
}
const Topimg: React.FC<topimgprop> = ({ title }) => {
  return (
    <div className="">
      <div className="w-full relative mb-14">
        <Image src={topimg} alt="topimage" className=" obj ect-cover w-full " />
        <div className="absolute inset-0 w-full h-full bg-[#020617] opacity-75"></div>
        <div className="w-full absolute top-1/2 flex items-center justify-center">
          <div className=" text-white  text-5xl font-semibold">{title}</div>
        </div>
      </div>
    </div>
  );
};

export default Topimg;
