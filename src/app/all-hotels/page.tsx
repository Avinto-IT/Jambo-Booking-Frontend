"use client";
import Image from "next/image";
import { Dot, Filter } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { Hotel, Room } from "@/utils/types";
import { Suspense, useEffect, useState } from "react";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Layout from "@/components/Layout/Layout";
// import Hero from "@/components/landing/Hero";
import Hero from "@/components/HotelHero/Hero";
import { Button } from "@/components/ui/button";
import FacilityIcon from "@/utils/facilityIcon";
import ListSkeleton from "@/components/AllSkeletons/ListSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllHotels />
    </Suspense>
  );
}

function AllHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const searchParams = useSearchParams();

  const locationId = searchParams?.get("id");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/getHotels");
        console.log(response);
        const data = await response.json();
        console.log(data);
        setHotels(data.hotels); // Corrected this line
        // console.log(hotels);
      } catch (error) {
        console.log("Error fetching hotels:", error);
      } finally {
        setLoading(false);
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
    router.push(`/all-hotels/view-hotel-details?id=${hotelId}`);
  };

  const filteredHotels = locationId
    ? hotels.filter((hotel) => {
        return (
          hotel.address.toLowerCase().includes(locationId.toLowerCase()) ||
          hotel.address.toLowerCase().includes(locationId.toLowerCase()) ||
          hotel.name.toLowerCase().includes(locationId.toLowerCase())
        );
      })
    : hotels;

  return (
    <Layout>
      <Hero title={locationId} />
      {/* {locationId ? <Hero title={locationId} /> : <Hero title="search" />} */}
      <div className="flex justify-center">
        <MaxWidthWrapper>
          {loading ? (
            <div className="py-10">
              <ListSkeleton />
            </div>
          ) : (
            <div className="py-10">
              <div className=" gap-2 mb-4">
                {locationId ? (
                  <div className="flex text-2xl font-semibold tracking-tight leading-10">
                    {" "}
                    <p className="">{locationId}: </p>
                    <p className=" ">
                      &nbsp;{filteredHotels.length} hotels found
                    </p>
                  </div>
                ) : (
                  <p className=" text-3xl font-semibold tracking-tight leading-10">
                    All the Hotels
                  </p>
                )}
                <p className=" leading-7 mt-1 tracking-tight ">
                  These popular hotels have a lot to offer
                </p>
                <div className="flex justify-end w-full">
                  <Button
                    variant="outline"
                    className="leading-7 mt-1 tracking-tight space-x-1 "
                  >
                    <Filter className="h-4 w-4" />
                    <p className="">Show Filter</p>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-x-5 gap-y-4">
                {filteredHotels.map((hotel, index) => {
                  const lowestPricedRoom = getLowestPricedRoom(hotel.rooms);
                  // setInd(index);

                  return (
                    <div
                      key={index}
                      className="flex flex-col mb-2 border pb-5 border-gray-200 rounded-lg hover:cursor-pointer"
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
                        <div className="mb-2 font-medium">{hotel.address}</div>
                        <div className="flex">
                          <div className="flex flex-wrap">
                            {lowestPricedRoom?.amenities
                              ?.slice(0, 5)
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

                            {lowestPricedRoom?.amenities &&
                              lowestPricedRoom.amenities.length > 5 && (
                                <div className="text-[#64748B] flex">
                                  <p>
                                    {lowestPricedRoom.amenities.length - 5}+
                                    Amenities
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex mt-2">
                          Starting from &nbsp;
                          <div className="text-black flex">
                            <div className=" font-semibold text-md">
                              USD {lowestPricedRoom?.price}
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
          )}
        </MaxWidthWrapper>
      </div>
    </Layout>
  );
}

// function SkeletonCard() {
//   return (
//     <div className="space-y-5 w-full">
//       <Skeleton className="h-6 w-52" />
//       <Skeleton className="h-4 w-80" />
//       <div className=" flex justify-end w-full">
//         <Skeleton className="h-6 w-32" />
//       </div>
//       <div className="flex flex-row justify-between space-x-7 w-full h-72">
//         <Skeleton className=" w-1/3" />

//         <Skeleton className=" w-1/3" />
//         <Skeleton className=" w-1/3" />
//       </div>
//     </div>
//   );
// }
