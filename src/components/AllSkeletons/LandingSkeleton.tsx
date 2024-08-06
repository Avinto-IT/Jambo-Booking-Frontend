import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import ListSkeleton from "./ListSkeleton";

function OffersSkeleton() {
  return (
    <div className="space-y-5 w-full">
      <Skeleton className="h-6 w-52" />
      <Skeleton className="h-4 w-80" />
      <br />
      <div className="flex flex-row justify-between space-x-7 w-full h-56">
        <Skeleton className=" w-1/2" />

        <Skeleton className=" w-1/2" />
      </div>
    </div>
  );
}
function ExploreAfricaSkeleton() {
  return (
    <div className="space-y-5 w-full">
      <Skeleton className="h-6 w-52" />
      <Skeleton className="h-4 w-80" />
      <br />
      <div className="grid grid-cols-6 gap-4 mt-7 ">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full" />
        ))}
      </div>
    </div>
  );
}

function LandingSkeleton() {
  return (
    <div className="my-14 space-y-14">
      <OffersSkeleton />
      <ExploreAfricaSkeleton />
      <ListSkeleton />
    </div>
  );
}

export default LandingSkeleton;
