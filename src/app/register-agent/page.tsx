"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function LoginForm() {
  const [message, setMessage] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    agencyName: "",
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    contactNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/registerAgent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, dateOfBirth }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(`Error: ${data.error}`);
      }
      toast({
        title: response.ok ? "Success" : "Error",
        description: data.message || data.error,
      });
    } catch (error) {
      console.log(error);
      setMessage("Error: Unable to add Agent account to queue.");
    }
  };
  useEffect(() => {
    console.log(message);
  }, [message]);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Register Agent Account</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Agency name</Label>
                <Input
                  id="agency-name"
                  name="agencyName"
                  placeholder="Booking"
                  value={formData.agencyName}
                  required
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    name="firstName"
                    placeholder="Max"
                    value={formData.firstName}
                    required
                    onChange={(e) => onChange(e)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    name="lastName"
                    placeholder="Robinson"
                    value={formData.lastName}
                    required
                    onChange={(e) => onChange(e)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  required
                  onChange={(e) => onChange(e)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Contact Number</Label>
                <Input
                  id="contact-number"
                  name="contactNumber"
                  placeholder="m@example.com"
                  value={formData.contactNumber}
                  required
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Date of Birth</Label>
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={setDateOfBirth}
                  className="rounded-md border"
                />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="#" className="underline">
                Sign in
              </Link>
            </div>
            {message}
          </CardContent>
        </Card>
      </form>
      <Toaster />
    </>
  );
}
