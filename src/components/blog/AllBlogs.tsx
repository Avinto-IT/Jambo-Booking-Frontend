"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { useEffect, useState } from "react";
import blogsData from "../../../data/blog.json";
import BlogClientHeader from "@/components/blog/BlogClientHeader";
import arrow from "../../../public/images/head/arrow-up-right.svg";
import Image from "next/image";

import { PaginationBlogs } from "./PaginationBlogs";
import TagRemover from "./TagRemover";
import topimg from "../../../public/images/head/Header_Image.svg";
import ListOfBlogs from "../AllSkeletons/ListOfBlogs";

// Define the interface for your blog data
interface Blog {
  ID: string;
  POST_ID: string;
  blogTitle: string;
  content: string;
  images: string[];
  hero_img: string;
  created_date: string;
  active: boolean;
  caption: string;
  user_id: string;
  author: string;
  titlecontent: string;
  intro?: string; // Optional
  description?: string; // Optional
  conclusion?: string; // Optional
}

function AllBlogs() {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    if (blogsData && blogsData.blogs) {
      const sortedData = blogsData.blogs.sort((a, b) => {
        return parseInt(a.POST_ID) - parseInt(b.POST_ID);
      });
      setData(sortedData);
      setLoading(false);
    }
  }, [blogsData]);

  const itemsPerPage = 9; // Define the number of items per page
  const [currentPage, setCurrentPage] = useState(1); // State for current page

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get the items for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col items-center mb-10">
      <div className="w-full relative mb-14  h-80">
        <Image
          src={topimg}
          alt="topimage"
          // className=" object-cover "
          priority={true}
          fill={true}
          objectFit="cover"
        />

        <div className="absolute inset-0 w-full h-full bg-[#020617] opacity-75"></div>
        <div className="w-full absolute top-1/2 flex items-center justify-center">
          <div className=" text-white  text-5xl font-semibold">
            Travel Destinations for you
          </div>
        </div>
      </div>
      <MaxWidthWrapper>
        <BlogClientHeader index="" />
        {loading ? (
          <div className="py-10">
            <ListOfBlogs />
          </div>
        ) : (
          <>
            <div className="title mt-5 mb-5">
              <p className=" font-semibold text-2xl mb-1.5">All Destinations</p>
              <p className=" text-sm">
                Read out what destinations people are loving to go
              </p>
            </div>

            <div className="main">
              <div className="grid gap-5 grid-cols-3">
                {currentItems.map((index, id) => (
                  <div
                    key={id}
                    className="flex flex-col mb-2 hover:cursor-pointer "
                    onClick={() => {
                      console.log({ id });

                      window.location.href = `/blogs/${index.ID}`;
                    }}
                  >
                    <div className="relative overflow-hidden rounded-md">
                      <img
                        src={index.hero_img}
                        alt="index"
                        className="h-52 w-full rounded-md transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75 hover:rounded-lg"
                        key={index.POST_ID}
                      />
                    </div>
                    <p className=" text-sm font-semibold text-[#2563EB] mb-1.5 mt-5">
                      {formatDate(index.created_date)}
                    </p>
                    <div className="flex justify-between">
                      <p className=" font-bold mb-2">{index.blogTitle}</p>
                      <Image src={arrow} alt="user" className="h-5 w-5 ml-3" />
                    </div>

                    <p className=" text-gray-800 text-sm">
                      <TagRemover
                        content={
                          index.content.length > 80
                            ? index.content.substring(0, 80) + "..."
                            : index.content
                        }
                      />
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <br />

            <div className=" flex justify-end items-end">
              <div className="w-3/5 flex items-center justify-end">
                <div className=" flex items-center text-[#64748B] text-xs">
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, data.length)} of{" "}
                  {data.length} blogs
                </div>
                <div className="flex justify-end">
                  <PaginationBlogs
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </MaxWidthWrapper>
    </div>
  );
}

export default AllBlogs;
