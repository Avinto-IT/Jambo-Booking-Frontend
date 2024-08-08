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
import AgentSideCard from "./AgentSideCard";
import { InputNumber } from "../ui/numberInput";
import { toast, Toaster } from "sonner";
import { InputPhoneNumber } from "../ui/phoneNumberInput";

const signUpSchema = z
  .object({
    firstName: z.string().min(1, "Please enter your first name"),
    lastName: z.string().min(1, "Please enter your last name"),
    email: z.string().email(),
    phone: z
      .string()
      // .regex(/^\d+$/, { message: "Phone number must contain only digits" })
      .min(10, { message: "Phone number must be at least 10 digits long" }),
    agencyname: z
      .string()
      .min(3, { message: "Must be 3 or more characters long" }),
    password: z.string().min(7, "Password must be 7 or more characters long"),
    // .regex(/[A-Z]/, {
    //   message: "Password must contain at least one uppercase letter",
    // })
    // .regex(/[a-z]/, {
    //   message: "Password must contain at least one lowercase letter",
    // })
    // .regex(/\d/, { message: "Password must contain at least one number" })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "Password must contain at least one special character",
    // }),
    confirmpassword: z.string(),
    birthYear: z
      .number()
      .int()
      // .min(1900, { message: "Year must be 1900 or later" })
      .max(new Date().getFullYear(), {
        message: `Year must be ${new Date().getFullYear()} or earlier`,
      }),
    birthMonth: z
      .number()
      .int()
      .min(1, { message: "Month must be between 1 and 12" })
      .max(12, { message: "Month must be between 1 and 12" }),
    birthDay: z
      .number()
      .int()
      .min(1, { message: "Day must be between 1 and 31" })
      .max(31, { message: "Day must be between 1 and 31" }),
    tourscompleted: z.number().int().positive(),
    address: z.string().min(1, "Please enter your address"),
    city: z.string().min(1, "Please enter your city"),
    country: z.string().min(1, "Please enter your country"),
    postalCode: z.string().min(1, "Please enter your postal code"),
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
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    console.log(typeof data.address);
    setIsSubmitButtonClicked(true);
    try {
      const response = await fetch("/api/registerAgent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agencyName: data.agencyname,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          contactNumber: data.phone,
          toursCompleted: data.tourscompleted,
          address: `${data.address}, ${data.city}, ${data.country}, ${data.postalCode}`,
          dateOfBirth: `${data.birthYear}-${data.birthMonth
            .toString()
            .padStart(2, "0")}-${data.birthDay.toString().padStart(2, "0")}`,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setIsSubmitButtonClicked(false);
        reset();
      } else {
        toast.error(result.error);
        setIsSubmitButtonClicked(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error: Unable to register agent.");
      setIsSubmitButtonClicked(false);
    }
  };

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
                  placeholder="Max"
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
                  placeholder="Robinson"
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
              <InputPhoneNumber
                {...register("phone")}
                placeholder="+977-9812345678"
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
              <span className="font-semibold">Your Address</span>
              <div className="flex gap-x-3">
                <div className="w-full flex flex-col gap-y-2">
                  <span className="text-xs">Address</span>
                  <Input
                    {...register("address")}
                    placeholder="123 Main St"
                    className="w-full"
                  />
                  {errors.address && (
                    <p className="text-red-600">{`${errors.address.message}`}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-x-3">
                <div className="w-1/3 flex flex-col gap-y-2">
                  <span className="text-xs">City</span>
                  <Input
                    {...register("city")}
                    placeholder="City"
                    className="w-full"
                  />
                  {errors.city && (
                    <p className="text-red-600">{`${errors.city.message}`}</p>
                  )}
                </div>
                <div className="w-1/3 flex flex-col gap-y-2">
                  <span className="text-xs">Country</span>
                  <Input
                    {...register("country")}
                    placeholder="Country"
                    className="w-full"
                  />
                  {errors.country && (
                    <p className="text-red-600">{`${errors.country.message}`}</p>
                  )}
                </div>
                <div className="w-1/3 flex flex-col gap-y-2">
                  <span className="text-xs">Postal Code</span>
                  <Input
                    {...register("postalCode")}
                    placeholder="Postal Code"
                    className="w-full"
                  />
                  {errors.postalCode && (
                    <p className="text-red-600">{`${errors.postalCode.message}`}</p>
                  )}
                </div>
              </div>
            </Label>
            <Label className="space-y-2 w-full">
              <span className="font-semibold">Your Date Of Birth</span>
              <div className="flex gap-x-3">
                <div className="w-1/2 flex flex-col gap-y-2">
                  <span className="text-xs">Year</span>
                  <InputNumber
                    {...register("birthYear", { valueAsNumber: true })}
                    placeholder="1990"
                  />
                  {errors.birthYear && (
                    <p className="text-red-600">{`${errors.birthYear.message}`}</p>
                  )}
                </div>
                <div className="w-1/4 flex flex-col gap-y-2">
                  <span className="text-xs">Month</span>
                  <InputNumber
                    {...register("birthMonth", { valueAsNumber: true })}
                    placeholder="05"
                  />
                  {errors.birthMonth && (
                    <p className="text-red-600">{`${errors.birthMonth.message}`}</p>
                  )}
                </div>
                <div className="w-1/4 flex flex-col gap-y-2">
                  <span className="text-xs">Day</span>
                  <InputNumber
                    {...register("birthDay", { valueAsNumber: true })}
                    placeholder="23"
                  />
                  {errors.birthDay && (
                    <p className="text-red-600">{`${errors.birthDay.message}`}</p>
                  )}
                </div>
              </div>
            </Label>
            <Label className="space-y-2 w-full">
              <span className="">Tours Completed(Last Year)</span>
              <InputNumber
                type="number"
                {...register("tourscompleted", { valueAsNumber: true })}
                placeholder="Tours completed"
                className="w-full"
              />
              {errors.tourscompleted && (
                <p className=" text-red-600 ">{`${errors.tourscompleted.message}`}</p>
              )}
            </Label>
            <Label className="space-y-2 w-full">
              <span className="font-semibold">Password</span>
              <Input
                type="password"
                {...register("password")}
                placeholder="Enter password"
                className="w-full"
              />
              {errors.password && (
                <p className="text-red-600">{`${errors.password.message}`}</p>
              )}
            </Label>
            <Label className="space-y-2 w-full">
              <span className="font-semibold">Confirm Password</span>
              <Input
                type="password"
                {...register("confirmpassword")}
                placeholder="Re-enter password"
                className="w-full"
              />
              {errors.confirmpassword && (
                <p className="text-red-600">{`${errors.confirmpassword.message}`}</p>
              )}
            </Label>
            <Button
              type="submit"
              className="w-full h-10"
              disabled={isSubmitButtonClicked}
            >
              Register account
            </Button>
            <div className="flex justify-center text-sm">
              <p className="text-[#64748B]">Already have an account? </p>
              <Link href="/login" className="text-blue-600">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
      <div className="w-1/2 h-fit flex justify-end pl-24 tracking-tighter leading-7">
        <AgentSideCard />
      </div>
      <Toaster />
    </div>
  );
};

export default RegisterAgent;
