import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
interface User {
  userID: string;
  agencyName: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  affiliatedHotel: string | null;
  contactNumber: string;
  role: string;
  dateOfBirth: string;
  address: string;
  toursCompleted: number;
  gradeID: string | null;
  hotelID: string | null;
  bookings: Booking[];
}

interface Booking {
  bookingID: string;
  userID: string;
  hotelID: string;
  bookingStartDate: string;
  bookingEndDate: string;
  status: string;
  guests: number;
  bookingInfo: BookingInfo[];
  hotel: Hotel;
}

interface BookingInfo {
  roomType: string;
  rooms: number;
  totalPrice: number;
  beds: Bed[];
  roomCapacity: string;
  totalRoomPrice: string;
  roomPrice?: string; // Optional, present only in some cases
}

interface Bed {
  bedType: string;
  numberOfBeds: string;
}

interface Hotel {
  name: string;
  address: string;
}
interface PrivacyDetailsProps {
  agent: User | null;
}
const privacyDetailsSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(7, "Password must be 7 or more characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type TPrivacyDetailsSchema = z.infer<typeof privacyDetailsSchema>;
const PrivacyDetails: React.FC<PrivacyDetailsProps> = ({ agent }) => {
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<TPrivacyDetailsSchema>({
    resolver: zodResolver(privacyDetailsSchema),
  });

  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    console.log(data, "datum");
    setIsSubmitButtonClicked(true);
  };
  return (
    <div className="w-3/4 space-y-6 ">
      <div className="space-y-2 pt-3 pb-7 border-b-2">
        <CardTitle>Privacy Details</CardTitle>
        <CardDescription className="">
          This is how others will see you on the site.
        </CardDescription>
      </div>
      {agent && (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label>Enter Current Password</Label>
            <Input
              type="password"
              {...register("currentPassword")}
              placeholder="current password"
            />
            {errors.currentPassword && (
              <p className=" text-red-600 ">{`${errors.currentPassword.message}`}</p>
            )}
            <CardDescription className="mt-1">
              Make sure the password is not similar to previous one.
            </CardDescription>
          </div>

          <div className="space-y-1.5">
            <Label>Enter New Pssword</Label>
            <Input
              type="password"
              {...register("newPassword")}
              placeholder="new password"
            />
            {errors.newPassword && (
              <p className=" text-red-600 ">{`${errors.newPassword.message}`}</p>
            )}
            <CardDescription className="mt-1">
              Make sure the password is not similar to previous one.
            </CardDescription>
          </div>
          <div className="space-y-1.5">
            <Label>Confirm New Pssword</Label>
            <Input
              type="password"
              {...register("confirmPassword")}
              placeholder="confirm password"
            />
            {errors.confirmPassword && (
              <p className=" text-red-600 ">{`${errors.confirmPassword.message}`}</p>
            )}
            <CardDescription className="mt-1">
              Make sure the password is not similar to previous one.
            </CardDescription>
          </div>

          <Button
            className="bg-blue-700 hover:bg-blue-800 font-light"
            type="submit"
            disabled={isSubmitButtonClicked}
          >
            Update Password
          </Button>
        </form>
      )}
    </div>
  );
};

export default PrivacyDetails;
