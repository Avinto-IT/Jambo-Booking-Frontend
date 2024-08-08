"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dot } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Hotel, Room } from "@/utils/types";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import FilterSheet, { FilterValues } from "@/components/FilterSheet";
import FilterChips from "@/components/FilterChips";
import Hero from "@/components/HotelHero/Hero";

type Facility = {
  facilityId: string;
  facilityCategory: string;
  subFacilities: string[];
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllHotels />
    </Suspense>
  );
}

function AllHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [facilities, setFacilities] = useState<Record<string, string[]>>({});
  const [filterValues, setFilterValues] = useState<FilterValues>({
    propertyType: null,
    budgetRange: [100, 1000],
    bedrooms: null,
    beds: null,
    bathrooms: null,
    facilities: [],
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const locationId = searchParams?.get("location");
  const startDate = searchParams?.get("checkin");
  const endDate = searchParams?.get("checkout");

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch("/api/getFacilities");
        const data: Facility[] = await response.json();

        const facilitiesByCategory: Record<string, string[]> = {};
        data.forEach((facility) => {
          facilitiesByCategory[facility.facilityCategory] =
            facility.subFacilities;
        });

        setFacilities(facilitiesByCategory);
      } catch (error) {
        console.log("Error fetching facilities:", error);
      }
    };

    fetchFacilities();
  }, []);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/getHotels");
        console.log(response);
        const data = await response.json();
        setHotels(data.hotels);
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
    const params = new URLSearchParams({
      id: hotelId,
      ...(startDate && { checkin: startDate }),
      ...(endDate && { checkout: endDate }),
    });
    router.push(`/all-hotels/view-hotel-details?${params.toString()}`);
  };

  const hasRequiredFacilities = (
    hotelFacilities: any[],
    requiredFacilities: string[]
  ) => {
    const flattenedFacilities = hotelFacilities.flatMap((facility) =>
      facility.subFacilities.map((sub: { name: string }) => sub.name)
    );
    return requiredFacilities.every((facility) =>
      flattenedFacilities.includes(facility)
    );
  };

  const filteredHotels = hotels?.filter((hotel) => {
    const lowestPricedRoom = getLowestPricedRoom(hotel.rooms);
    const price = lowestPricedRoom ? parseInt(lowestPricedRoom.price) : null;

    return (
      (!locationId ||
        hotel.locationID.toLowerCase().includes(locationId.toLowerCase()) ||
        hotel.address.toLowerCase().includes(locationId.toLowerCase()) ||
        hotel.name.toLowerCase().includes(locationId.toLowerCase())) &&
      price !== null &&
      price >= filterValues.budgetRange[0] &&
      price <= filterValues.budgetRange[1] &&
      hasRequiredFacilities(hotel.facilities, filterValues.facilities)
    );
  });

  const handleRemoveFilter = (filterValue: string) => {
    const updatedFacilities = filterValues.facilities.filter(
      (f) => f !== filterValue
    );
    setFilterValues((prevValues) => ({
      ...prevValues,
      facilities: updatedFacilities,
    }));
  };

  return (
    <div className="">
      <Hero
        title={locationId ? locationId : ""}
        startDate={startDate ? new Date(startDate) : null}
        endDate={endDate ? new Date(endDate) : null}
      />
      <MaxWidthWrapper className="mx-auto">
        <div className="py-10">
          <div className="flex justify-between w-full">
            <div className="h-20 gap-2 mb-4">
              <p className="text-3xl font-semibold tracking-tight leading-10">
                All the Hotels
              </p>
              <p className="leading-7 mt-1 tracking-tight">
                These popular hotels have a lot to offer
              </p>
            </div>
            <FilterSheet
              onFilterChange={setFilterValues}
              facilities={facilities}
              filterValues={filterValues}
            />
          </div>
          <FilterChips
            filterValues={filterValues}
            onRemoveFilter={handleRemoveFilter}
          />
          <div className="grid grid-cols-3 gap-x-5 gap-y-4">
            {filteredHotels.map((hotel, index) => {
              const lowestPricedRoom = getLowestPricedRoom(hotel.rooms);
              return (
                <div
                  key={index}
                  className="flex flex-col mb-2 border pb-5 border-gray-200 rounded-lg"
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
                    <p className="font-bold my-2 px-4 text-xl">{hotel.name}</p>
                  </div>
                  <div className="px-4 text-[#64748B] text-sm">
                    <div className="mb-2 text-pretty">{hotel.address}</div>
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
                        <div className="font-semibold text-md">
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
      </MaxWidthWrapper>
    </div>
  );
}
