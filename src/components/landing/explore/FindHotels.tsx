"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { useEffect, useState } from "react";
import blogsData from "../../../../data/blog.json";
import { Hotel, Room } from "@/utils/types";
import { useRouter } from "next/router";
function FindHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  // const router = useRouter();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/getHotels");
        const data = await response.json();
        setHotels(data.hotels); // Corrected this line
        console.log(hotels);
      } catch (error) {
        console.log("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  const getLowestPricedRoom = (rooms: Room[]): Room | null => {
    if (!rooms || rooms.length === 0) return null;

    return rooms.reduce((lowest, room) => {
      return room.price < lowest.price ? room : lowest;
    });
  };

  const handleViewClick = (hotelId: string) => {
    window.location.href = `/all-hotels/view-hotel-details?id=${hotelId}`;
  };

  const data = blogsData.blogs.slice(0, 6);
  return (
    <div className="py-10">
      <div className="h-20 gap-2 mb-4">
        <p className=" text-3xl font-semibold tracking-tight leading-10">
          Find Your Hotels
        </p>
        <p className=" leading-7 mt-1 tracking-tight ">
          Find your desired hotel near your desired trip location
        </p>
      </div>
      <div className="grid grid-cols-3 grid-rows-2   gap-x-5 gap-y-4  ">
        {hotels.slice(0, 6).map((hotel, id) => {
          const lowestPricedRoom = getLowestPricedRoom(hotel.rooms);
          return (
            <div
              key={id}
              className="flex flex-col mb-2 border pb-5 border-gray-200 rounded-lg hover:cursor-pointer"
              onClick={() => {
                handleViewClick(hotel.hotelID);
              }}
            >
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={hotel.primaryImageLink}
                  alt="index"
                  className="h-72 w-full rounded-md transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75 hover:rounded-lg"
                />
              </div>

              <div className="flex justify-between">
                <p className=" font-bold my-2  px-4">{hotel.name}</p>
              </div>
              <div className="px-4 text-[#64748B] text-sm">
                <div className="mb-2">{hotel.address}</div>
                <div className="flex">
                  <div className="flex">
                    Starting from
                    <div className="text-black flex">
                      <div className=" font-semibold text-md">
                        &nbsp;USD&nbsp;{lowestPricedRoom?.price}
                      </div>{" "}
                      /night{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FindHotels;
