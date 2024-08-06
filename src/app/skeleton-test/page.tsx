import HotelDetailSkeleton from "@/components/AllSkeletons/HotelDetailSkeleton";
import LandingSkeleton from "@/components/AllSkeletons/LandingSkeleton";
import SingleBlogPageSkeleton from "@/components/AllSkeletons/SingleBlogPageSkeleton";
import Hero from "@/components/landing/Hero";
import Layout from "@/components/Layout/Layout";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";

function page() {
  return (
    <Layout>
      <Hero />
      <div className="flex justify-center items-center text-[#111827]">
        <MaxWidthWrapper className="my-14 space-y-14">
          <LandingSkeleton />
          {/* <HotelDetailSkeleton /> */}
        </MaxWidthWrapper>
      </div>
    </Layout>
  );
}

export default page;
