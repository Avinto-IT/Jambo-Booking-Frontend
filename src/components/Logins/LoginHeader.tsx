"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeft, ChevronLeftIcon } from "lucide-react";

import Image from "next/image";

interface LoginHeaderprops {
  handleBack: () => void;
}
const LoginHeader: React.FC<LoginHeaderprops> = ({ handleBack }) => {
  const [isLoginPage, setIsLoginPage] = useState(false);
  useEffect(() => {
    if (window.location.href === "/login") {
      setIsLoginPage(true);
    }
  }, []);

  return (
    <Breadcrumb className="w-40 h-0 relative inset-9 ">
      <BreadcrumbList>
        <BreadcrumbItem>
          {isLoginPage ? (
            <BreadcrumbLink href="/" className="flex items-center">
              {" "}
              <ChevronLeft className="mr-1" />
              Go to Homepage
            </BreadcrumbLink>
          ) : (
            <BreadcrumbLink
              onClick={handleBack}
              className="flex items-center hover:cursor-pointer"
            >
              {" "}
              <ChevronLeft className="mr-1" />
              Back
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default LoginHeader;
