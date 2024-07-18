"use client";
import { useEffect, useState } from "react";
import Select, { ActionMeta, SingleValue } from "react-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Delete, MoreHorizontal, Search, Trash } from "lucide-react";
import { Hotel } from "@/utils/types";
import { addDays, format, isBefore, parseISO, compareDesc } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast, Toaster } from "sonner";
import { matchSorter } from "match-sorter"; // Import match-sorter
import ConfirmPopup from "../AdminComponents/Sub-Components/ConfirmPopup";
export default function CalendarPricing() {
  const [hotels, setHotels] = useState<Hotel[] | undefined>(undefined);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [blockedDates, setBlockedDates] = useState<Date[] | undefined>(
    undefined
  );
  const [price, setPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const fetchHotels = async () => {
    try {
      const response = await fetch("/api/getHotels");
      const data = await response.json();
      setHotels(data.hotels || []);
      console.log("hotels fetched successfully");
    } catch (error) {
      console.log("Error fetching hotels:", error);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const hotelsWithCalendarPrices =
    hotels
      ?.filter((hotel) =>
        hotel.rooms.some(
          (room) => room.calendarPrices && room.calendarPrices.length > 0
        )
      )
      .map((hotel) => ({
        ...hotel,
        rooms: hotel.rooms.filter(
          (room) => room.calendarPrices && room.calendarPrices.length > 0
        ),
      })) || [];

  const handleHotelChange = (
    newValue: SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    if (newValue) {
      const hotel = hotels?.find((hotel) => hotel.hotelID === newValue.value);
      setSelectedHotel(hotel || null);
      setSelectedRoom(null); // Reset the room selection
      setBlockedDates([]); // Clear blocked dates
    } else {
      setSelectedHotel(null);
      setSelectedRoom(null); // Reset the room selection
      setBlockedDates([]); // Clear blocked dates
    }
  };

  const handleRoomChange = (
    newValue: SingleValue<{ label: string; value: string }>,
    actionMeta: ActionMeta<{ label: string; value: string }>
  ) => {
    if (newValue) {
      setSelectedRoom(newValue.value);
      if (selectedHotel) {
        const room = selectedHotel?.rooms.find(
          (room) => room.type === newValue.value
        );

        if (room && room.calendarPrices) {
          const blockedDates = room.calendarPrices.flatMap((calendarPrice) => {
            const from = parseISO(calendarPrice.from);
            const to = parseISO(calendarPrice.to);
            const dates = [];
            for (let date = from; isBefore(date, to); date = addDays(date, 1)) {
              dates.push(date);
            }
            return dates;
          });
          setBlockedDates(blockedDates);
        } else {
          setBlockedDates([]);
        }
      }
    } else {
      setSelectedRoom(null);
      setBlockedDates([]);
    }
  };

  const handleSubmit = async () => {
    if (
      selectedHotel &&
      selectedRoom &&
      date &&
      price &&
      date.from &&
      date.to
    ) {
      const selectedDates: Date[] = [];
      for (let d = date.from; isBefore(d, date.to); d = addDays(d, 1)) {
        selectedDates.push(d);
      }

      const overlaps = selectedDates.some((selectedDate) =>
        blockedDates?.some(
          (blockedDate) =>
            format(blockedDate, "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd")
        )
      );
      if (overlaps) {
        toast.error("Selected date range includes previously set dates.");
        return;
      }
      try {
        const response = await fetch("/api/updateCalendarPricing", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hotelID: selectedHotel.hotelID,
            roomType: selectedRoom,
            calendarPrice: {
              from: date.from,
              to: date.to,
              price: price,
              createdAt: new Date().toISOString(),
            },
          }),
        });
        if (response.ok) {
          toast.message(
            `The price has been updated for ${selectedHotel.name}'s ${selectedRoom} from ${date.from} to ${date.to} with price ${price} `
          );
          const newBlockedDates = [...(blockedDates || []), ...selectedDates];
          setBlockedDates(newBlockedDates);
          fetchHotels();
        } else {
          toast.error("Failed to update hotel price");
        }
      } catch (error) {
        toast.error("Error updating hotel price:");
        console.error("Error updating hotel price:", error);
      }
    }
  };

  const handleCalendarPricingDelete =
    (calendarPriceID: string, hotelID: string, roomType: string) =>
    async () => {
      try {
        const response = await fetch("/api/deleteCalendarPricing", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ calendarPriceID, hotelID, roomType }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message || "Calendar price deleted successfully");
          fetchHotels();

          // Find the hotel and room from which the calendar price was deleted
          const hotel = hotels?.find((h) => h.hotelID === hotelID);
          if (hotel) {
            const room = hotel.rooms.find((r) => r.type === roomType);
            if (room && room.calendarPrices) {
              const calendarPrice = room.calendarPrices.find(
                (cp) => cp.id === calendarPriceID
              );
              if (calendarPrice) {
                const from = parseISO(calendarPrice.from);
                const to = parseISO(calendarPrice.to);
                const datesToRemove: Date[] = [];
                for (
                  let date = from;
                  isBefore(date, to);
                  date = addDays(date, 1)
                ) {
                  datesToRemove.push(date);
                }
                datesToRemove.push(to); // Ensure the end date is also included

                const newBlockedDates = blockedDates?.filter(
                  (blockedDate) =>
                    !datesToRemove.some(
                      (dateToRemove) =>
                        format(blockedDate, "yyyy-MM-dd") ===
                        format(dateToRemove, "yyyy-MM-dd")
                    )
                );

                setBlockedDates(newBlockedDates);
              }
            }
          }
        } else {
          toast.error(data.error || "Failed to delete calendar price");
        }
      } catch (error) {
        toast.error("Error deleting calendar price");
        console.error("Error deleting calendar price:", error);
      }
    };

  const handleClear = () => {
    setDate(undefined);
    setPrice("");
  };
  const restructureHotels = (hotels: Hotel[]) => {
    return hotels.flatMap((hotel) => {
      return hotel.rooms.map((room) => ({
        hotelID: hotel.hotelID,
        name: hotel.name,
        roomType: room.type,
        calendarPrices: room.calendarPrices,
      }));
    });
  };
  const restructuredData = restructureHotels(hotelsWithCalendarPrices);

  const filteredHotels = searchQuery
    ? restructuredData.filter((hotel) => {
        return (
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.roomType.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : restructuredData;

  // Flatten and sort the calendar prices by createdAt date in descending order
  const flattenedSortedPrices = filteredHotels
    .flatMap((hotel) =>
      hotel?.calendarPrices?.map((calendarPrice) => ({
        ...calendarPrice,
        hotelName: hotel.name,
        roomType: hotel.roomType,
        hotelID: hotel.hotelID,
      }))
    )
    .sort((a, b) => {
      if (a && b) {
        return compareDesc(parseISO(a.createdAt), parseISO(b.createdAt));
      }
      return 0;
    });

  if (!hotels) return <>Loading...</>;

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>
            Manage your pricing and view their status performance.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex gap-6 w-full">
          <div className=" flex flex-col">
            <div className="flex gap-6 w-full ">
              <div className="w-1/2">
                <h3 className="mb-2">Hotel Name</h3>
                <Select
                  instanceId="hotel-select"
                  options={hotels.map((hotel) => ({
                    value: hotel.hotelID,
                    label: hotel.name,
                  }))}
                  onChange={handleHotelChange}
                  placeholder="Select hotel"
                  className="mb-4 max-w-60"
                />
              </div>
              <div className="w-1/2">
                <h3 className="mb-2">Room Type</h3>
                <Select
                  instanceId="room-select"
                  options={
                    selectedHotel
                      ? selectedHotel.rooms.map((room) => ({
                          value: room.type,
                          label: room.type,
                        }))
                      : []
                  }
                  onChange={handleRoomChange}
                  value={
                    selectedRoom
                      ? { value: selectedRoom, label: selectedRoom }
                      : null
                  }
                  placeholder="Select room type"
                  className="mb-4 max-w-60"
                />
              </div>
            </div>
            <div className="flex border rounded">
              <Calendar
                className="mb-4 self-center"
                selected={date}
                onSelect={setDate}
                mode="range"
                numberOfMonths={2}
                disabled={(day) =>
                  blockedDates?.some(
                    (blockedDate) =>
                      format(blockedDate, "yyyy-MM-dd") ===
                      format(day, "yyyy-MM-dd")
                  ) ||
                  !selectedHotel ||
                  !selectedRoom
                }
              />
            </div>
            <div className="text-xs mt-2">
              <span className="font-semibold"> Note:</span>
              The calendar is interactable after the hotel and room type has
              been selected
            </div>
          </div>
          <Card className="w-1/2 self-end flex-1 mb-5">
            <CardHeader>
              <CardTitle>Add Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h2 className="mb-2">Selected Date</h2>
                <div className="mb-2 border min-h-9 rounded-md px-3 py-1">
                  {date?.from && date?.to
                    ? `${format(date?.from, "MMMM d, yyyy")} - ${format(
                        date?.to,
                        "MMMM d, yyyy"
                      )}`
                    : ""}
                </div>

                <h2 className="mb-2">Price</h2>
                <Input
                  type="number"
                  required={true}
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={handleClear} variant="outline">
                  Clear
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-800 "
                  disabled={
                    selectedHotel && selectedRoom && date && price
                      ? false
                      : true
                  }
                >
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Price Details</CardTitle>
              <CardDescription>View their overall details.</CardDescription>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-4">Price ID</TableHead>
                <TableHead className="p-4">Date Range</TableHead>
                <TableHead className="p-4">Hotel Name</TableHead>
                <TableHead className="p-4">Room Type</TableHead>
                <TableHead className="p-4">Amount</TableHead>
                <TableHead>
                  <span className="sr-only">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flattenedSortedPrices?.map(
                (calendarPrice, index) =>
                  calendarPrice && (
                    <TableRow key={index}>
                      <TableCell className="p-4">{calendarPrice.id}</TableCell>
                      <TableCell className="p-4">
                        {calendarPrice.from && calendarPrice.to
                          ? `${format(
                              parseISO(calendarPrice.from),
                              "MMMM d, yyyy"
                            )} - ${format(
                              parseISO(calendarPrice.to),
                              "MMMM d, yyyy"
                            )}`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="p-4">
                        {calendarPrice.hotelName}
                      </TableCell>
                      <TableCell className="p-4">
                        {calendarPrice.roomType}
                      </TableCell>
                      <TableCell className="p-4">
                        {calendarPrice.price}
                      </TableCell>
                      <TableCell className="p-4">
                        <ConfirmPopup
                          title={<Trash className="h-4 w-4" />}
                          handleClick={handleCalendarPricingDelete(
                            calendarPrice.id,
                            calendarPrice.hotelID,
                            calendarPrice.roomType
                          )}
                          message={`Are you sure you want to delete the calendar pricing for ${
                            calendarPrice.hotelName
                          } for date ${
                            calendarPrice.from
                              ? format(
                                  parseISO(calendarPrice.from),
                                  "MMMM d, yyyy"
                                )
                              : "N/A"
                          } to ${
                            calendarPrice.to
                              ? format(
                                  parseISO(calendarPrice.to),
                                  "MMMM d, yyyy"
                                )
                              : "N/A"
                          }?`}
                        />
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </CardContent>
        <Toaster />
      </Card>
    </>
  );
}
