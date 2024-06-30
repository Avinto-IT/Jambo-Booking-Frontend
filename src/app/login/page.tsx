"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useState } from "react";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleLogin = async () => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
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
    <div className="w-full h-full flex place-content-center place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin} className="w-full">
            Sign in
          </Button>
        </CardFooter>
      </Card>

      {message && <p>{message}</p>}
    </div>
  );
}
