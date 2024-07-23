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

import userImg from "../../../public/images/head/search.svg";
import Image from "next/image";

function BlogHeader() {
  const [isClient, setIsClient] = useState(false);
  const [isBlogDetailsPage, setIsBlogDetailsPage] = useState(false);
  const [pageName, setPageName] = useState("");

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setIsBlogDetailsPage(window.location.href === "/blog-details");
      if (window.location.href === "/add-blogs") {
        setPageName("Add Blogs");
      } else if (window.location.href.includes("/text-editor")) {
        setPageName("Edit Blogs");
      }
    }
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server side
  }

  return (
    <div className="navbar px-6 flex justify-between h-10 w-full items-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {isBlogDetailsPage ? (
              <BreadcrumbPage>Blogs</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink href="/blog-details">Blogs</BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            )}
          </BreadcrumbItem>
          {!isBlogDetailsPage && pageName && (
            <BreadcrumbItem>
              <BreadcrumbPage>{pageName}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <Image src={userImg} alt="user" className="h-10" />
    </div>
  );
}

export default BlogHeader;
