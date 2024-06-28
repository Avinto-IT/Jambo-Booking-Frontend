"use client";
import { Badge } from "@/components/ui/badge"
 
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image";
import photo from "./appartment.jpg"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
export type Payment = {
  // user_id: string
  POST_ID:Number,
  hero_img:string
    blogTitle: string
    // content: string
  active: "true" | "false" 
  caption: string
  created_date:string

}
 
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "POST_ID",
    header: ()=><div className="text-left">Post ID</div>,
    cell:({getValue})=>{
      const value: string=getValue();
      
      return(
        <div className="flex justify-center">{value}</div>)
  },},
  {
    accessorKey: "hero_img",
    header: () => <div className="text-left"> </div>,
    cell:({getValue})=>{
      const value: string=getValue();

      return(
        <div className="w-32 h-20 relative">
      
      <img src={value} alt="hotelphoto" className="rounded-md object-cover" />
      
        </div>)
        
   
  },},
  {
    accessorKey: "blogTitle",
    header: ()=><div>Blog Title</div>,
    cell:({getValue})=>{
      const value:string=getValue();
   
      return(
        <>
        {value.length>20?(value.substring(0,20)+"..."):value}
        </>
      )
    }
  },

  {
    accessorKey: "active",
    header: () => <div className="text-left">Status</div>,
    cell: ({ getValue }) => {
      const value = getValue();
      return (

        <Badge variant="outline" className="rounded-xl" style={{ backgroundColor: value ? "lightgreen" : "white" }}>
          {value ? "Active" : "Inactive"}
          </Badge>
    
      );}
  
  },
    
   
  
  {
    accessorKey: "caption",
    header: ()=><div>Caption</div>,
    cell:({getValue})=>{
      const value=getValue();
   
      return(
        <>
        {value.length>30?(value.substring(0,30)+"..."):value}
        </>
      )
    }
  },
  {
    accessorKey: "created_date",
    header: ({column})=>{
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created-date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },



    cell: ({ getValue }) => {
      const value = getValue();
      let formatdate= new Date(value);
      const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
       formatdate= formatdate.toLocaleDateString("en-US",options);
      return (
          formatdate
        );}
  },
  
]