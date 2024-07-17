"use client";
import ForgotPassword from "@/components/Logins/ForgotPassword";
import Image from "next/image";
import React, { useState } from "react";
import jamboicon from "../../../../public/images/login/Logo.svg";
import CheckEmail from "@/components/Logins/CheckEmail";
import SetNewPassword from "@/components/Logins/SetNewPassword";
import PasswordChangedSuccess from "@/components/Logins/PasswordChangedSuccess";
import LoginHeader from "@/components/Logins/LoginHeader";
import heroImage from "../../../../public/images/login/brand_1.svg";

const Page: React.FC = () => {
  const [currentComponent, setCurrentComponent] = useState("forgotPassword");
  const components = [
    "forgotPassword",
    "checkEmail",
    "setNewPassword",
    "passwordChangedSuccess",
  ];
  const handleNextComponent = (component: string) => {
    setCurrentComponent(component);
  };

  const handleBack = () => {
    const currentIndex = components.indexOf(currentComponent);
    if (currentIndex > 0) {
      setCurrentComponent(components[currentIndex - 1]);
    }
  };

  return (
    <div className=" h-screen">
      {currentComponent !== "passwordChangedSuccess" && (
        <LoginHeader
          handleBack={() =>
            currentComponent === "forgotPassword"
              ? (window.location.href = "/login")
              : handleBack()
          }
        />
      )}

      <div className="w-full grid grid-cols-2 ">
        {currentComponent === "forgotPassword" && (
          <ForgotPassword
            onButtonClick={() => handleNextComponent("checkEmail")}
          />
        )}
        {currentComponent === "checkEmail" && (
          <CheckEmail
            onButtonClick={() => handleNextComponent("setNewPassword")}
          />
        )}
        {currentComponent === "setNewPassword" && (
          <SetNewPassword
            onButtonClick={() => handleNextComponent("passwordChangedSuccess")}
          />
        )}
        {currentComponent === "passwordChangedSuccess" && (
          <PasswordChangedSuccess />
        )}

        <div className=" relative">
          <Image
            src={heroImage}
            alt="Image"
            className="h-screen object-cover w-full"
          />
          <Image
            src={jamboicon}
            alt="icon"
            className="absolute top-20 right-20 z-10"
          />
          {/* <div className="h-full w-full bg-[#2563EB] relative inset-0 opacity-50"></div> */}
          <div className="absolute top-0 left-0 w-full h-full bg-[#2563EB] opacity-80 z-0 "></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
