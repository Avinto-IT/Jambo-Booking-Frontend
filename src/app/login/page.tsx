"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ChangeEvent, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import jamboicon from "../../../public/images/login/Logo.svg";
import Image from "next/image";
import LoginHeader from "@/components/Logins/LoginHeader";

export default function Login() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [fields, setFields] = useState({ email: "", password: "" });
  console.log(fields);
  const [message, setMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: fields.email,
        password: fields.password,
      }),
    });
    try {
      const data = await response.json();
      if (response.status === 200) {
        const userDetails = data.user;
        setMessage(data.message);
        Cookies.set("userDetails", JSON.stringify(userDetails), {
          expires: 7,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
        });
        localStorage.setItem("token", data.token);

        window.location.href = "/dashboard";
      } else {
        setMessage(data.error || "Login Failed");
      }
    } catch {
      setMessage("Internal Server Error");
    }
  };

  return (
    <>
      <LoginHeader
        handleBack={() => {
          const handleBack = null;
        }}
      />

      <div className="w-full grid grid-cols-2 overflow-hidden">
        <div className="flex items-center justify-center  ">
          <div className="mx-auto grid  ">
            <div className="w-full flex place-content-center place-items-center">
              <div className="w-full max-w-sm  ">
                <CardHeader>
                  <CardTitle className="text-3xl leading-10">Login</CardTitle>
                  <CardDescription>
                    Enter your email below to login to your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="font-semibold">
                      Email
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      // value={fields.email}
                      // onChange={(e) => setEmail(e.target.value)}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password" className="font-semibold">
                        Password
                      </Label>
                      <Link
                        href="/login/forgot-password"
                        className="text-[#2563EB] text-xs font-semibold"
                      >
                        <u>Forgot your password?</u>
                      </Link>
                    </div>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Enter Password"
                      // value={fields.password}
                      // onChange={(e) => setPassword(e.target.value)}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-800"
                  >
                    Login
                  </Button>
                </CardContent>

                <CardFooter>
                  <div className="text-xs text-[#64748B] w-full flex justify-center">
                    Don’t have an account? Signup as{" "}
                    <Link href="/" className="text-blue-600">
                      &nbsp;Agent&nbsp;
                    </Link>
                    or&nbsp;
                    <Link href="/" className="text-blue-600">
                      Hotel{" "}
                    </Link>{" "}
                  </div>
                </CardFooter>
                {message && (
                  <div className=" flex justify-center">
                    {" "}
                    <p className=" fixed w-fit px-2 shadow-xl  rounded-xl text-red-700 ">
                      {message}
                    </p>{" "}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full relative">
          <img
            src="https://s3-alpha-sig.figma.com/img/6d51/a99e/aa95fe53ed8bd181c312716544d23f80?Expires=1721001600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VkflaXHKVW4UBj3-3fvrlR-kxQmleCy25xRp-RVF8L9IN-NgbJpk4gR-PAP7WHt~X6OoiUnThur-RfX-4yp91ewRMNLyBL5wN5-WMvuVtIzwulA5jg5e6EbTusV90OzhAEvApw-RbTk0A7FEngNj97jPYGZq9mBoejy72lSxktKpEmd2wS45d-cPr0MiPrqi2YOH~jJ13q6fWwf1IH0OV0feIIfQYXFoU1hqp7Nt0PwwQfeVEL9xXQfVOfqYLHpIE6SLsoTCEyeLU9HxChIPyimOqPDQZQLLU-sLtUxvVnYO317hWVvtbBsPpzEhu0Hu7z8Q4A8NNz0XZDdZtJ8qlQ__"
            alt="Image"
            className="h-screen object-cover w-full"
          />
          <Image
            src={jamboicon}
            alt="icon"
            className="absolute top-20 right-20 z-10"
          />
          {/* <div className="h-full w-full bg-[#2563EB] relative inset-0 opacity-50"></div> */}
          <div className="absolute top-0 left-0 w-full h-full bg-[#2563EB] opacity-80 z-0"></div>
        </div>
      </div>
    </>
  );
}
