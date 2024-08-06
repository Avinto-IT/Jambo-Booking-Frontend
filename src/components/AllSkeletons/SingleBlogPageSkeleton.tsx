import React from "react";
import { Skeleton } from "../ui/skeleton";

function SingleBlogPageSkeleton() {
  return (
    <div className="flex justify-between gap-16">
      <div className="space-y-5 w-4/6">
        <Skeleton className="h-6 w-80 mt-5" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="w-full h-96" />
      </div>
      <div className="w-2/6 space-y-5">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-44" />
        <br />
        <Skeleton className="w-full h-60" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-60" />
        <br />
        <br />
        <Skeleton className="w-full h-60" />
      </div>
    </div>
  );
}

export default SingleBlogPageSkeleton;
