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
interface ProfileProps {
  agent: User | null;
}

const profileSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().min(1, "Please enter your last name"),
  email: z.string().email(),
  dateOfBirth: z.string(),
  phoneNumber: z.string(),
  location: z.string(),
});
type TProfileScehma = z.infer<typeof profileSchema>;
const Profile: React.FC<ProfileProps> = ({ agent }) => {
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TProfileScehma>({
    resolver: zodResolver(profileSchema),
  });

  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    console.log(data, "datum");
    setIsSubmitButtonClicked(true);
  };
  //   const [firstName, setFirstName] = useState<string | undefined>("");
  //   const [lastName, setLastName] = useState<string | undefined>("");
  //   const [email, setEmail] = useState<string | undefined>("");
  //   useEffect(() => {
  //     setFirstName(agent?.firstName || "");
  //     setLastName(agent?.lastName || "");
  //     setEmail(agent?.email || "");
  //   }, [agent]);
  return (
    <div className="w-3/4 space-y-6 ">
      <div className="space-y-2 pt-3 pb-7 border-b-2">
        <CardTitle>Profile</CardTitle>
        <CardDescription className="">
          This is how others will see you on the site.
        </CardDescription>
      </div>
      {agent && (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex w-full gap-4">
              <div className="w-1/2 space-y-2">
                <Label>First Name</Label>
                <Input
                  {...register("firstName")}
                  placeholder={agent.firstName}
                />
                {errors.firstName && (
                  <p className=" text-red-600 ">{`${errors.firstName.message}`}</p>
                )}
              </div>
              <div className="w-1/2 space-y-2">
                <Label>Last Name</Label>
                <Input {...register("lastName")} placeholder={agent.lastName} />
                {errors.lastName && (
                  <p className=" text-red-600 ">{`${errors.lastName.message}`}</p>
                )}
              </div>
            </div>
            <CardDescription className="mt-1">
              This is your public display name. It can be your real name or a
              pseudonym. You can only change this once every 30 days.
            </CardDescription>
          </div>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input {...register("email")} placeholder={agent.email} />
            {errors.email && (
              <p className=" text-red-600 ">{`${errors.email.message}`}</p>
            )}
            <CardDescription className="mt-1">
              You can manage verified email addresses in your email settings.
            </CardDescription>
          </div>

          <div className="space-y-1.5">
            <Label>Date of birth</Label>
            <Input
              {...register("dateOfBirth")}
              placeholder={agent.dateOfBirth}
              className="w-1/3"
            />
            {errors.dateOfBirth && (
              <p className=" text-red-600 ">{`${errors.dateOfBirth.message}`}</p>
            )}
            <CardDescription className="mt-1">
              Your date of birth is used to calculate your age.
            </CardDescription>
          </div>

          <div className="space-y-1.5">
            <Label>Phone Number</Label>
            <Input
              {...register("phoneNumber")}
              placeholder={agent.contactNumber}
            />
            {errors.phoneNumber && (
              <p className=" text-red-600 ">{`${errors.phoneNumber.message}`}</p>
            )}
            <CardDescription className="mt-1">
              You can manage your phone number here.
            </CardDescription>
          </div>

          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input {...register("location")} placeholder={agent.address} />
            {errors.location && (
              <p className=" text-red-600 ">{`${errors.location.message}`}</p>
            )}
            <CardDescription className="mt-1">
              You can manage your location information here.
            </CardDescription>
          </div>

          <Button
            className=" font-light"
            type="submit"
            disabled={isSubmitButtonClicked}
          >
            Update Profile
          </Button>
        </form>
      )}
    </div>
  );
};

export default Profile;
