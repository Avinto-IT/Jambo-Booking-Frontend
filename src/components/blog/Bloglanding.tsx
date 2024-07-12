"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { useEffect, useState } from "react";
import blogsdata from "../../../data/blog.json";
import arrow from "../../../public/images/head/arrow-up-right.svg";
import Image from "next/image";
import Link from "next/link";
import TagRemover from "./TagRemover";

function Bloglanding() {
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
    subtitleone: string;
    contentone: string;
    subtitletwo: string;
    contenttwo: string;
    contentimg: string;
    subtitlethree: string;
    contentthree: string;
    subtitlefour: string;
    contentfour: string;
    Conclusion: string;
  }

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

  const stripHtmlTags = (str: string): string => {
    const div = document.createElement("div");
    div.innerHTML = str;
    return div.textContent || div.innerText || "";
  };

  const substring = (content: string) => {
    const lines = content.split(/\r\n|\r|\n/);
    return lines.length < 1 ? content : content.substring(0, 100) + "...";
  };

  const [limitedData, setLimitedData] = useState<Blog[]>([]);

  useEffect(() => {
    // Sort and slice the data on the client side
    const sorted = blogsdata.blogs.sort((a, b) => {
      const dateA = new Date(a.created_date).getTime();
      const dateB = new Date(b.created_date).getTime();
      return dateB - dateA;
    });
    setLimitedData(sorted.slice(0, 3));
  }, []);

  const handleBlogClick = (id: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `http://localhost:3000/blogs/${id}`;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-20 mb-20">
      <MaxWidthWrapper className=" ">
        <div className="title flex justify-between ">
          <div className="">
            <p className=" font-semibold text-2xl mb-1.5">
              Travel Destinations for you
            </p>
            <p className=" text-sm">
              Read out what destinations people are loving to go
            </p>
          </div>
          <div className=" flex items-end text-xs   font-semibold text-[#2563EB]">
            <u>
              <Link href="http://localhost:3000/blogs/blog-list">
                View More
              </Link>
            </u>
          </div>
        </div>

        <br />

        <div className="mainbody flex  ">
          {limitedData.length > 0 && (
            <div
              className="left w-1/2 mr-3"
              onClick={() => handleBlogClick(limitedData[0].ID)}
            >
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={limitedData[0].hero_img}
                  alt="hotelphoto"
                  className="rounded-md object-cover transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
                />
              </div>
              <p className=" text-sm font-semibold text-[#2563EB] mb-2 mt-5">
                {formatDate(limitedData[0].created_date)}
              </p>
              <div className="flex justify-between">
                <p className=" font-semibold mb-2">
                  {limitedData[0].blogTitle}
                </p>
                <Image src={arrow} alt="user" className="h-5 w-5" />
              </div>
              <p className=" text-gray-800 text-sm">
                <TagRemover content={substring(limitedData[0].content)} />
              </p>
            </div>
          )}

          <div className="right w-1/2 ml-3">
            {limitedData.length > 1 &&
              limitedData.slice(1, 3).map((blog) => (
                <div
                  key={blog.POST_ID}
                  className="one h-1/2 flex pb-3 mb-3"
                  onClick={() => handleBlogClick(blog.ID)}
                >
                  <div className="w-1/2 mr-5 relative overflow-hidden rounded-md">
                    <img
                      src={blog.hero_img}
                      alt="hotelphoto"
                      className="object-cover h-full transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
                    />
                  </div>
                  <div className="w-1/2">
                    <p className=" text-sm font-semibold text-[#2563EB] mb-2">
                      {formatDate(blog.created_date)}
                    </p>
                    <p className=" font-semibold mb-2">{blog.blogTitle}</p>
                    <p className=" text-gray-800 text-sm">
                      <TagRemover content={substring(blog.content)} />
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default Bloglanding;
