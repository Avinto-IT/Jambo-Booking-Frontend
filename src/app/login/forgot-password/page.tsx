"use client";
import Forgot_Password from "@/components/Logins/ForgotPassword";
import Image from "next/image";
import React, { useState } from "react";
import jamboicon from "../../../../public/images/login/Logo.svg";
import CheckEmail from "@/components/Logins/CheckEmail";
import SetNewPassword from "@/components/Logins/SetNewPassword";
import PasswordChangedSuccess from "@/components/Logins/PasswordChangedSuccess";
import LoginHeader from "@/components/Logins/LoginHeader";

const page: React.FC = () => {
  const [currentComponent, setCurrentComponent] = useState("A");
  const components = ["A", "B", "C", "D"];
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
      {currentComponent !== "D" && (
        <LoginHeader
          handleBack={() =>
            currentComponent === "A"
              ? (window.location.href = "http://localhost:3000/login")
              : handleBack()
          }
        />
      )}

      <div className="w-full grid grid-cols-2 ">
        {currentComponent === "A" && (
          <Forgot_Password onButtonClick={() => handleNextComponent("B")} />
        )}
        {currentComponent === "B" && (
          <CheckEmail onButtonClick={() => handleNextComponent("C")} />
        )}
        {currentComponent === "C" && (
          <SetNewPassword onButtonClick={() => handleNextComponent("D")} />
        )}
        {currentComponent === "D" && <PasswordChangedSuccess />}

        <div className=" relative">
          <img
            src="https://s3-alpha-sig.figma.com/img/6d51/a99e/aa95fe53ed8bd181c312716544d23f80?Expires=1721001600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VkflaXHKVW4UBj3-3fvrlR-kxQmleCy25xRp-RVF8L9IN-NgbJpk4gR-PAP7WHt~X6OoiUnThur-RfX-4yp91ewRMNLyBL5wN5-WMvuVtIzwulA5jg5e6EbTusV90OzhAEvApw-RbTk0A7FEngNj97jPYGZq9mBoejy72lSxktKpEmd2wS45d-cPr0MiPrqi2YOH~jJ13q6fWwf1IH0OV0feIIfQYXFoU1hqp7Nt0PwwQfeVEL9xXQfVOfqYLHpIE6SLsoTCEyeLU9HxChIPyimOqPDQZQLLU-sLtUxvVnYO317hWVvtbBsPpzEhu0Hu7z8Q4A8NNz0XZDdZtJ8qlQ__"
            alt="Image"
            className="w-full object-cover h-screen"
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

export default page;
