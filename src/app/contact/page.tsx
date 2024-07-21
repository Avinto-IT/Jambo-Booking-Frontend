"use client";
import LayoutTwo from "@/components/Layout/LayoutTwo";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Mail, MapPin, Phone } from "lucide-react";
import React, { ChangeEvent, useState } from "react";

import twitter from "../../../public/images/footer/Twitter.svg";
import instagram from "../../../public/images/footer/Instagram.svg";
import facebook from "../../../public/images/footer/Facebook.svg";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BreadcrumbHome from "@/components/Home-Breadcrumb/BreadcrumbHome";

const Contact: React.FC = ({}) => {
  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    subject: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(info);
    setInfo({
      ...info,
      [e.target.id]: e.target.value,
    });
  };
  return (
    <div>
      <LayoutTwo imgTitle="Contact">
        <div className=" flex justify-center items-center">
          <MaxWidthWrapper>
            <BreadcrumbHome />
            <div className="text-[#0F172A] space-y-1.5">
              <p className="text-3xl  font-semibold">Contact Us</p>
              <p className="">Lorem ipsum league sparatum</p>
            </div>
            <div className="flex items-start  justify-between">
              <div className="w-6/12 bg-[#2563EB] text-[#F1F5F9] my-10 py-10 pl-10">
                <div className="gap-y-20">
                  <p className=" text-3xl font-semibold  mb-10">Get in touch</p>
                  <div className="">
                    <div className="flex gap-x-4 mb-5">
                      <div className="p-3 bg-opacity-10 bg-white rounded-full relative z-10 flex items-center justify-center">
                        <Mail className="z-20" />
                      </div>
                      <div className="">
                        <p className="text-sm opacity-50">Email us</p>
                        <p className="">jambohotels@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex gap-x-4 mb-5">
                      <div className="p-3 bg-opacity-10 bg-white rounded-full relative z-10 flex items-center justify-center">
                        <Phone className="z-20" />
                      </div>
                      <div className="">
                        <p className="text-sm opacity-50">Phone number</p>
                        <p className="">+91 70218 30839</p>
                      </div>
                    </div>
                    <div className="flex gap-x-4 mb-5">
                      <div className="p-3 bg-opacity-10 bg-white rounded-full relative z-10 flex items-center justify-center">
                        <MapPin className="z-20" />
                      </div>
                      <div className="">
                        <p className="text-sm opacity-50">Location</p>
                        <p className="">Oslo, Norway</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16">
                    <div className="flex items-center gap-x-4">
                      <div className="w-8 outline outline-1 h-0"></div>
                      <p className="">Connect with us:</p>
                    </div>

                    <div className="flex mt-4   gap-x-2">
                      <div className="p-3 bg-opacity-10 bg-white rounded-sm relative z-10 flex items-center justify-center">
                        <Image src={instagram} alt="instagram" />
                      </div>
                      <div className="p-3 bg-opacity-10 bg-white rounded-sm relative z-10 flex items-center justify-center">
                        <Image src={facebook} alt="facebook" />
                      </div>
                      <div className="p-3 bg-opacity-10 bg-white rounded-sm relative z-10 flex items-center justify-center">
                        <Image src={twitter} alt="twitter" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-8/12 pl-10 flex flex-col justify-start my-10 ">
                <CardContent className="w-full  flex flex-col  ">
                  <form className=" w-full ">
                    <div className="grid w-full items-center  gap-y-4">
                      <div className="flex gap-x-3 w-full ">
                        <div className="flex flex-col  space-y-1.5 w-1/2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="Max"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5 w-1/2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Robbinson"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+977 9876543210"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          placeholder="m@example.com"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Lorem Ipsum"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="mssg">Write a message</Label>
                        <Textarea
                          id="mssg"
                          placeholder="Minimum 100 words"
                          className="min-h-28"
                          onChange={(e) => e.target.value}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="">
                  <Button className="w-full bg-blue-700 hover:bg-blue-900">
                    Send a message
                  </Button>
                </CardFooter>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </LayoutTwo>
    </div>
  );
};

export default Contact;
