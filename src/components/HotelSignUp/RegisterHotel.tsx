"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { FieldValue, FieldValues, useForm } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import tick from "../../../public/images/Tickmark.svg";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const locationSchema = z.object({
  locationID: z.string(),
  city: z.string(),
  country: z.string(),
});

const locationsSchema = z.array(locationSchema);

type Location = z.infer<typeof locationSchema>;

type LocationOption = {
  value: string;
  label: string;
};

const signUpSchema = z
  .object({
    firstName: z.string().min(1, "Please enter your first name"),
    lastName: z.string().min(1, "Please enter your last name"),
    email: z.string().email(),
    phone: z
      .string()
      .regex(/^\d+$/, { message: "Phone number must contain only digits" })
      .min(10, { message: "Phone number must be at least 10 digits long" }),
    hotelname: z
      .string()
      .min(3, { message: "Must be 3  or more characters long" }),
    password: z
      .string()
      .min(7, "Password must be 7 or more characters long")
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmpassword: z.string(),
    location: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords must match",
    path: ["confirmpassword"],
  });
type TSignUpSchema = z.infer<typeof signUpSchema>;
const RegisterHotel = () => {
  const {
    setError,
    register,
    handleSubmit,
    control,
    trigger,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    // } = useForm<FormValue>({
  });
  const onSubmit = async (data: FieldValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    reset();
    setLocations([]);
  };

  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/getLocation");
        const data = await response.json();

        // Validate data with zod
        const result = locationsSchema.safeParse(data);
        if (result.success) {
          setLocations(result.data);
        } else {
          console.error("Validation error:", result.error);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationChange = (selectedOption: LocationOption | null) => {
    if (selectedOption) {
      // Assuming setValue is defined elsewhere in your component
      setValue("location", selectedOption.value);
    }
  };

  const locationOptions: LocationOption[] = locations.map((location) => ({
    value: location.locationID,
    label: `${location.city}, ${location.country}`,
  }));

  return (
    <div className="text-[#020617] flex">
      <div className=" w-1/2  ">
        <p className="text-3xl font-semibold">Register Hotel Account </p>
        <p className="text-sm text-[#64748B] mt-3">
          Enter your information to create an account.
        </p>
        <br />
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="flex flex-col space-y-5 text-[#64748B]">
            <div className="flex space-x-4 ">
              <Label className="space-y-2  w-1/2">
                <span className="">First name</span>
                <Input
                  {...register("firstName", {})}
                  placeholder="max"
                  className="w-full"
                />
                {errors.firstName && (
                  <p className=" text-red-600 ">{`${errors.firstName.message}`}</p>
                )}
              </Label>

              <Label className="space-y-2 w-1/2">
                <span className="">Last name</span>
                <Input
                  {...register("lastName", {})}
                  placeholder="Robinson"
                  className="w-full"
                />
                {errors.lastName && (
                  <p className="text-red-600">{`${errors.lastName.message}`}</p>
                )}
              </Label>
            </div>
            <Label className="space-y-2 w-full">
              <span className="">Email</span>
              <Input
                {...register("email")}
                placeholder="m@example.com"
                className="w-full"
              />
              {errors.email && (
                <p className="text-red-600">{`${errors.email.message}`}</p>
              )}
            </Label>
            <Label className="space-y-2 w-full">
              <span className="">Phone Number</span>
              <Input
                {...register("phone")}
                placeholder="+977 9812345678"
                className="w-full"
              />
              {errors.phone && (
                <p className="text-red-600 ">{`${errors.phone.message}`}</p>
              )}
            </Label>
            <Label className="space-y-2 w-full">
              <span className="">Name of Hotel</span>
              <Input
                {...register("hotelname")}
                placeholder="Max Agency"
                className="w-full"
              />
              {errors.hotelname && (
                <p className="text-red-600 ">{`${errors.hotelname.message}`}</p>
              )}
            </Label>
            <Label className="space-y-2 w-full">
              <span className="">Location</span>
              <Select
                {...register("location")}
                options={locationOptions}
                onChange={handleLocationChange}
                placeholder="Select Location"
              />
              {errors.location && (
                <p className=" text-red-600 ">{`${errors.location.message}`}</p>
              )}
            </Label>

            <Label className="space-y-2 w-full">
              <span className="">Password</span>
              <Input
                type="password"
                {...register("password")}
                placeholder="Enter password"
                className="w-full"
              />
              {errors.password && (
                <p className="text-red-600 ">{`${errors.password.message}`}</p>
              )}
            </Label>
            <Label className="space-y-2 w-full">
              <span className="">Confirm Password</span>
              <Input
                type="password"
                {...register("confirmpassword")}
                placeholder="Re-enter password"
                className="w-full"
              />
              {errors.confirmpassword && (
                <p className="text-red-600 ">{`${errors.confirmpassword.message}`}</p>
              )}
            </Label>
            <Button
              className=" w-full h-10 bg-blue-600 hover:bg-blue-800"
              type="submit"
            >
              Register account
            </Button>
            <div className=" flex justify-center text-sm">
              <p className="text-[#64748B]">Already have an account? </p>
              <Link href="/login" className="text-blue-600">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>

      <div className="w-1/2 h-fit  flex justify-end pl-24  tracking-tighter leading-7">
        <Card className="bg-[#FEFCE8] rounded-lg py-6 space-y-1 pr-5 ">
          <div className="flex justify-start items-start pl-5 gap-4 ">
            <Image src={tick} alt="tickmark" className="pt-1" />
            <div className="">
              <p className="text-xl font-semibold">
                Increased Bookings and Revenue
              </p>
              <p className="text-[#6B7280]">
                Our extensive network of travel agents ensures higher visibility
                and increased bookings.
              </p>
            </div>
          </div>
          <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
            <Image src={tick} alt="tickmark" className="pt-1" />
            <div className="">
              <p className="text-xl font-semibold">Enhanced Market Reach</p>
              <p className="text-[#6B7280]">
                Connect with a worldwide network of travel agencies and agents,
                expanding your market reach.
              </p>
            </div>
          </div>
          <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
            <Image src={tick} alt="tickmark" className="pt-1" />
            <div className="">
              <p className="text-xl font-semibold">
                Improved Guest Satisfaction
              </p>
              <p className="text-[#6B7280]">
                Provide seamless booking experiences with real-time room
                availability and instant confirmations.
              </p>
            </div>
          </div>
          <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
            <Image src={tick} alt="tickmark" className="pt-1" />
            <div className="">
              <p className="text-xl font-semibold">
                Comprehensive Performance Analytics
              </p>
              <p className="text-[#6B7280]">
                Access in-depth reports on booking trends, guest demographics,
                and market performance.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default RegisterHotel;
