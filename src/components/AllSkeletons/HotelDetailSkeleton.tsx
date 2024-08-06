import React from "react";
import { Skeleton } from "../ui/skeleton";

function HotelDetailSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-6 w-80" />
      <Skeleton className="h-4 w-52" />
      <div className="flex gap-2">
        <Skeleton className="w-1/2 h-[30rem]" />
        <div className="grid grid-cols-2 w-1/2 gap-2">
          <Skeleton className="" />
          <Skeleton className="" />
          <Skeleton className="" />
          <Skeleton className="" />
        </div>
      </div>
      <br />
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-4 w-52" />
    </div>
  );
}

export default HotelDetailSkeleton;
