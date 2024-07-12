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
import blogsdata from "../../../data/blog.json";

interface BlogClientHeaderProps {
  index: string;
}
const BlogClientHeader: React.FC<BlogClientHeaderProps> = ({ index }) => {
  const [isAllBlogsPage, setIsAllBlogsPage] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAllBlogsPage(
        window.location.href === "http://localhost:3000/blogs/blog-list"
      );
    }
  }, []);

  const getBlogTitle = (): string => {
    const blog = blogsdata.blogs.find((blog) => blog.ID === index);
    return blog ? blog.blogTitle : "";
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="">
          <BreadcrumbLink href="http://localhost:3000">Home</BreadcrumbLink>
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
              <BreadcrumbLink href="http://localhost:3000/blogs/blog-list">
                Popular Destinations
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {getBlogTitle().length > 23
                  ? getBlogTitle().substring(0, 23) + "..."
                  : getBlogTitle()}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BlogClientHeader;
