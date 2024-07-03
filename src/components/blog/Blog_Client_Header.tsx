"use client";
import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function Blog_Client_Header() {
  const [isAllBlogsPage, setIsAllBlogsPage] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAllBlogsPage(window.location.href === "http://localhost:3000/blogs/blog-list");
    }
  }, []);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className=''>
        
          <BreadcrumbLink href="http://localhost:3000/blogs/blog-landing-page">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {isAllBlogsPage ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbPage>Popular Destinations</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="http://localhost:3000/blogs/blog-list">Popular Destinations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Exploring the Seregenti...</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Blog_Client_Header;
