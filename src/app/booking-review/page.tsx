"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface BookingInfo {
  roomType: string;
  rooms: number;
}

interface BookingData {
  userID: string;
  hotelID: string;
  bookingStartDate: string;
  bookingEndDate: string;
  guests: number;
  bookingInfo: BookingInfo[];
}

const BookingReviewPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    const bookingDataParam = searchParams?.get("bookingData");
    if (bookingDataParam) {
      const data = JSON.parse(bookingDataParam);
      setBookingData(data);
    }
  }, [searchParams]);

  if (!bookingData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Booking Review</h1>
      <pre>{JSON.stringify(bookingData, null, 2)}</pre>
      {/* Render bookingData as needed */}
    </div>
  );
};

export default BookingReviewPage;
