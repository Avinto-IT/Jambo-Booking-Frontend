"use client";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Controller, FieldValues, useForm } from "react-hook-form";

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
    agencyname: z
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
    tourscompleted: z.number().int().positive(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords must match",
    path: ["confirmpassword"],
  });
type TSignUpSchema = z.infer<typeof signUpSchema>;
const RegisterAgent = () => {
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
  });
  const onSubmit = async (data: FieldValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("submitted", data);
    reset();
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
        <p className="text-3xl font-semibold">Register Agent Account </p>
        <p className="text-sm text-[#64748B] mt-3">
          Enter your information to create an account.
        </p>
        <br />
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-5 text-[#64748B]">
            <div className="flex space-x-4 ">
              <Label className="space-y-2  w-1/2">
                <span className="">First name</span>
                <Input
                  {...register("firstName")}
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
                  {...register("lastName", {
                    required: "This is required",
                  })}
                  placeholder="Robbinson"
                  className="w-full"
                />
                {errors.lastName && (
                  <p className=" text-red-600 ">{`${errors.lastName.message}`}</p>
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
                <p className=" text-red-600 ">{`${errors.email.message}`}</p>
              )}
            </Label>
            <Label className="space-y-2 w-full">
              <span className="">Phone Number</span>
              <Input
                {...register("phone")}
                placeholder="phone"
                className="w-full"
              />
              {errors.phone && (
                <p className=" text-red-600 ">{`${errors.phone.message}`}</p>
              )}
            </Label>
            <Label className="space-y-2 w-full">
              <span className="">Name of Agency</span>
              <Input
                {...register("agencyname")}
                placeholder="Name of agency"
                className="w-full"
              />
              {errors.agencyname && (
                <p className=" text-red-600 ">{`${errors.agencyname.message}`}</p>
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
              {/* <Controller
                {...register("location")}
                name="location"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={locationOptions}
                    placeholder="Select Location"
                    isClearable
                  />
                )}
              /> */}

              {errors.location && (
                <p className=" text-red-600 ">{`${errors.location.message}`}</p>
              )}
            </Label>
            <Label className="space-y-2 w-full">
              <span className="">Tours Completed(Last Year)</span>
              <Input
                type="number"
                {...register("tourscompleted", { valueAsNumber: true })}
                placeholder="tours completed"
                className="w-full"
              />
              {errors.tourscompleted && (
                <p className=" text-red-600 ">{`${errors.tourscompleted.message}`}</p>
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
                <p className=" text-red-600 ">{`${errors.password.message}`}</p>
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
                <p className=" text-red-600 ">{`${errors.confirmpassword.message}`}</p>
              )}
            </Label>
            <Button
              type="submit"
              className=" w-full h-10 bg-blue-600 hover:bg-blue-800"
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
                Increased Booking Efficiency
              </p>
              <p className="text-[#6B7280]">
                Our intuitive platform reduces the time spent on each booking,
                allowing you to serve more clients in less time.
              </p>
            </div>
          </div>
          <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
            <Image src={tick} alt="tickmark" className="pt-1" />
            <div className="">
              <p className="text-xl font-semibold">
                Higher Client Satisfaction
              </p>
              <p className="text-[#6B7280]">
                Access exclusive B2B rates and special deals not available to
                the general public.
              </p>
            </div>
          </div>
          <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
            <Image src={tick} alt="tickmark" className="pt-1" />
            <div className="">
              <p className="text-xl font-semibold">Enhanced Profitability</p>
              <p className="text-[#6B7280]">
                Earn higher commissions with our competitive commission. Utilize
                our tools to suggest additional services.
              </p>
            </div>
          </div>
          <div className="flex justify-start items-start pl-5 gap-4 pt-2 ">
            <Image src={tick} alt="tickmark" className="pt-1" />
            <div className="">
              <p className="text-xl font-semibold">Dedicated Support</p>
              <p className="text-[#6B7280]">
                Our dedicated support team is available around the clock to
                assist with any issues or queries.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default RegisterAgent;
