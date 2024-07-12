"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Bloginfo, columns } from "./columns";
import { DataTable } from "./data-table";

import React, { useEffect, useState } from "react";
import blogsdata from "../../../data/blog.json";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import {
//     Pagination,
//     PaginationContent,
//     PaginationEllipsis,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
//   } from "@/components/ui/pagination"

import BlogHeader from "@/components/blog/BlogHeader";

import circle from "../../../public/images/head/plus-circle.svg";

import Image from "next/image";
import { Search } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("All");
  const data = blogsdata.blogs;
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredData = () => {
    if (activeTab === "Active") {
      return data.filter((item) => item.active);
    } else if (activeTab === "Inactive") {
      return data.filter((item) => !item.active);
    } else {
      return data;
    }
  };

  return (
    <div className="min-h-screen h-full bg-slate-50">
      <div className="flex justify-center items-center  ">
        <MaxWidthWrapper className="  ">
          <div className="py-6 px-4 gap-4  flex flex-col  ">
            <BlogHeader />

            <div className="px-6 gap-8  max-w-screen ">
              <div className="gap-6 ">
                <div className="gap-2">
                  <div
                    className="filters flex justify-between items-center 
           h-10"
                  >
                    <Tabs
                      defaultValue="All"
                      className=" w-20 h-10 p-1 rounded-md "
                    >
                      <TabsList>
                        <TabsTrigger
                          value="All"
                          onClick={() => setActiveTab("All")}
                        >
                          All
                        </TabsTrigger>
                        <TabsTrigger
                          value="Active"
                          onClick={() => setActiveTab("Active")}
                        >
                          Active
                        </TabsTrigger>
                        <TabsTrigger
                          value="Inactive"
                          onClick={() => setActiveTab("Inactive")}
                        >
                          Inactive
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="buttons gap-2 h-8 w-50  ">
                      {/* <Button className="bg-white text-black mr-2 h-8 shadow-sm hover:bg-white hover:shadow-lg"> <Image src={userImg} alt="user" className="mr-2" />Fliter</Button> */}
                      <Button
                        asChild
                        className="bg-blue-600 hover:bg-blue-800  h-8"
                      >
                        <a href="http://localhost:3000/add-blogs">
                          <Image src={circle} alt="user" className="" />
                          Add Blog
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex  flex-col      bg-white mt-4 rounded-lg shadow-md">
                    <div className="searchrow flex flex-row       h-28 mb-2">
                      <div className="flex flex-row justify-between items-center content-between w-full     ">
                        <div className="flex flex-col  gap-1.5 p-6">
                          <p className=" font-bold text-xl">Blogs</p>
                          <p className=" text-gray-600 mt-2 text-sm">
                            Manage your blogs and view their status performance.
                          </p>
                        </div>

                        <div className="pr-3 w-64 flex relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                            <Search className=" opacity-50 h-5" />
                          </span>
                          <Input
                            type="search"
                            placeholder="Search..."
                            className=" rounded-lg bg-background pl-8 ml-1.5 "
                            value={searchValue}
                            onChange={(event) =>
                              setSearchValue(event.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <DataTable
                      columns={columns}
                      data={filteredData()}
                      searchValue={searchValue}
                    />

                    {/* <div className="flex justify-ending items-end content-end mr-5">


        <Pagination className="flex justify-end">
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
</div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}
