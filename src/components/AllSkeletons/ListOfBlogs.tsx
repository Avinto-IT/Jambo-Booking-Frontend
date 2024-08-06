import React from "react";
import { Skeleton } from "../ui/skeleton";

function ListOfBlogs() {
  return (
    <div className="space-y-5 w-full">
      <Skeleton className="h-6 w-52" />
      <Skeleton className="h-4 w-80" />

      <div className="flex flex-row justify-between space-x-7 w-full h-56">
        <Skeleton className=" w-1/3" />

        <Skeleton className=" w-1/3" />
        <Skeleton className=" w-1/3" />
      </div>
    </div>
  );
}

export default ListOfBlogs;
