"use client";
import BreadcrumbHome from "@/components/Home-Breadcrumb/BreadcrumbHome";

import LayoutThree from "@/components/Layout/LayoutThree";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import RegisterAgent from "@/components/AgentSignUp/RegisterAgent";
import BuildSomethingGreat from "@/components/AgentSignUp/BuildSomethingGreat";
import Staticpage from "@/components/landing/StaticPage";

import JoinWithUs from "@/components/AgentSignUp/JoinWithUs";
import WorldMap from "@/components/landing/WorldMap";

const AgentSignup = () => {
  return (
    <div>
      <LayoutThree
        imgTitle="Discover Exceptional Hotel Deals for Your Clients"
        description="Welcome to Jambo Travels, the premier platform for travel agencies and agents. Easily book the best hotels at competitive prices and provide your clients with unforgettable experiences. Streamline your booking process with our user-friendly interface, dedicated support, and exclusive B2B rates."
        // buttonName="Agent"
      >
        <div className=" flex justify-center items-center">
          <MaxWidthWrapper className="mb-20 mt-7 space-y-16">
            <RegisterAgent />
            <BuildSomethingGreat />
            <Staticpage />
            <JoinWithUs
            // buttonName="Agent"
            />
            <WorldMap />
          </MaxWidthWrapper>
        </div>
      </LayoutThree>
    </div>
  );
};
export default AgentSignup;
