"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotels } from "@/utils/types";
import { Dot } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import bed from "../../../../../public/images/Bed.svg";
import guest from "../../../../../public/images/Guest.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [showMore, setShowMore] = useState(false);
  const [showAmenities, setShowAmentities] = useState(false);
  const [visibleFacilitiesCount, setVisibleFacilitiesCount] = useState(12);
  const searchParams = useSearchParams();

  const id = searchParams?.get("id");
  const [hotel, setHotel] = useState<Hotels>();
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const [token, setToken] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`/api/getHotelById?id=${id}`);
        const data = await response.json();
        setHotel(data.hotel);
      } catch (error) {
        console.log("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);
  if (!hotel) return <>Loading...</>;
  console.log(hotel);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const toggleShowAmenities = () => {
    if (showAmenities) {
      setVisibleFacilitiesCount(12); // Show only the first 3 facilities
    } else {
      setVisibleFacilitiesCount(hotel.facilities.length); // Show all facilities
    }
    setShowAmentities(!showAmenities);
  };
  return (
    <div className="flex justify-center ">
      <MaxWidthWrapper>
        <div className="text-[#020617] my-20 space-y-10 tracking-tight">
          <div className="space-y-5">
            <div className="space-y-3">
              <p
                className="text-3xl  font-semibold
            "
              >
                {hotel.name}
              </p>
              <p className="">{hotel.address}</p>
            </div>
            <div className="outline outline-gray-300 rounded-xl h-96"></div>
          </div>
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-2xl font-semibold">Basic Overview</p>
              <p className="pb-5">{hotel.address}</p>
              <p className="leading-7 border-t-2 pt-7">
                {hotel.description.length > 350 ? (
                  <div className="space-y-5">
                    <p className="">
                      {showMore
                        ? hotel.description
                        : hotel.description.substring(0, 350) + "..."}
                    </p>
                    <div
                      className="text-blue-600 text-sm font-medium cursor-pointer"
                      onClick={toggleShowMore}
                    >
                      <u>{!showMore ? "Show More" : "Show Less"}</u>
                    </div>
                  </div>
                ) : (
                  hotel.description
                )}
              </p>
            </div>
            <div className=" border-b-2 "></div>
            <div className="space-y-7">
              <p className="text-2xl font-semibold">Top Facilities</p>
              <div className="grid gap-5 grid-cols-3 ">
                {hotel.facilities.map((value, index) => (
                  <div className="" key={index}>
                    {value.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-2/3">
              <div className=" border-b-2"></div>
              <div className="space-y-7">
                <p className="text-2xl font-semibold mt-7">Rooms</p>
                {hotel.rooms.map((value, index) => {
                  console.log(value, "asasas");
                  return (
                    <Card
                      key={index}
                      className="p-5 space-y-2 hover:bg-[#EFF6FF] hover:border-[#2563EB] "
                    >
                      <CardTitle className="text-xl">{value.type}</CardTitle>
                      <div className="flex justify-between">
                        <div className="space-y-2 w-2/3 pr-5 ">
                          <div className="flex  justify-between w-3/5 font-medium">
                            <div className="flex ">
                              <Image src={bed} alt="bed" />
                              <p className="pl-4 pr-1">{value.numberOfBeds}</p>
                              <p className="">{value.bedType}</p>
                            </div>
                            <div className="flex space-x-4">
                              <Image src={guest} alt="guest" />
                              <p className=""> {value.capacity}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap">
                            {value.amenities
                              .slice(0, 6)
                              .map((amenity, amenityIndex) => (
                                <span
                                  className="text-sm text-[#64748B] flex items-center gap-x-1"
                                  key={amenityIndex}
                                >
                                  <p className="whitespace-nowrap">
                                    {amenity.name}
                                  </p>
                                  <Dot />
                                </span>
                              ))}
                          </div>
                          <div className="text-[#64748B]">
                            {value.amenities.length > 6 && (
                              <p>{value.amenities.length - 6}+ Amenities</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-end space-y-2">
                          <p className="text-[#64748B] text-sm">
                            Includes taxes and fees{" "}
                          </p>
                          <p className="flex justify-end text-xl font-semibold">
                            Rs.{value.price}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              <div className=" border-b-2 my-7"></div>
            </div>
            <div className="space-y-7">
              <p className="text-2xl font-semibold">Explore All Facilities</p>
              <div className="grid grid-cols-3 space-y-2">
                {hotel.facilities
                  .slice(0, visibleFacilitiesCount)
                  .map((value, index) => {
                    return (
                      <div className="" key={index}>
                        {value.name}

                        <div className="">
                          {value.subFacilities.map((subValue, subIndex) => {
                            {
                              console.log("object", subValue.length);
                            }
                            return (
                              <span
                                className="text-sm text-[#64748B]    flex  items-center"
                                key={subIndex}
                              >
                                <Dot className="" />
                                <p className="">{subValue.name}</p>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
              {hotel.facilities.length > 12 && (
                <Button variant={"outline"} onClick={toggleShowAmenities}>
                  {!showAmenities
                    ? `Show all ${hotel.facilities.length} amenities`
                    : "Show Less"}
                </Button>
              )}

              <div className=" border-b-2 mt-7"></div>
              <div className="space-y-7">
                <p className="text-2xl font-semibold">House Rules</p>
                <div className="">
                  {hotel.houseRules.map((value, index) => {
                    return (
                      <div key={index}>
                        <div className="flex w-full">
                          <p className="w-1/4">{value.type}</p>
                          <p className="w-3/4">{value.details}</p>
                        </div>
                        {index !== hotel.houseRules.length - 1 && (
                          <div className="border-t-2 my-5"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
