"use state";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from "react";

function Breadcrumb_Home() {
  const [name, setName] = useState("");
  useEffect(() => {
    if (window.location.href === "http://localhost:3000/privacy-policy")
      setName("Privacy Policy");
    else if (window.location.href === "http://localhost:3000/about-us")
      setName("About Us");
    else if (window.location.href === "http://localhost:3000/contact")
      setName("Contact Us");
  }, []);

  return (
    <Breadcrumb className="mb-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>{name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumb_Home;
