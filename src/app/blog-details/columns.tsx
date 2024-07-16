"use client";
import { Badge } from "@/components/ui/badge";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
export type Bloginfo = {
  POST_ID: string;
  hero_img: string;
  blogTitle: string;

  active: boolean;
  caption: string;
  created_date: string;
};

export const Columns: ColumnDef<Bloginfo>[] = [
  {
    accessorKey: "POST_ID",
    header: () => <div className="text-left">Post ID</div>,
    cell: ({ getValue }) => {
      const value = getValue() as number;

      return <div className="flex justify-center">{value}</div>;
    },
  },
  {
    accessorKey: "hero_img",
    header: () => <div className="text-left"> </div>,
    cell: ({ getValue }) => {
      const value = getValue() as string;

      return (
        <div className="w-32 h-20 relative flex justify-center items-center">
          <img
            src={value}
            alt="hotelphoto"
            className="rounded-md object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "blogTitle",
    header: () => <div>Blog Title</div>,
    cell: ({ getValue }) => {
      const value = getValue() as string;

      return <>{value.length > 20 ? value.substring(0, 20) + "..." : value}</>;
    },
  },

  {
    accessorKey: "active",
    header: () => <div className="text-left">Status</div>,
    cell: ({ getValue }) => {
      const value = getValue() as boolean;
      return (
        <Badge variant={value ? "Approved" : "outline"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },

  {
    accessorKey: "caption",
    header: () => <div>Caption</div>,
    cell: ({ getValue }) => {
      const value = getValue() as string;

      return <>{value.length > 30 ? value.substring(0, 30) + "..." : value}</>;
    },
  },
  {
    accessorKey: "created_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created-date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as string;
      const date = new Date(value);
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);

      return <div className="flex justify-center">{formattedDate}</div>;
    },
  },
];
