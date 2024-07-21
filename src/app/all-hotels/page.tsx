"use client";
import Image from "next/image";
import { Dot } from "lucide-react";

import { useRouter } from "next/navigation";

import { Hotel } from "@/utils/types";
import { useEffect, useState } from "react";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Layout from "@/components/Layout/Layout";
import Hero from "@/components/landing/Hero";
import randomImg from "../../../public/images/an_image_for_hotel_booking.svg";

export default function HotelsDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const router = useRouter();

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
  const getLowestPricedRoom = (rooms) => {
    if (!rooms || rooms.length === 0) return null;

    return rooms.reduce((lowest, room) => {
      return room.price < lowest.price ? room : lowest;
    });
  };
  const handleViewClick = (hotelId: string) => {
    router.push(`/all-hotels/view-hotel-details?id=${hotelId}`);
  };

  return (
    <Layout>
      <Hero />
      <div className="flex justify-center">
        <MaxWidthWrapper>
          <div className="py-10">
            <div className="h-20 gap-2 mb-4">
              <p className=" text-3xl font-semibold tracking-tight leading-10">
                All the Hotels
              </p>
              <p className=" leading-7 mt-1 tracking-tight ">
                These popular hotels have a lot to offer
              </p>
            </div>
            <div className="grid grid-cols-3 grid-rows-2   gap-x-5 gap-y-4  ">
              {hotels.map((hotel, index) => {
                const lowestPricedRoom = getLowestPricedRoom(hotel.rooms);
                return (
                  <div
                    key={index}
                    className="flex flex-col mb-2 border pb-5 border-gray-200 rounded-lg "
                    onClick={() => {
                      handleViewClick(hotel.hotelID);
                    }}
                  >
                    <div className="relative overflow-hidden rounded-md outline-gray-200 h-72 w-full">
                      <img
                        src={hotel.primaryImageLink}
                        alt="HotelImage"
                        className="h-72 w-full rounded-md transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75 hover:rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex justify-between">
                      <p className=" font-bold my-2  px-4 text-xl">
                        {hotel.name}
                      </p>
                    </div>
                    <div className="px-4 text-[#64748B] text-sm">
                      <div className="mb-2">{hotel.address}</div>
                      <div className="flex">
                        <div className="flex flex-wrap">
                          {lowestPricedRoom.amenities
                            .slice(0, 5)
                            .map((amenity, amenityIndex) => (
                              <span
                                className="text-sm text-[#64748B] flex items-center gap-x-1"
                                key={amenityIndex}
                              >
                                <p className="whitespace-nowrap ">
                                  {amenity.name}
                                </p>
                                <Dot />
                              </span>
                            ))}

                          <div className="text-[#64748B] flex">
                            <p className="">
                              {lowestPricedRoom.amenities.length > 5 && (
                                <p>
                                  {lowestPricedRoom.amenities.length - 5}+
                                  Amenities
                                </p>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex mt-2">
                        Starting from &nbsp;
                        <div className="text-black flex">
                          <div className=" font-semibold text-md">
                            {" "}
                            ${lowestPricedRoom?.price}
                          </div>{" "}
                          /night{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </Layout>
  );
}
