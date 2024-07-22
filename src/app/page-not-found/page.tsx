"use client";
import Layout from "@/components/Layout/Layout";

import { Button } from "@/components/ui/button";
import React from "react";
import notFoundImage from "../../../public/images/not-found.svg";
import Image from "next/image";

export default function Page() {
  return (
    <div>
      <Layout>
        <main className="flex-grow max-w-[1920px] justify-center items-center">
          <div className="flex flex-col justify-center items-center pt-20 pb-40">
            <div className="w-full  flex justify-center mb-5">
              <Image src={notFoundImage} alt="notfoundimage" className="" />
            </div>
            <p className=" text-3xl font-bold leading-9 my-2">
              Page not found!
            </p>
            <div className="text-sm text-[#64748B] text-center w-2/3  leading-5 ">
              <p className="leading-7">
                It happens! Let’s get you back on track.
                <br /> The page you’re looking for does not exist or has been
                moved please go back to the Home page
              </p>
            </div>
            <Button
              className="w-1/4 bg-blue-700 hover:bg-blue-900 mt-10 py-4"
              onClick={() => (window.location.href = "/")}
            >
              Back to Home
            </Button>
          </div>
        </main>
      </Layout>
    </div>
  );
}
